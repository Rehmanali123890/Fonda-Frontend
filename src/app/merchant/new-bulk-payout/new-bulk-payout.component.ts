import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as moment from "moment";
import { ModalDirective } from 'angular-bootstrap-md';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MerchantService } from 'src/app/core/merchant.service';
import { BulkPayouts,NewBulkPayouts, MerchantListDto, PayoutCalculations, SubscriptionDescription } from 'src/app/Models/merchant.model';
import { ngxCsv } from 'ngx-csv/ngx-csv';


@Component({
  selector: 'app-new-bulk-payout',
  templateUrl: './new-bulk-payout.component.html',
  styleUrls: ['./new-bulk-payout.component.css']
})

export class NewBulkPayoutComponent implements OnInit {

    constructor(private toaster: ToastrService, private merchantService: MerchantService, private activatedRoute: ActivatedRoute) { }
    startDate: string | Date;
    endDate: string | Date;
    gettingCalculations: boolean;
    gettingCSV: boolean;
    showDetails: boolean = false
    gettingTransfers: boolean = false;
    disableTransferBtn: boolean = false;
    showCalculateMessage = false;
    showcalculateAllMessages = false;
    showTransferBtn: boolean = true
    payoutType: number = 2;
    calculateMessage: string = ""
    calculateAllMessages: string = ""
    SubscriptionDescription = SubscriptionDescription
    NewBulkPayoutsObj: NewBulkPayouts;
    selecetedTab: number = 1
    

    ngOnInit(): void {
      if (parseInt(this.activatedRoute.snapshot.queryParams['selectedTab'], 10) === 2) {
        this.selecetedTab = 2;
      }
      this.startDate = moment().subtract(6, 'days').format("YYYY-MM-DD");
      this.endDate = moment().format('YYYY-MM-DD');
      this.loadTransfers()
    }
    calculateNewPayout(status) {
      const sTime = moment(this.startDate);
      const eTime = moment(this.endDate);
      const res = sTime.isAfter(eTime);
      if (res) {
        this.toaster.warning('Start Date should not be greater than End Date');
        return;
      }
      const mData = {
        "startDate": this.startDate,
        "endDate": this.endDate,
        "createTransfer": status,
        "payoutType": this.payoutType,
      };
      if (status == 1) {
        this.disableTransferBtn = true
        this.gettingCalculations = false;
      }
      else {
        this.showDetails = false
        this.showTransferBtn = false;
        this.gettingCalculations = true;
      }
  
      this.merchantService.generateNewPayoutCalculationBulk(mData).subscribe((data: any) => {
        this.showcalculateAllMessages = true;
        if (status == 1) {
          this.disableTransferBtn = false;
          this.showDetails = false;
          this.showTransferBtn = false
          this.calculateMessage = "Transfers are running in background. Once all transfers are completed you will be notified via email."
        } else {
          this.gettingCalculations = false;
          this.calculateAllMessages = "Please refresh to see latest payout calculation data"
        }
      }, (err) => {
        this.gettingCalculations = false;
        this.disableTransferBtn = false
        this.toaster.error(err.error.message);
      })
    }
    expandtable: { expandtable: boolean, idx: number }[] = [];
    onChangeExpandtable(idx) {
      this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
    }
    loadTransfers() {
      this.gettingTransfers = true;
      this.merchantService.getNewPayoutCalculationBulk().subscribe((data: any) => {
        this.NewBulkPayoutsObj = data.data
  
        this.NewBulkPayoutsObj.payouts.forEach(x => x.checked = false)
  
  
        if (this.NewBulkPayoutsObj.payouts.length > 0) {
          this.showDetails = true
        }
  
        if (this.NewBulkPayoutsObj.payouts.filter(x => x.netPayout > 0).length > 0) {
          this.showTransferBtn = true
        } else {
          this.showTransferBtn = false
          this.showCalculateMessage = true
          this.calculateMessage = "All net transfers are 0"
        }
        if (this.NewBulkPayoutsObj.payouts.length < this.NewBulkPayoutsObj.all_merchants_counts) {
          this.showcalculateAllMessages = true
          this.calculateAllMessages = "Invoice  generated for " + this.NewBulkPayoutsObj.payouts.length + " out of " + this.NewBulkPayoutsObj.all_merchants_counts + " Merchants. Please refresh to get latest data."
        }
        if (this.NewBulkPayoutsObj.payouts.length == this.NewBulkPayoutsObj.all_merchants_counts) {
          this.showcalculateAllMessages = true
          this.calculateAllMessages = "Invoice generated for all merchants"
        }
  
        this.gettingTransfers = false;
  
        // for mobile view
        this.expandtable = new Array(this.NewBulkPayoutsObj.payouts.length).fill({ expandtable: false, idx: 0 });
        this.expandtable = this.expandtable.map((item, idx) => {
          return {
            ...item,
            idx: idx
          }
        })
      }, (err) => {
        this.gettingTransfers = false;
        this.toaster.error(err.error.message);
      })
    }
  

