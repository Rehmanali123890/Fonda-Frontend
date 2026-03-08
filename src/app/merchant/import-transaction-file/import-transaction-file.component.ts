import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MerchantListDto } from 'src/app/Models/merchant.model';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { AppStateService } from '../../core/app-state.service';
import { SecurityService } from '../../core/security.service';
import { OrdersService } from 'src/app/core/orders.service';
import { HttpClient } from '@angular/common/http';
import * as moment from "moment";

@Component({
  selector: 'app-import-transaction-file',
  templateUrl: './import-transaction-file.component.html',
  styleUrls: ['./import-transaction-file.component.scss']
})
export class ImportTransactionFileComponent {
  @ViewChild('fileInput') fileInput: any;
  @Input() merchantId: string;
  disabledbtn: boolean = false;
  selectedPlatform: string;
  showloader: boolean = true;
  gettingMerchants: boolean;
  checkfilepath: boolean = false;
  emptyList: boolean = false
  Showalertmsg: boolean = false;
  selectedFile: File | null;
  startDate: string | Date;
  endDate: string | Date;
  filepath: string = ''
  uploadbtnname: string = "Browse CSV File"
  constructor(private toaster: ToastrService, private orderService: OrdersService, private securityService: SecurityService,
    private merchantservice: MerchantService, private appState: AppStateService, private http: HttpClient) { }

  onFileSelected(event: any) {
  
    this.filepath = this.getpath(event)
    if (this.filepath) {
      const filename = this.filepath.split("\\").pop();
      const fileExtension = filename.split('.').pop()?.toLowerCase();

      if (fileExtension !== 'csv') {
        this.toaster.error("Please upload a valid CSV file.");
        this.clearFileInput();
        this.checkfilepath = false;
        this.uploadbtnname = "Browse CSV File";
        this.filepath = '';
        return;
      }
      this.filepath = filename
      this.checkfilepath = true
      this.uploadbtnname = "Change CSV File"
    }
    // if (this.filepath) {
    //   const filePath = this.filepath;
    //   const filename = filePath.split("\\").pop();
      
    // }
    else {
      this.checkfilepath = false
      this.uploadbtnname = "Browse CSV File"
      this.filepath = ''
    }
    this.selectedFile = event.target.files[0];
  }

  getpath(event: any) {
    const fileInput = event.target;
    const file: File = fileInput.files[0];
    if (file) {
      const filePath = fileInput.value; // Get the file path
      return filePath;
    }
  }


  handleTransactionFileInput(docType: string) {
    this.disabledbtn = true;
    if (this.selectedFile) {
     {
        this.showloader = true
        const sTime = moment(this.startDate);
        const eTime = moment(this.endDate);
        const res = sTime.isAfter(eTime);
        if (res) {
          this.toaster.warning('Start Date should not be greater than End Date');
          this.disabledbtn = false;
          return;
        }
        console.log("Start Date: ", this.startDate);
        console.log("End Date: ", this.endDate);

        let terms_data = {
          "documenttype": docType,
          "startDate": this.startDate,
          "endDate": this.endDate
        }
        console.log("terms_data ", terms_data)
        console.log("this.fileToUpload  ", this.selectedFile)
        console.log("File uploading ------")
        console.log("File uploading ------")
        this.merchantservice.uploadtransactionfile(this.securityService.securityObject.token, this.selectedFile, terms_data).subscribe((data: any) => {
          this.toaster.success("We are currently processing the uploaded transactions file. You will soon receive an email from us containing the results of the file upload. However, you can upload a new transaction file while we process your latest upload.")
          this.disabledbtn = false;

        }, (err) => {
          this.toaster.error(err.error.message);
          this.disabledbtn = false;
        })
        
      }
    }
    else {
      this.toaster.error("File was not uploaded");

    }

  }
  clearFileInput() {
    this.fileInput.nativeElement.value = '';
  }
}



