import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppStateService } from 'src/app/core/app-state.service';
import { MerchantService } from 'src/app/core/merchant.service';
import * as moment from "moment";
import { MerchantListDto } from 'src/app/Models/merchant.model';
import { SecurityService } from './../../core/security.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'angular-bootstrap-md';
import { TranslocoService } from '@ngneat/transloco';

interface PayoutSummaryReportResponse {
  status: string;
  message: string;
  data: any[];
}
@UntilDestroy()
@Component({
  selector: 'app-finnace-report',
  templateUrl: './finnace-report.component.html',
  styleUrls: ['./finnace-report.component.scss']
})
export class FinnaceReportComponent implements OnInit {
  constructor( private merchantService: MerchantService, private route: ActivatedRoute, private appState: AppStateService, private securityService: SecurityService ,private toaster: ToastrService,private translocoService: TranslocoService,private activatedRoute: ActivatedRoute) { }
  @ViewChild('createOurPoints') createOurPoints: ModalDirective;
  merchantId: string;
  startDate: string | Date;
  endDate: string | Date;
  filterType = 2;
  emailBTN = 1;
  isConsoloidateChecked: boolean = false
  consolidate = 0
  consolidateReport: any = [];
  gettingFinanceReport: boolean = false
  ordersReport: any = []
  selectedMerchant: any;
  merchantDto = new MerchantListDto();
  exporting: any;
  headers = []
  dataRows = []
  originalFileData  = []
  parsingData: boolean = true
  dataExists: boolean = true
  disableExport: boolean = false
  MerchantsList: MerchantListDto[] = [];
  gettingMerchants: boolean;
  tagsEmailDistributionArray: string[] = []
  popupheadeing: string
  payoutiD: string

