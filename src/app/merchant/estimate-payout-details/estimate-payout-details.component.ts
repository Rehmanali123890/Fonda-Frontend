import { Component, OnInit, ViewChild } from '@angular/core';
import { MerchantService } from 'src/app/core/merchant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { MerchantListDto } from 'src/app/Models/merchant.model';
import { SecurityService } from './../../core/security.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-estimate-payout-details',
  templateUrl: './estimate-payout-details.component.html',
  styleUrls: ['./estimate-payout-details.component.css']
})
export class EstimatePayoutDetailsComponent implements OnInit {
  selectedMerchantId: string;
  payoutType: number = 2;
  NetEarning: number = 0;
  totalDeduction: number = 0;
  financepayoutcalculationObj = [];
  financeubereatspayoutcalculationObj = [];
  financedoordashpayoutcalculationObj = [];
  financegrubhubpayoutcalculationObj = [];
  financestorefrontpayoutcalculationObj = [];
  showmainloader: boolean = true
  ubereatsEarning: number = 0;
  totalEarning: number = 0;
  showbody: boolean = false
  startDate: string | Date;
  endDate: string | Date;
  selectedMerchant: any;
  merchantDto = new MerchantListDto();
  exporting: any;

  constructor(private toaster: ToastrService, private merchantService: MerchantService, private activatedRoute: ActivatedRoute, private securityService: SecurityService) { }