    generateCsv() {
      this.gettingCSV = true;
    
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        useBom: true,
        headers: [
          'Restaurant Name',
          'Restaurant Status',
          'Transaction Start Date',
          'Transaction End Date',
          'Doordash Payment',
          'Grubhub Payment',
          'Ubereats Payment',
          'Storefront Orders / VR Orders',
          'Total Payables (GMV)',
          'DD Net Earnings',
          'GH Net Earnings',
          'UE Net Earnings',
          'SF Net Earnings',
          'Total Payout (Before Deductions)',
          'Sub Fees',
          'Fonda Share',
          'Net Payout',
          'Fonda Share Difference',
          'Actual Fonda Share Percentage (%)'
        ]
      };
    
      const formatDate = (dateString) => {
        console.log("Input Date string-->", dateString);
        const [year, month, day] = dateString.split('-');
        const formattedDate = `${month.padStart(2, '0')}-${day.padStart(2, '0')}-${year}`;
        console.log(`Formatted Date: ${formattedDate}`);
        return formattedDate;
      };
    
      const formattedPayouts = this.NewBulkPayoutsObj.payouts.map(row => {
        const startDate = formatDate(row['startDate']);
        const endDate = formatDate(row['endDate']);
        
        return {
          'Restaurant Name': row['resturantName'],
          'Restaurant Status': row['status'] == '1' ? 'Active' : 'Inactive',
          'Transaction Start Date': startDate,
          'Transaction End Date': endDate,
          'Doordash Payment': row['DD_CSV_Earning'],
          'Grubhub Payment': row['GH_CSV_Earning'],
          'Ubereats Payment': row['UE_CSV_Earning'],
          'Storefront Orders / VR Orders': row['SF_Earning'],
          'Total Payables (GMV)': row['Total_CSV_Earning'],
          'DD Net Earnings': row['DD_Dashboard_Earning'],
          'GH Net Earnings': row['GH_Dashboard_Earning'],
          'UE Net Earnings': row['UE_Dashboard_Earning'],
          'SF Net Earnings': row['SF_Dashboard_Earning'],
          'Total Payout (Before Deductions)': row['dashboard_payout_before_deduction'],
          'Sub Fees': row['subscription_fee'],
          'Fonda Share': row['fonda_share'],
          'Net Payout': row['dashboard_net_payout'],
          'Fonda Share Difference': row['CSV_dashboard_net_payout_difference'],
          'Actual Fonda Share Percentage (%)': row['payout_difference_percentage']
        };
      });
    
      console.log('Formatted Payouts:', formattedPayouts[0]);
      new ngxCsv(formattedPayouts, `Bulk Invoice from ${formatDate(this.NewBulkPayoutsObj.payouts[0].startDate)} to ${formatDate(this.NewBulkPayoutsObj.payouts[0].endDate)}`, options);
      
      this.gettingCSV = false;
    }
}