  ngOnInit(): void {
    const queryParams = this.activatedRoute.snapshot.queryParams;

    if (queryParams['applyStartDate'] && queryParams['applyEndDate']) {
      this.startDate = queryParams['applyStartDate'];
      this.endDate = queryParams['applyEndDate'];
    }
    else{
      this.startDate = moment().subtract(6, "days").format('YYYY-MM-DD');
      this.endDate = moment().format('YYYY-MM-DD');
    }

    this.subscribeAppState()
    this.GetMerchantsList()
    this.GetMerchantDetail()
  }
  subscribeAppState() {
    this.merchantId = this.appState.currentMerchant;

    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.merchantId = merchntId;
      //this.downloadPayoutSummaryReport()
    })
  }
  
  MerchantChanged() {
    this.appState.currentMerchant = this.merchantId;
  }

  GetMerchantsList() {
    this.gettingMerchants = true;
    this.merchantService
      .GetMerchants(this.securityService.securityObject.token)
      .subscribe(
        (data: MerchantListDto[]) => {
          this.MerchantsList = data;
          if (this.MerchantsList && this.MerchantsList.length) {
            // this.merchantId = this.MerchantsList[0].id;
            this.downloadPayoutSummaryReport();
          }
          this.gettingMerchants = false;
        },
        (err) => {
          this.toaster.error(err.message);
          this.gettingMerchants = false;
        }
      );
  }

  changeDateAccordinglyAndSearch() {
    // if (+this.filterType === 1) {
    //   this.startDate = moment().format('YYYY-MM-DD');
    //   this.endDate = moment().format('YYYY-MM-DD');
    // }
    if (+this.filterType === 2) {
      this.startDate = moment().subtract(6, 'days').format("YYYY-MM-DD");
      this.endDate = moment().format('YYYY-MM-DD');
    }
    if (+this.filterType === 3) {
      this.startDate = moment().startOf('week').subtract(1, 'days').startOf('week').add(1, 'day').format("YYYY-MM-DD");
      this.endDate = moment().startOf('week').format('YYYY-MM-DD');
    }
    if (+this.filterType === 4) {
      this.startDate = moment().startOf('month').subtract(1, 'days').startOf('month').format("YYYY-MM-DD");
      this.endDate = moment().startOf('month').subtract(1, 'days').format('YYYY-MM-DD');
    }
    const sTime = moment(this.startDate);
    const eTime = moment(this.endDate);
    const res = sTime.isAfter(eTime);
    if (res) {
      this.toaster.warning('Start Date should not be greater than End Date');
      return;
    }
    // if (+this.filterType === 5) {
    const diffRes = eTime.diff(sTime, 'days');
    if (diffRes > 30) {
      this.toaster.warning('Difference of Start & End Dates should not be greater than 30 days.');
      return;
    }
    // }
    // if (+this.filterType !== 5) {


    // }
  }

  //payout summary report
  GetMerchantDetail() {

    this.merchantService.GetMerchantById(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;
      console.log("data merchant",data)
      this.selectedMerchant = data.merchantName;
      if (this.merchantDto.emailDistributionList != null) {
        this.tagsEmailDistributionArray = [...this.tagsEmailDistributionArray, ...this.merchantDto.emailDistributionList.split(";")]
      }
      else {
        this.tagsEmailDistributionArray = [...this.tagsEmailDistributionArray]
      }
      console.log("this.emaildistrubuiton list is ", this.tagsEmailDistributionArray)

    }, (err) => {
      this.toaster.error(err.message);
    })
  }

  getModifiedHeaders() {
    return this.headers.slice(2); // Slices off the first two columns (payout_id, payout_type)
  }
  getModifiedRows() {
    return this.dataRows.map(row => row.slice(2)); // Slices off the first two columns (payout_id, payout_type)
  }
  formatAndEncodeDate(date: string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    console.log("Invalid date", date);
    return encodeURIComponent(date);
  }

  // Get local year, month, day
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // month is zero-based
  const day = d.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  return encodeURIComponent(formattedDate);
  }
  downloadPayoutSummaryReport(directDownload: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!directDownload) {
        this.headers = [];
        this.parsingData = true;
        this.dataRows = [];
      } else {
        this.originalFileData = [];
      }
  
      const startDate = new Date(this.startDate).toISOString().split('T')[0];
      const endDate = new Date(this.endDate).toISOString().split('T')[0];
  
      this.merchantService.getPayoutSummaryReport(this.merchantId, startDate, endDate).subscribe(
        (response: Blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const data = new Uint8Array(reader.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
            if (!directDownload) {
              const headers = jsonData[4] || ["No records available for the given period."];
              const dataRows = jsonData.slice(5);
              this.headers = headers;
              this.dataRows = dataRows;
              //console.log("datarows",this.headers)
  
              this.parsingData = false;
            }
  
            this.originalFileData = jsonData;
            resolve(this.originalFileData); // Resolve the Promise when data is ready
          };
  
          reader.readAsArrayBuffer(response);
        },
        (err) => {
          this.toaster.error(err.error.message);
          this.parsingData = false;
          reject(err); // Reject the Promise on error
        }
      );
    });
  }
  
  
  downloadOriginalFile(format: string) {
    this.exporting = true
    const startDate = new Date(this.startDate).toISOString().split('T')[0];
    const endDate = new Date(this.endDate).toISOString().split('T')[0];
  
    this.downloadPayoutSummaryReport(true)
      .then((jsonData) => {
        var headers = jsonData[4] || "No records available for the given period.";
        if (headers === "No records available for the given period."){
          this.exporting = false
          this.toaster.error("No records available for the given period.")
          return;
        }
        
        jsonData = jsonData.map((row, index) => {
          // Skip empty rows and rows without enough columns
          if (row.length === 0 || index < 4) return row;
          // Remove the first two columns for the data rows
          return row.slice(2);
      });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(jsonData);
        
        // Append the worksheet
        XLSX.utils.book_append_sheet(workbook, worksheet, "Original Data");
  
        // Write the workbook to a Blob
        const fileBlob = XLSX.write(workbook, {
          bookType: format === 'excel' ? 'xlsx' : 'csv',
          type: 'array',
        });
  
        // Create a Blob and define the MIME type
        const blob = new Blob([fileBlob], {
          type: format === 'excel'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv',
        });
  
        // Define file extension and filename
        const fileExtension = format === 'excel' ? '.xlsx' : '.csv';
        const fileName = `Payout Summary Report - ${this.selectedMerchant} (from ${startDate} to ${endDate})`;
  
        // Trigger the download
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
  
        // Clean up the Blob URL
        window.URL.revokeObjectURL(url);
        this.exporting = false
      })
      .catch((err) => {
        console.error("Error downloading the file:", err);
        this.exporting = false
      });
  }
  

  sendEmailforAll(){
    if (this.emailBTN===1){
      this.SendPayoutSummaryReportEmail()
    }
    else if (this.emailBTN===2){
      this.sendEmailPayout()
    }
    else if (this.emailBTN===3){
      this.sendEmailPayoutOld()
    }
  }

  
  SendPayoutSummaryReportEmail() {
    this.gettingSummaryReportNew = true;
    const startDate = new Date(this.startDate).toISOString().split('T')[0];
    const endDate = new Date(this.endDate).toISOString().split('T')[0];
  
    if (this.tagsEmailDistributionArray[0] == '') {
      this.tagsEmailDistributionArray.shift();
    }
  
    this.merchantService.sendSummaryEmailPayoutSummary(this.merchantId, {
      'startDate': startDate,
      'endDate': endDate,
      'send_email': 1,
      'emails': this.tagsEmailDistributionArray
    }).subscribe({
      next: (result: PayoutSummaryReportResponse) => { // Specify the response type here
        console.log("result", result);
        // Display the message from the response
        if (result && result.message) {
          if (result.message == "No records available for the given period."){

            this.toaster.error(result.message); // Show the message in a error toast
          }else{
            
            this.toaster.success(result.message); // Show the message in a success toast
          }
        }
        
        this.gettingSummaryReportNew = false;
        this.closeModal();
      },
      error: err => {
        console.error(err);
        this.toaster.error(err.error.message || 'An error occurred while sending the email.');
        this.gettingSummaryReportNew = false;
      }
    });
  }
  

  formatCell(cell: any): string | number {
    // Check if the cell is a number
    if (!isNaN(cell)) {
      // Round to 2 decimal places and return
      return Math.round(Number(cell) * 100) / 100;
    }
    // Return as-is for other types (e.g., strings)
    return cell;
  }


  openModalforCreatePoints(popupheadingText: string) {
    this.translocoService.selectTranslate(popupheadingText).subscribe(translation => {
      this.popupheadeing = translation;
    });
    this.tagsEmailDistributionArray = []
    this.GetMerchantDetail()
    this.createOurPoints.show()
  }
  closeModal() {
    this.createOurPoints.hide();
  }
  