  ngOnInit(): void {
    this.startDate = this.activatedRoute.snapshot.queryParams['startdate']
    this.endDate = this.activatedRoute.snapshot.queryParams['enddate']
    this.selectedMerchantId = this.activatedRoute.snapshot.queryParams['merchantId']
    this.getDoordashFinanceReport();
    this.GetMerchantDetail()
  }
  historyBack() {
    window.history.back();
  }
  getDoordashFinanceReport() {
    const mData = {
      "startDate": this.startDate,
      "endDate": this.endDate,
      "orderSource": "doordash",
      "unlocked_only": 2
    };
    this.merchantService.getfinancepayout(this.selectedMerchantId, mData).subscribe((data: any) => {
      this.financedoordashpayoutcalculationObj = data.data
      if (this.financedoordashpayoutcalculationObj['transactions']) {
        this.financedoordashpayoutcalculationObj['transactions'] = JSON.parse(this.financedoordashpayoutcalculationObj['transactions'])
        this.showbody = true;
      }
      this.totalDeduction += Number(this.financedoordashpayoutcalculationObj['total_deduction'])
      // this.NetEarning += Number(this.financedoordashpayoutcalculationObj['total_deduction'])
      this.getUbereatsFinanceReport();
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
  getUbereatsFinanceReport() {
    const mData = {
      "startDate": this.startDate,
      "endDate": this.endDate,
      "orderSource": "ubereats",
      "unlocked_only": 2
    };
    this.merchantService.getfinancepayout(this.selectedMerchantId, mData).subscribe((data: any) => {
      this.financeubereatspayoutcalculationObj = data.data
      console.log("At the begining of ubereats transaction")
      console.log(this.financeubereatspayoutcalculationObj['transactions'])
      if (this.financeubereatspayoutcalculationObj['transactions']) {
        console.log("At the begining of ubereats transaction")
        console.log(this.financeubereatspayoutcalculationObj['transactions'])
        this.financeubereatspayoutcalculationObj['transactions'] = JSON.parse(this.financeubereatspayoutcalculationObj['transactions'])
        this.showbody = true;
      }
      this.totalDeduction += Number(this.financeubereatspayoutcalculationObj['total_deduction'])
      // this.NetEarning += Number(this.financeubereatspayoutcalculationObj['total_deduction'])
      this.getGrubhubFinanceReport();
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
  getGrubhubFinanceReport() {
    const mData = {
      "startDate": this.startDate,
      "endDate": this.endDate,
      "orderSource": "grubhub",
      "unlocked_only": 2
    };
    this.merchantService.getfinancepayout(this.selectedMerchantId, mData).subscribe((data: any) => {
      this.financegrubhubpayoutcalculationObj = data.data
      if (this.financegrubhubpayoutcalculationObj['transactions']) {
        this.financegrubhubpayoutcalculationObj['transactions'] = JSON.parse(this.financegrubhubpayoutcalculationObj['transactions'])
        this.showbody = true;
      }
      this.totalDeduction += Number(this.financegrubhubpayoutcalculationObj['total_deduction'])
      // this.NetEarning += Number(this.financegrubhubpayoutcalculationObj['total_deduction'])
      this.getStorefrontReport();
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
  getStorefrontReport() {
    const mData = {
      "startDate": this.startDate,
      "endDate": this.endDate,
      "orderSource": "storefront",
      "unlocked_only": 2
    };
    console.log("At the start of storefront function")
    this.merchantService.getfinancepayout(this.selectedMerchantId, mData).subscribe((data: any) => {
      this.financestorefrontpayoutcalculationObj = data.data
      if (this.financestorefrontpayoutcalculationObj['transactions']) {
        this.financestorefrontpayoutcalculationObj['transactions'] = JSON.parse(this.financestorefrontpayoutcalculationObj['transactions'])
        this.showbody = true;
      }
      this.totalDeduction += Number(this.financestorefrontpayoutcalculationObj['total_deduction'])
      // this.NetEarning += Number(this.financestorefrontpayoutcalculationObj['total_deduction'])
      this.calculateOrTransfer();

    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
  calculateOrTransfer() {
    const mData = {
      "startDate": this.startDate,
      "endDate": this.endDate,
      "createTransfer": 0,
      "orderSource": "",
      "payoutType": this.payoutType,
      "unlocked_only": 2
    };
    this.merchantService.getfinancepayout(this.selectedMerchantId, mData).subscribe((data: any) => {

      this.financepayoutcalculationObj = data.data
      this.totalEarning = Number(this.financeubereatspayoutcalculationObj['total_earning']) + Number(this.financedoordashpayoutcalculationObj['total_earning']) + Number(this.financegrubhubpayoutcalculationObj['total_earning']) + Number(this.financestorefrontpayoutcalculationObj['total_earning'])
      // this.NetEarning += this.financepayoutcalculationObj['total_all_earning']
      this.showmainloader = false
    }, (err) => {
      this.showmainloader = false
      this.toaster.error(err.error.message);
    })
  }
  generateDoordashCsv() {
    console.log("export csv")
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      useBom: true,
      headers: [
        'Merchantid',
        'Storename',
        'Transactiontype',
        'Transactionid',
        'Orderexternalrefenceid',
        'Description',
        'Finalorderstatus',
        'Subtotal',
        'Taxsubtotal',
        'Comission',
        'Comissiontax',
        'Marketingfee',
        'Storefronttransactionfee',
        'Storefrontdelieveryfees',
        'Tip',
        'Credit',
        'Debit',
        'Payoutid',
        'Taxremittedbydoordashtostate',
        'Subtotalfortax',
        'Doordashfundedsubtotaldiscount',
        'Merchantfundedsubtotaldiscount',
        'dateandtime'
      ]
    };
    new ngxCsv(this.financedoordashpayoutcalculationObj['transactions'], 'Doordash transaction report', options);
  }
  generateGrubhubCsv() {
    console.log("export csv")
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      useBom: true,
      headers: [
        'Order External Reference ID',
        'Fulfillment Type',
        'Merchant ID',
        'Transaction Type',
        'Description',
        'Date and Time',
        'Subtotal',
        'Delivery Fee',
        'Service Fee',
        'Service Fee Exemption',
        'Tax Fee',
        'Tax Fee Exemption',
        'Tip',
        'Restaurant Total',
        'Commission',
        'Delivery Commission',
        'Processing Fee',
        'Withheld Tax',
        'Withheld Tax Exemption',
        'Targeted Promotion',
        'Store Name'
      ]
    };
    new ngxCsv(this.financegrubhubpayoutcalculationObj['transactions'], 'Grubhub transaction report', options);
  }
  generateUbereatsCsv() {
    console.log("export ubereats csv")
    console.log(this.financeubereatspayoutcalculationObj['transactions'])
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      useBom: true,
      headers: [
        'Merchantid',
        'Storename',
        'Orderexternalrefenceid',
        'Transactiontype',
        'Dateandtime',
        'Salesexcltax',
        'Taxonsales',
        'Salesincltax',
        'Refundsexcltax',
        'Taxonrefunds',
        'Refundsincltax',
        'Priceadjustmentsexcltax',
        'Taxonpriceadjustments',
        'Promotionsonitems',
        'Taxonpromotionitems',
        'Promotionsondelivery',
        'Taxonpromotionsondelivery',
        'Bagfee',
        'Marketingadjustment',
        'Totalsalesafteradjustmentsincltax',
        'Marketplacefee',
        'Marketplacefeepercentage',
        'Deliverynetworkfee',
        'Orderprocessingfee',
        'Merchantfee',
        'Taxonmerchantfee',
        'Tips',
        'Otherpaymentsdescription',
        'Otherpayments',
        'Marketplacefacilitatortax',
        'Backupwithholdingtax',
        'Totalpayout',
        'Payoutdate',
        'PayoutreferenceID'
      ]
    };
    new ngxCsv(this.financeubereatspayoutcalculationObj['transactions'], 'Ubereats transaction report', options);
  }
  generateStorefrontCsv() {
    console.log("export storefront csv")
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      useBom: true,
      headers: [
        'merchantid',
        'stafftips',
        'extrastafftips',
        'ordersubtotal',
        'ordertax',
        'processingfee',
        'commission',
        'ordertotal',
        'orderexternalreference',
        'refund_amount',
        'squarefee',
        'creditcardfee',
        'promodiscount',
        'doordashdelfee',
        'dasher_staff_tips',
        'Transactiontype',
        'dateandtime'
      ]
    };
    new ngxCsv(this.financestorefrontpayoutcalculationObj['transactions'], 'Storefront transaction report', options);
  }



//download report

  GetMerchantDetail() {

    this.merchantService.GetMerchantById(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;
      console.log("data merchant",data)
      this.selectedMerchant = data.merchantName;

    }, (err) => {
      this.toaster.error(err.message);
    })
  }

  downloadTransactionReport(format: string) {
    const startDate = new Date(this.startDate).toISOString().split('T')[0];
    const endDate = new Date(this.endDate).toISOString().split('T')[0];
    const platform = "";  // Use the platform you're interested in
  
    this.exporting = true;
  
    const selectedFormat = format;  // This could be a variable like 'excel' or 'csv' set by the user
  
    this.merchantService.getTransactionSummaryReport(this.selectedMerchantId, startDate, endDate, platform).subscribe(
      (response: Blob) => {
        let filename = `Transaction Summary Report - ${this.selectedMerchant} (from ${startDate} to ${endDate})`;  // Default filename
  
        // Check the selected format
        if (selectedFormat === 'excel') {
          // If the user selects Excel, download the file as is
          const url = window.URL.createObjectURL(response);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = filename + '.xlsx';  // Set the default Excel file extension
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          window.URL.revokeObjectURL(url);  // Clean up the Blob URL
  
        } else if (selectedFormat === 'csv') {
          // If the user selects CSV, convert the Excel to CSV on the frontend and download
          const reader = new FileReader();
          reader.onload = () => {
            // Read the file as an Excel workbook
            const data = new Uint8Array(reader.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
  
            // Convert the first sheet to CSV
            const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
  
            // Create a Blob for CSV and trigger download
            const csvBlob = new Blob([csvData], { type: 'text/csv' });
            const csvUrl = window.URL.createObjectURL(csvBlob);
  
            const anchor = document.createElement('a');
            anchor.href = csvUrl;
            anchor.download = filename.replace('.xlsx', '.csv');  // Change extension to .csv
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(csvUrl);  // Clean up the Blob URL
          };
          reader.readAsArrayBuffer(response);  // Read the response as ArrayBuffer
        }
  
        this.exporting = false;
      },
      (err) => {
        this.toaster.error(err.error.message);
        this.exporting = false;
      }
    );
  }

  generateCsv() {
    if (this.financedoordashpayoutcalculationObj['transactions']){
      this.generateDoordashCsv();
    }
    if (this.financegrubhubpayoutcalculationObj['transactions']){
      this.generateGrubhubCsv();
    }
    if (this.financestorefrontpayoutcalculationObj){
      this.generateStorefrontCsv();
    }
    if (this.financeubereatspayoutcalculationObj['transactions'])
      this.generateUbereatsCsv();
    }
  }
