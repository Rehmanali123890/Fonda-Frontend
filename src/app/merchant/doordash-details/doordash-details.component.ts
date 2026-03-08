import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService } from './../../core/analytics.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { ToastrService } from 'ngx-toastr';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { SecurityService } from './../../core/security.service';
import { MerchantListDto } from 'src/app/Models/merchant.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-doordash-details',
  templateUrl: './doordash-details.component.html',
  styleUrls: ['./doordash-details.component.css']
})
export class DoordashDetailsComponent {
  startDate: string
  endDate: string
  source: string
  type: string
  merchantId: string
  lasttransaction: number
  showmainloader: boolean = false
  unlocked_only: number
  status: number
  merchantDto = new MerchantListDto();
  newEndDate: any
  newStartDate: any
  financepayoutcalculationObj = []
  duration: any
  selectedMerchant: string;
  payout_id: string | null = null;
  exporting: any;
  showDropdown: boolean = false; 
  headers = []
  dataRows = []
  originalFileData  = []
  parsingData: boolean = true
  constructor(private toaster: ToastrService, private route: ActivatedRoute, private anaLytics: AnalyticsService, private merchantService: MerchantService, private router: Router, private securityService: SecurityService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.startDate = params['startdate'];
      this.endDate = params['enddate'];
      this.source = params['source'];
      this.type = params['type'];
      this.merchantId = params['merchantId'];
      this.lasttransaction = params['lasttransaction'];
      this.unlocked_only = params['unlocked_only'];
      this.status = params['status'];
      this.duration = params['duration'];
      this.payout_id = params['payout_id'];


    });
    this.getfinancereport()
    this.GetMerchantDetail()
    this.downloadTransactionReport()
  }
  getfinancereport() {
    this.showmainloader = true
    this.newStartDate = new Date(this.startDate);
    this.newEndDate = new Date(this.endDate);
    const mData = {
      "startDate": this.startDate,
      "endDate": this.endDate,
      "orderSource": this.source,
      "unlocked_only": this.unlocked_only,
      "payout_id": this.payout_id
    };
    this.merchantService.getfinancepayout(this.merchantId, mData).subscribe((data: any) => {
      this.financepayoutcalculationObj = data.data
      this.financepayoutcalculationObj['transactions'] = JSON.parse(this.financepayoutcalculationObj['transactions'])
      console.log("calculate transfer financepayoutcalculationObj ", this.financepayoutcalculationObj)
      this.showmainloader = false;
    }, (err) => {
      this.showmainloader = false;
      this.toaster.error(err.error.message);
    })
  }
  
  GetMerchantDetail() {

    this.merchantService.GetMerchantById(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;
      console.log("data merchant",data)
      this.selectedMerchant = data.merchantName;

    }, (err) => {
      this.toaster.error(err.message);
    })
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  downloadTransactionReport() {
    this.parsingData = true
    const startDate = new Date(this.startDate).toISOString().split('T')[0];
    const endDate = new Date(this.endDate).toISOString().split('T')[0];
    const platform = "doordash"; // Use the platform you're interested in
    this.merchantService.getTransactionSummaryReport(this.merchantId, startDate, endDate, platform, this.payout_id).subscribe(
      (response: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Read the file as an Excel workbook
          const data = new Uint8Array(reader.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
  
          // Get the first sheet
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
          // Convert the sheet to JSON
          const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
          const headers = jsonData[9]; // 6th row as headers
          const dataRows = jsonData.slice(10); // Rows below the headers  
          this.headers = headers;
          this.dataRows = dataRows;  
          this.originalFileData = jsonData;
  
          this.parsingData = false
        };
        reader.readAsArrayBuffer(response); // Read the response as ArrayBuffer
      },
      (err) => {
        this.toaster.error(err.error.message);
        this.parsingData = false
      }
    );
  }
  
  downloadOriginalFile(format: string) {
    const startDate = new Date(this.startDate).toISOString().split('T')[0];
    const endDate = new Date(this.endDate).toISOString().split('T')[0];
    const jsonData = this.originalFileData; // This is the JSON you already have from the server
    const combinedData = jsonData; 
    // Create a new workbook using XLSX
    this.exporting = true;
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(combinedData); 
    
    // Append the sheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Original Data");
    // Write the workbook to a Blob, depending on the format (Excel or CSV)
    const fileBlob = XLSX.write(workbook, {
      bookType: format === 'excel' ? 'xlsx' : 'csv',
      type: 'array',  // Use 'array' to create a Blob
    });
      // Create a Blob from the data and set the MIME type based on the format
    const blob = new Blob([fileBlob], {
      type: format === 'excel'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        : 'text/csv',
    });
  
    // Define file extension and filename
    const fileExtension = format === 'excel' ? '.xlsx' : '.csv';
    const fileName = `Doordash Transaction Summary Report - ${this.selectedMerchant} (from ${startDate} to ${endDate})`;
  
    // Create a URL for the Blob and trigger the download
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  
    // Clean up the Blob URL
    window.URL.revokeObjectURL(url);
    this.exporting = false;
  }

  async redirectBack() {

    const compl = await this.router.navigateByUrl('/home/merchants/merchant-setting/' + this.merchantId);
  }
  historyBack(startDate: string, endDate: string) {
    const queryParams = {
      startDate: this.startDate,
      endDate: this.endDate,
      type: this.type
    };
    if (this.type == "dashboard") {
      this.router.navigate(['/home/dashboard'], { queryParams: queryParams });
    }
    else if (this.type == "new-payout") {
      this.router.navigate([`/home/merchants/merchant-setting/${this.merchantId}`], { queryParams: queryParams });
    }
    else {
      window.history.back()
    }
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

}