gettingSummaryReportNew: boolean = false
// TAG INPUT CHIPS !!!
removeTag(tag) {
  let index = this.tagsEmailDistributionArray.indexOf(tag);
  this.tagsEmailDistributionArray = this.tagsEmailDistributionArray.filter((email, idx) => email !== tag)
}

grabInputDataChip() {
  const input: any = document.querySelector("input.tagChipInputField");

  if (!input) {
    return;
  }

  const createTag = () => {
    this.tagsEmailDistributionArray.push();
  };
  createTag();

  const addTag = (e) => {
    if (e.key == "Enter") {
      let tag = e.target.value.replace(/\s+/g, ' ');
      if (tag.length > 1 && !this.tagsEmailDistributionArray.includes(tag)) {
        tag.split(',').forEach(tag => {
          this.tagsEmailDistributionArray.push(tag);
          createTag();
        });
      }
      e.target.value = "";
    }
  };

  input.addEventListener("keyup", addTag);
  /* Remove All Button */
  // const removeBtn: any = document.querySelector(".tagChipDetails>button");
  // removeBtn.addEventListener("click", () =>{
  //     tags.length = 0;
  //     ul.querySelectorAll("li").forEach(li => li.remove());
  // });
}


inputText: string = '';
onEnterKeyPressed(e): void {
  let tag = this.inputText.replace(/\s+/g, ' ');
  if (tag.length > 1 && !this.tagsEmailDistributionArray.includes(tag)) {
    tag.split(',').forEach(tag => {
      this.tagsEmailDistributionArray.push(tag);
    });
  }
  this.inputText = "";
}


//newpayoutemail
sendEmailPayout(payoutid?) {

  if (this.payoutiD != "") {
    payoutid = this.payoutiD

  }

  if (this.tagsEmailDistributionArray[0] == '') {
    this.tagsEmailDistributionArray.shift();
  }

  this.merchantService.sendEmailPayoutFinance(this.merchantId, payoutid, { 'email': this.tagsEmailDistributionArray }).subscribe((data: any) => {
    this.toaster.success("Report Emailed!")
    this.closeModal()
  }, (err) => {
    this.toaster.error(err.error.message);
  })
}
//old payout
sendEmailPayoutOld(payoutid?) {

  if (this.payoutiD != "") {
    payoutid = this.payoutiD

  }

  if (this.tagsEmailDistributionArray[0] == '') {
    this.tagsEmailDistributionArray.shift();
  }

  this.merchantService.sendEmailPayout(this.merchantId, payoutid, { 'email': this.tagsEmailDistributionArray }).subscribe((data: any) => {
    this.toaster.success("Report Emailed!")
    this.closeModal()
  }, (err) => {
    this.toaster.error(err.error.message);
  })
}
}
