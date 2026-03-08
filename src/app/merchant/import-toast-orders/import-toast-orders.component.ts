import { Component, OnInit, ViewChild } from '@angular/core';
import { MerchantListDto } from 'src/app/Models/merchant.model';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { AppStateService } from '../../core/app-state.service';
import { SecurityService } from '../../core/security.service';
import { OrdersService } from 'src/app/core/orders.service';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-import-toast-orders',
  templateUrl: './import-toast-orders.component.html',
  styleUrls: ['./import-toast-orders.component.scss']

})
export class ImportToastOrdersComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  selectedMerchantId: string;
  gettingMerchants: boolean;
  checkfilepath: boolean = false;
  emptyList: boolean = false
  Showalertmsg: boolean = false;
  SuccessImportOrders: boolean
  MerchantsList: MerchantListDto[];
  selectedFile: File | null;
  csvdataObj = []
  filepath: string = ''
  uploadbtnname: string = "Browse CSV File"
  // errorList = [1234, 4567]
  successList = []
  errorList = []
  alreadyList = []
  constructor(private toaster: ToastrService, private orderService: OrdersService, private securityService: SecurityService,
    private merchantservice: MerchantService, private appState: AppStateService, private http: HttpClient, private translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.GetMerchantsList();
    // Initialize the button name using Transloco
    this.uploadbtnname = this.translocoService.translate('dashboard.Browse CSV File');
  }
  onFileSelected(event: any) {

    this.filepath = this.getpath(event)
    if (this.filepath) {
      const filePath = this.filepath;
      const filename = filePath.split("\\").pop();
      this.filepath = filename
      this.checkfilepath = true
      // this.uploadbtnname = "Change CSV File"
    }
    else {
      this.checkfilepath = false
      // this.uploadbtnname = "Browse CSV File"
      this.filepath = ''
    }
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvData = e.target.result;

        this.csvdataObj = this.csvStringToArray(csvData);

      };
      reader.readAsText(this.selectedFile);
    }
  }

  getpath(event: any) {
    const fileInput = event.target;
    const file: File = fileInput.files[0];
    if (file) {
      const filePath = fileInput.value; // Get the file path
      return filePath;
    }
  }
  csvStringToArray(csvString) {
    const rows = csvString.split('\n');
    const headers = rows[0].split(',');
    const data = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',');
      if (row.length !== headers.length) {
        // Skip rows with different column counts
        continue;
      }
      const rowData = {};
      for (let j = 0; j < headers.length; j++) {
        rowData[headers[j]] = row[j];
      }
      data.push(rowData);
    }

    return data;
  }

  GetMerchantsList() {

    this.gettingMerchants = true;
    this.merchantservice.GetMerchants(this.securityService.securityObject.token).subscribe((data: MerchantListDto[]) => {
      this.MerchantsList = data;

      if (!this.appState.currentMerchant && this.MerchantsList && this.MerchantsList.length) {
        this.selectedMerchantId = this.MerchantsList[0].id;

      } else if (this.appState.currentMerchant && this.MerchantsList && this.MerchantsList.length) {
        const find = this.MerchantsList.find(x => x.id === this.appState.currentMerchant);
        if (find) {
          this.selectedMerchantId = this.appState.currentMerchant;
        }
      }
      this.gettingMerchants = false;
    }, (err) => {
      this.gettingMerchants = false;
      this.toaster.error(err.error.message);
    })
  }
  Uploaddata() {
    this.emptyList = false
    if (this.csvdataObj.length > 0) {
      this.SuccessImportOrders = true
      this.Showalertmsg = false
      this.orderService.importToastOrders(this.selectedMerchantId,
        { "orderdataOBJ": this.csvdataObj, "token": this.securityService.securityObject.token }).subscribe((data) => {
          this.SuccessImportOrders = false
          this.Showalertmsg = true
          this.errorList = data['errorList']
          this.successList = data['successList']
          this.alreadyList = data['alreadyList']

        }, (err) => {
          this.toaster.error("Something wrong");
        })
    }
    else {
      this.emptyList = true

    }
  }
  downloadCSVFile(): void {
    const filePath = 'assets/CSV/ToastOrders.csv'; // Path to your CSV file in the assets folder

    this.http.get(filePath, { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        const downloadLink = document.createElement('a');
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = 'ToastOrders.csv'; // Specify the filename for the downloaded file
        downloadLink.click();
        URL.revokeObjectURL(url);
      });
  }
  clearFileInput() {
    this.fileInput.nativeElement.value = '';
  }
}
