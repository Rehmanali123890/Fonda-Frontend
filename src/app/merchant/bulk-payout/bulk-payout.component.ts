import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as moment from "moment";
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { MerchantService } from 'src/app/core/merchant.service';
import { BulkPayouts, MerchantListDto, PayoutCalculations, SubscriptionDescription } from 'src/app/Models/merchant.model';

@Component({
  selector: 'app-bulk-payout',
  templateUrl: './bulk-payout.component.html',
  styleUrls: ['./bulk-payout.component.scss']
})
export class BulkPayoutComponent implements OnInit {

  constructor(private toaster: ToastrService, private merchantService: MerchantService) { }
  startDate: string | Date;
  endDate: string | Date;
  gettingCalculations: boolean;
  showDetails: boolean = false
  gettingTransfers: boolean = false;
  disableTransferBtn: boolean = false;
  showCalculateMessage = false;
  showcalculateAllMessages = false;
  showTransferBtn: boolean = true
  payoutType: number = 1;
  calculateMessage: string = ""
  calculateAllMessages: string = ""
  main_check: boolean = false
  total_selected: number = 0
  SubscriptionDescription = SubscriptionDescription
  BulkPayoutsObj: BulkPayouts;
  ngOnInit(): void {
    this.startDate = moment().subtract(6, 'days').format("YYYY-MM-DD");
    this.endDate = moment().format('YYYY-MM-DD');
    this.loadTransfers()
  }
  calculatePayout(status) {
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

    this.merchantService.generatePayoutCalculationBulk(mData).subscribe((data: any) => {
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
    this.merchantService.getPayoutCalculationBulk().subscribe((data: any) => {
      this.BulkPayoutsObj = data.data

      this.BulkPayoutsObj.payouts.forEach(x => x.checked = false)


      if (this.BulkPayoutsObj.payouts.length > 0) {
        this.showDetails = true
      }

      if (this.BulkPayoutsObj.payouts.filter(x => x.netPayout > 0).length > 0) {
        this.showTransferBtn = true
      } else {
        this.showTransferBtn = false
        this.showCalculateMessage = true
        this.calculateMessage = "All net transfers are 0"
      }
      if (this.BulkPayoutsObj.payouts.length < this.BulkPayoutsObj.active_merchants_counts) {
        this.showcalculateAllMessages = true
        this.calculateAllMessages = "Invoice  generated for " + this.BulkPayoutsObj.payouts.length + " out of " + this.BulkPayoutsObj.active_merchants_counts + " Active Merchant’s. Please refresh to get latest data."
      }
      if (this.BulkPayoutsObj.payouts.length == this.BulkPayoutsObj.active_merchants_counts) {
        this.showcalculateAllMessages = true
        this.calculateAllMessages = "Invoice generated for all active merchants"
      }

      this.gettingTransfers = false;

      // for mobile view
      this.expandtable = new Array(this.BulkPayoutsObj.payouts.length).fill({ expandtable: false, idx: 0 });
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
  checkAllCheckBox() {

    if (this.main_check == true) {
      this.BulkPayoutsObj.payouts.forEach(x => x.checked = true)
      this.total_selected = this.BulkPayoutsObj.payouts.length

    }
    else {
      this.BulkPayoutsObj.payouts.forEach(x => x.checked = false)
      this.total_selected = 0
    }

  }
  ischeckAllCheckBox(ev: any) {
    if (ev.checked == true) {
      this.total_selected = this.total_selected + 1
    }
    else {
      this.total_selected = this.total_selected - 1
    }
    for (let i in this.BulkPayoutsObj.payouts) {
      if (this.BulkPayoutsObj.payouts[i].checked == false) {
        this.main_check = false
        break
      }
      else {
        this.main_check = true
      }
    }

  }
  gettingSummaryReportNew: boolean = false
  financeReportSummaryNewFormat() {
    let merchantIdList = []
    let j = 0
    for (let i in this.BulkPayoutsObj.payouts) {
      if (this.BulkPayoutsObj.payouts[i].checked == true) {
        merchantIdList[j] = this.BulkPayoutsObj.payouts[i].merchantId
        j++
      }
    }
    this.BulkPayoutsObj.payouts.forEach(x => x.checked = false)
    this.total_selected = 0
    this.gettingSummaryReportNew = true
    this.merchantService.sendSummaryEmail_bulk_payout({
      'merchantId': merchantIdList,
      'startDate': this.BulkPayoutsObj.payouts[0].startDate,
      'endDate': this.BulkPayoutsObj.payouts[0].endDate,
      "payoutType": this.BulkPayoutsObj.payouts[0].payouttype,

      // 'email': "saimabdullah1234@gmail.com;saimabdullah@paalam.co.uk",
      // 'email': JSON.parse(localStorage.getItem('securityData')).user.email,
    }).subscribe({
      next: result => {
        this.toaster.success('You will receive the order summary report on your email shortly!')
        this.gettingSummaryReportNew = false
      }, error: err => {
        this.toaster.error(err.error.message)
        this.gettingSummaryReportNew = false
      }
    })


  }

}
