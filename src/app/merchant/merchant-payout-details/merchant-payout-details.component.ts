import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from "moment";
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
// import { MdProgressBarModule } from 'ng-uikit-pro-standard/lib/pro/progressbars/progress-bars-module';
import { MerchantService } from 'src/app/core/merchant.service';

import { SecurityService } from 'src/app/core/security.service';
import { UserRoleEnum } from 'src/app/Models/user.model';
import { MerchantTreasuryService } from './../../core/merchant-treasury.service'
import { MerchantListDto, MerchantStatusEnum, PayoutCalculations, PayoutTypeDescription, SubscriptionDescription } from 'src/app/Models/merchant.model';
import Swal from 'sweetalert2'
import { TranferTypeEnum } from 'src/app/Models/merchant.model';
import * as descriptions from '../../../../src/app/tooltips-for-fields/tooltips';
import { TranslocoService } from '@ngneat/transloco';
import { Bankdto } from 'src/app/Models/merchant.model';
import { environment } from 'src/environments/environment';
import { AccountDetails, TransactionHistory } from 'src/app/Models/treasury.model';

// declare var google: any;
@Component({
  selector: 'app-merchant-payout-details',
  templateUrl: './merchant-payout-details.component.html',
  styleUrls: ['./merchant-payout-details.component.scss']
})
export class MerchantPayoutDetailsComponent implements OnInit {
  popupheadeing: string
  emailbtn: number
  startDate: string | Date;
  endDate: string | Date;
  payoutType: number = 2;
  transferType: number = 1;
  payoutAdjustments: number;
  doordash: number = 0;
  ubereats: number = 0;
  grubhub: number = 0;
  storefront: number = 0;
  others: number = 0;
  commisionAdjustment: number;
  commisionAdjustmentBackup: number = 0
  payoutAdjustmentsBackup: number = 0;
  marketingFeeBackup: number = 0;
  marketingFee: number;
  remarks: string = "";
  stripeAccountName: string
  connected_account_id: string
  stripeConnectAccountUrl: string
  ConnectaccountOnStripe: string
  popup_remarks: string = ""
  PayoutTypeDescription = PayoutTypeDescription;
  @Input() merchantDto = new MerchantListDto();
  @Input() gettingMerchantDetail: boolean;
  @Input() merchantId: string;
  @Input() selectedTab: string;
  gettingCalculations: boolean;
  check_stripe_connected_id: boolean
  showDetails: boolean = false
  gettingTransfers: boolean = false;
  disableTransferBtn: boolean = false;
  PayoutCalculationsObj: PayoutCalculations
  PayoutCalculationsListObj: PayoutCalculations[] = []
  SubscriptionDescription = SubscriptionDescription;
  gettingFinanceReport: boolean = false;
  gettingSummaryReport: boolean = false;
  gettingHistoryReport: boolean = false;
  gettingTransfertoBank: boolean = false;
  not_connect_to_finacc: boolean = false;
  checkBankDetail: boolean = false;
  connect_to_finacc: boolean = false;
  swarlText: string = ''
  localNetPayoutBackup: number = 0;
  StripeBalance: number = 0
  TreasuryBalance: number = 0
  accountDetails = new AccountDetails()
  TotalRevenue: number = 0;
  TotalFondaPayout: number = 0;
  FondaRevenue: number = 0;
  FondaRevenuePercentage: number = 0;
  // tagsEmailDistributionArray: string[] = [...this.merchantDto.emailDistributionList];
  tagsEmailDistributionArray: string[] = []
  TransferTypeEnumm: TranferTypeEnum;
  showRemarks: boolean = false
  disableTransferPopupBtn: boolean = false
  RpfString1: string = "    ( Reason: As the total lifetime revenue exceeds the Revenue processing threshold, the Revenue processing fee is applied. )"
  RpfString2: string = "    ( Reason: The Revenue Processing Fee is not applied because the total lifetime revenue is below the Revenue Processing Threshold. )"
  marketingFeeCheck: boolean = false
  showHintOnHover: boolean = false;
  showHintOnHover1: boolean = false;
  hoverindex: number
  payoutiD: string = ''
  userRoleType: UserRoleEnum;
  accountDetail = new Bankdto();

  // tooltips start
  numberOfOrdersDescription = descriptions.numberOfOrdersDescription;
  subTotalDescription = descriptions.subTotalDescription;
  taxDescription = descriptions.taxDescription;
  commissionDescription = descriptions.commissionDescription;
  commissionAdjustmentsDescription = descriptions.commissionAdjustmentsDescription;
  squareFeeDescription = descriptions.squareFeeDescription;
  processingFeeDescription = descriptions.processingFeeDescription;
  errorChargesDescription = descriptions.errorChargesDescription;
  staffTipsDescription = descriptions.staffTipsDescription;
  orderAdjustmentsDescription = descriptions.orderAdjustmentsDescription;
  marketPlaceFacilitatorTaxUbereatsDescription = descriptions.marketPlaceFacilitatorTaxUbereatsDescription;
  promoDiscountDescription = descriptions.promoDiscountDescription;
  subscriptionAdjustmentsDescription = descriptions.subscriptionAdjustmentsDescription;
  revenueProcessingFeeDescription = descriptions.revenueProcessingFeeDescription;
  marketingFeeDescription = descriptions.marketingFeeDescription;
  payoutAdjustmentsDescription = descriptions.payoutAdjustmentsDescription;
  netPayoutDescription = descriptions.netPayoutDescription;



  constructor(private toaster: ToastrService, private merchantService: MerchantService, private securityService: SecurityService, private merchantTreasuryService: MerchantTreasuryService,
    private translocoService: TranslocoService) {

  }
  @ViewChild('createOurPoints') createOurPoints: ModalDirective;

  ngOnInit(): void {

    // this.GetMerchantDetail()
    // this.startDate = moment().format('YYYY-MM-DD');
    // this.endDate = moment().format('YYYY-MM-DD');
    this.userRoleType = this.securityService.securityObject.user.role;
    this.startDate = moment().subtract(6, 'days').format("YYYY-MM-DD");
    this.endDate = moment().format('YYYY-MM-DD');
    this.getTransferList();
    this.grabInputDataChip();

  }
  ngOnChanges(changes: SimpleChanges): void {


    this.startDate = moment().subtract(6, 'days').format("YYYY-MM-DD");
    this.endDate = moment().format('YYYY-MM-DD');
    this.showDetails = false
    this.PayoutCalculationsObj = new PayoutCalculations()



    this.getTransferList();
    this.mydateFunction()
    this.calculateRevenue();
  }
  mydateFunction() {

    const startDateString = localStorage.getItem('startDate');
    const endDateString = localStorage.getItem('endDate');
    if (startDateString && endDateString) {

      this.startDate = moment(startDateString).format('YYYY-MM-DD');
      this.endDate = moment(endDateString).format('YYYY-MM-DD');
    }
  }

  showHint(eyeNo: number, i?: number) {
    if (eyeNo == 0) {
      this.showHintOnHover = true;
    }
    else {
      this.hoverindex = i
      this.showHintOnHover1 = true;
    }
  }

  hideHint(eyeNo: number) {
    if (eyeNo == 0) {
      this.showHintOnHover = false;
    }
    else {

      this.showHintOnHover1 = false;
    }
  }
  onInputChange() {
    this.popup_remarks = this.popup_remarks.trim();
  }
  reCalculatePayout(status) {

    if (status == 1) {
      // this.PayoutCalculationsObj.netPayout = this.localNetPayoutBackup;
      this.PayoutCalculationsObj.netPayout = this.PayoutCalculationsObj.netPayout - this.payoutAdjustmentsBackup
      if (this.payoutAdjustments !== undefined || this.payoutAdjustments != null) {
        this.PayoutCalculationsObj.netPayout = this.PayoutCalculationsObj.netPayout + this.payoutAdjustments
        this.payoutAdjustmentsBackup = this.payoutAdjustments

      }
    }
    else if (status == 2) {
      // this.PayoutCalculationsObj.netPayout = this.localNetPayoutBackup;

      if (this.marketingFee !== undefined || this.marketingFee != null) {

        this.PayoutCalculationsObj.netPayout = this.PayoutCalculationsObj.netPayout - this.marketingFeeBackup
        this.PayoutCalculationsObj.netPayout = this.PayoutCalculationsObj.netPayout + this.marketingFee
        this.marketingFeeBackup = this.marketingFee
        if (this.marketingFee == null) {
          this.marketingFee = 0
        }
      }
    }
    else if (status == 3) {

      // this.PayoutCalculationsObj.netPayout = this.localNetPayoutBackup;
      this.PayoutCalculationsObj.netPayout = this.PayoutCalculationsObj.netPayout - this.commisionAdjustmentBackup
      if (this.commisionAdjustment !== undefined) {

        this.PayoutCalculationsObj.netPayout = this.PayoutCalculationsObj.netPayout + this.commisionAdjustment
        this.commisionAdjustmentBackup = this.commisionAdjustment
        if (this.commisionAdjustment == null) {
          this.commisionAdjustment = 0
        }




      }
    }
    this.calculateRevenue()
  }
  // logic for mobile
  expandtable: { expandtable: boolean, idx: number }[] = [];
  onChangeExpandtable(idx) {
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }
  getTransferList() {
    this.gettingTransfers = true;
    this.merchantService.GetMerchantTransfers(this.merchantId).subscribe((data: any) => {
      this.PayoutCalculationsListObj = data.data
      console.log("old payouts detail is ", this.PayoutCalculationsListObj)
      // for (let record in this.PayoutCalculationsListObj)
      // {

      //   var lifetime_total_revenue=this.PayoutCalculationsListObj[record].lifetime_total_revenue
      //   var RevenueProcessingThreshold=this.PayoutCalculationsListObj[record].RevenueProcessingThreshold
      //   var translationKey=''
      //   if(lifetime_total_revenue > RevenueProcessingThreshold )
      //   {
      //     translationKey='MerchantPayoutDetail.RevenueProcessingFeeApplied'
      //   }
      //   else{
      //     translationKey='MerchantPayoutDetail.RevenueProcessingFeeNotApplied'
      //   }
      //   this.translocoService.selectTranslate(translationKey, { lifetime_total_revenue,RevenueProcessingThreshold})
      //   .subscribe(translation => {
      //     this.PayoutCalculationsListObj[record].Revenue_processing_fee_Reason = translation;
      //   });
      // }

      // for mobile view
      this.expandtable = new Array(this.PayoutCalculationsListObj.length).fill({ expandtable: false, idx: 0 });
      this.expandtable = this.expandtable.map((item, idx) => {
        return {
          ...item,
          idx: idx
        }
      })
      this.gettingTransfers = false;
    }, (err) => {
      this.gettingTransfers = false;
      this.toaster.error(err.error.message);
    })
  }



  getstripeaccountdetail() {
    this.check_stripe_connected_id = false
    if (this.merchantDto.stripeAccountId == null || this.merchantDto.stripeAccountId == '') {
      this.toaster.error("No Stripe connect account is attached with this merchant.")
    }
    else {
      this.merchantTreasuryService.getConnectAccountDetails(this.merchantId).subscribe((data: any) => {

        if (data.hasOwnProperty('message')) {
          this.check_stripe_connected_id = false
          this.toaster.error("Stripe connect account id is invalid against this merchant.")
        }
        else {

          this.stripeAccountName = data['account-detail'].name
          this.connected_account_id = data['connected-account-id']
          this.stripeConnectAccountUrl = `${environment.stripeConnectAccountUrl}${this.connected_account_id}`
          console.log("this.stripeConnectAccountUrl is ", this.stripeConnectAccountUrl)
          this.check_stripe_connected_id = true
        }
      })
    }
  }
  getBankAccountDetails(payoutid) {
    this.checkBankDetail = false
    this.gettingTransfertoBank = true
    this.merchantService.getBankDetails(this.merchantId, payoutid).subscribe((data: any) => {
      console.log("Response for bank account detail", data)
      if (data.length == 0) {
        this.checkBankDetail = true
        this.transferToBank(payoutid)
      }
      else {
        this.accountDetail = data
        this.transferToBank(payoutid)
        this.checkBankDetail = false
      }
      this.gettingTransfertoBank = false
    },
      (err) => {
        this.gettingTransfertoBank = false
        this.toaster.error("Failed to get bank details.");
      })

  }

  getStripeBalance() {
    this.merchantTreasuryService.getStripeBalanceDetail().subscribe((data: any) => {
      this.StripeBalance = data.data.stripeBalance
    })

  }

  calculatePayout(status, swarltitle?: string) {
    this.getStripeBalance()
    const startDateString = JSON.stringify(this.startDate);
    const startEndString = JSON.stringify(this.endDate);
    localStorage.setItem('startDate', startDateString);
    localStorage.setItem('endDate', startEndString);
    if (status == 0) {
      this.merchantTreasuryService.getAccountDetails(this.merchantId).subscribe((data: any) => {
        this.accountDetails = data
        this.TreasuryBalance = data.balance.cash.usd / 100
        if (data.hasOwnProperty('message')) {
          this.not_connect_to_finacc = true;
          this.connect_to_finacc = false;
        }
        else {
          this.not_connect_to_finacc = false;
          this.connect_to_finacc = true;
        }
      })
    }


    const sTime = moment(this.startDate);
    const eTime = moment(this.endDate);
    const res = sTime.isAfter(eTime);
    if (res) {
      this.toaster.warning('Start Date should not be greater than End Date');
      return;
    }
    if (this.transferType == 3) {
      if (this.remarks == '') {
        this.remarks = this.popup_remarks
      }
      else {
        this.remarks = this.remarks + " - " + this.popup_remarks
      }
    }
    const mData = {
      "startDate": this.startDate,
      "endDate": this.endDate,
      "createTransfer": status,
      "payoutType": this.payoutType,
      "transferType": this.transferType,
      "payoutAdjustments": this.payoutAdjustments,
      "remarks": this.remarks,
      "marketingFee": this.marketingFee,
      "commisionAdjustment": this.commisionAdjustment,
      "doordash": this.doordash,
      "ubereats": this.ubereats,
      "grubhub": this.grubhub,
      "storefront": this.storefront,
      "others": this.others,
      "TotalRevenue": this.TotalRevenue,
      "TotalFondaPayout": this.TotalFondaPayout,
      "FondaRevenue": this.FondaRevenue,
      "FondaRevenuePercentage": this.FondaRevenuePercentage
    };
    if (status == 1) {


      this.disableTransferBtn = true
      this.gettingCalculations = false;
      if (this.transferType == 3) {
        this.calculateOrTransfer(status, mData)
      }
      else {


        var title = ''
        this.translocoService.selectTranslate('reuseableWords.Are you sure?').subscribe(translation => {
          title = translation;
        });
        var cancelButtonText = ''
        this.translocoService.selectTranslate('reuseableWords.Cancel').subscribe(translation => {
          cancelButtonText = translation;
        });
        var confirmButtonText = ''
        this.translocoService.selectTranslate('reuseableWords.Yes, transfer it!').subscribe(translation => {
          confirmButtonText = translation;
        });
        this.translocoService.selectTranslate(swarltitle).subscribe(translation => {
          this.swarlText = translation;
        });
        this.translocoService.selectTranslate('reuseableWords.Connect Account Name On Stripe').subscribe(translation => {
          this.ConnectaccountOnStripe = translation;
        });
        var swarltextHtml = `${this.swarlText} <div><h5 class="mt-5">${this.ConnectaccountOnStripe}: <a target="_blank" href="${this.stripeConnectAccountUrl}">${this.stripeAccountName}</a></h5></div>`
        Swal.fire({
          title: title,
          html: swarltextHtml,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: cancelButtonText,
          confirmButtonText: confirmButtonText
        }).then((result) => {
          if (result.isConfirmed) {
            this.calculateOrTransfer(status, mData)
          } else {
            this.gettingTransfers = false;
            this.disableTransferBtn = false

            return

          }
        })

      }
    }
    else {
      this.disableTransferBtn = false;
      this.gettingCalculations = true;
      this.calculateOrTransfer(status, mData)
    }


  }
  calculateRevenue() {
    // debugger
    this.TotalRevenue = Number(this.doordash) + Number(this.ubereats) + Number(this.grubhub) + Number(this.storefront) + Number(this.others)
    this.TotalFondaPayout = this.PayoutCalculationsObj.netPayout + Math.abs(this.PayoutCalculationsObj.subscriptionAdjustments)
    this.FondaRevenue = this.TotalRevenue - this.TotalFondaPayout
    if (this.TotalRevenue == 0) {
      this.FondaRevenuePercentage = 0
    }
    else { this.FondaRevenuePercentage = (this.FondaRevenue / this.TotalRevenue) * 100 }

    if (isNaN(this.FondaRevenuePercentage)) {
      this.FondaRevenuePercentage = 0;
    }
  }

  split_remarks(string) {
    if (string.includes('-')) {
      const parts: string[] = string.split(' - ');
      return parts.length > 1 ? parts[1] : '';
    }
    else {
      return string
    }
  }
  calculateOrTransfer(status, mData) {
    this.merchantService.getPayoutCalculation(this.merchantId, mData).subscribe((data: any) => {
      this.PayoutCalculationsObj = data.data
      this.remarks = this.PayoutCalculationsObj.remarks
      // var lifetime_total_revenue=this.PayoutCalculationsObj.lifetime_total_revenue
      // var RevenueProcessingThreshold=this.merchantDto.RevenueProcessingThreshold
      // var translationKey=''
      // if(lifetime_total_revenue > RevenueProcessingThreshold )
      // {
      //   translationKey='MerchantPayoutDetail.RevenueProcessingFeeApplied'
      // }
      // else{
      //   translationKey='MerchantPayoutDetail.RevenueProcessingFeeNotApplied'
      // }

      // this.translocoService.selectTranslate(translationKey, { lifetime_total_revenue,RevenueProcessingThreshold})
      // .subscribe(translation => {
      //   this.PayoutCalculationsObj.Revenue_processing_fee_Reason = translation;
      // });

      if (data.data.hasOwnProperty('commission_adjustment')) {
        this.commisionAdjustment = data.data.commission_adjustment
        this.commisionAdjustmentBackup = data.data.commission_adjustment

        this.marketingFee = data.data.marketing_fee
        this.marketingFeeBackup = data.data.marketing_fee

        this.payoutAdjustments = data.data.payout_adjustment
        this.payoutAdjustmentsBackup = data.data.payout_adjustment

        this.PayoutCalculationsObj.netPayout = this.PayoutCalculationsObj.netPayout + this.payoutAdjustments
        this.PayoutCalculationsObj.netPayout = this.PayoutCalculationsObj.netPayout + this.marketingFee
        this.PayoutCalculationsObj.netPayout = this.PayoutCalculationsObj.netPayout + this.commisionAdjustment
        if (data.data.hasOwnProperty('doordash')) {
          this.doordash = data.data.doordash
          this.ubereats = data.data.ubereats
          this.grubhub = data.data.grubhub
          this.storefront = data.data.storefront
          this.others = data.data.others
        }

      }

      this.calculateRevenue()
      this.gettingCalculations = false;

      if (status == 1) {
        this.showDetails = false;
        this.disableTransferBtn = false
        this.getTransferList()
      } else {
        this.localNetPayoutBackup = data.data.netPayout
        this.showDetails = true;
      }

    }, (err) => {
      this.gettingCalculations = false;
      this.disableTransferBtn = false
      this.toaster.error(err.error.message);
    })
  }
  financeReportSummary() {
    this.gettingSummaryReport = true
    this.merchantService.financeData(this.merchantId, {
      'startDate': this.startDate,
      'endDate': this.endDate,
      "payoutType": this.payoutType,
      'email': JSON.parse(localStorage.getItem('securityData')).user.email,
      consolidate: 2
    }).subscribe({
      next: result => {
        this.toaster.success('You will receive the order summary report on your email shortly!')
        this.gettingSummaryReport = false
      }, error: err => {
        this.toaster.error(err.error.message)
        this.gettingSummaryReport = false
      }
    })
  }
  reset_marketing_fee(input: HTMLInputElement) {
    this.marketingFee = 0
    input.value = '0';
    input.dispatchEvent(new Event('input'));
  }
  gettingSummaryReportNew: boolean = false
  financeReportSummaryNewFormat() {


    this.gettingSummaryReportNew = true
    if (this.tagsEmailDistributionArray[0] == '') {
      this.tagsEmailDistributionArray.shift();
    }
    this.merchantService.sendSummaryEmail(this.merchantId, {
      'startDate': this.startDate,
      'endDate': this.endDate,
      "payoutType": this.payoutType,
      // 'email': "saimabdullah1234@gmail.com;saimabdullah@paalam.co.uk;fondaabc@gmail.com",
      'email': this.tagsEmailDistributionArray
      // 'email': JSON.parse(localStorage.getItem('securityData')).user.email,
    }).subscribe({
      next: result => {
        this.toaster.success('You will receive the order summary report on your email shortly!')
        this.gettingSummaryReportNew = false
        this.closeModal()
      }, error: err => {
        this.toaster.error(err.error.message)
        this.gettingSummaryReportNew = false
      }
    })
  }

  financeReportData() {
    this.gettingFinanceReport = true
    this.merchantService.financeData(this.merchantId, {
      'startDate': this.startDate,
      'endDate': this.endDate,
      'email': JSON.parse(localStorage.getItem('securityData')).user.email,
      consolidate: 0
    }).subscribe({
      next: result => {
        this.toaster.success('You will receive the report on your email shortly!')
        this.gettingFinanceReport = false
      }, error: err => {
        this.toaster.error(err.error.message)
        this.gettingFinanceReport = false
      }
    })
    this.merchantService.financeData(this.merchantId, {
      'startDate': this.startDate,
      'endDate': this.endDate,
      'email': JSON.parse(localStorage.getItem('securityData')).user.email,
      consolidate: 1
    }).subscribe({
      next: result => {
        this.toaster.success('You will receive the report on your email shortly!')
        this.gettingFinanceReport = false
      }, error: err => {
        this.toaster.error(err.error.message)
        this.gettingFinanceReport = false
      }
    })
  }
  revertTransfer(id) {

    this.gettingTransfers = true

    this.merchantService.ReverMerchantAmountTransfer(this.merchantId, id).subscribe((data: any) => {
      this.showDetails = false;
      this.toaster.success("Transfer reverted! Refreshing data.")
      this.getTransferList()
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }

  sendEmailPayout(payoutid?) {

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
  payoutDraft() {
    const mData = {
      "startDate": this.startDate,
      "endDate": this.endDate,
      "payout_adjustment": this.payoutAdjustments,
      "marketing_fee": this.marketingFee,
      "commission_adjustment": this.commisionAdjustment,
      "doordash": this.doordash,
      "ubereats": this.ubereats,
      "grubhub": this.grubhub,
      "storefront": this.storefront,
      "others": this.others,
      "remarks": this.remarks,

    };
    this.merchantService.payoutdraft(this.merchantId, mData).subscribe((data: any) => {
      this.toaster.success("Payout draft has been saved.");
    }, (err) => {
      this.toaster.error(err.error.message);
    })
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

  GetMerchantDetail() {

    this.merchantService.GetMerchantById(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;

      if (this.merchantDto.emailDistributionList != null) {
        this.tagsEmailDistributionArray = [...this.tagsEmailDistributionArray, ...this.merchantDto.emailDistributionList.split(";")]
      }
      else {
        this.tagsEmailDistributionArray = [...this.tagsEmailDistributionArray]
      }

    }, (err) => {
      this.toaster.error(err.message);
    })
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
  transferHistoryReport() {
    this.gettingHistoryReport = true;
    if (this.tagsEmailDistributionArray[0] == '') {
      this.tagsEmailDistributionArray.shift();
    }
    this.merchantService.historyReport(this.merchantId, {
      'startDate': this.startDate,
      'endDate': this.endDate,
      'email': this.tagsEmailDistributionArray
      // 'email': JSON.parse(localStorage.getItem('securityData')).user.email,
    }).subscribe((data) => {
      this.gettingHistoryReport = false;
      this.toaster.success("You will receive the report on your email shortly.");
      this.closeModal()
    }, err => {
      this.gettingHistoryReport = false;
      this.toaster.error(err.error.message);
    })
  }
  emailsSend() {

    if (this.emailbtn == 1) {
      this.transferHistoryReport()
    }
    else if (this.emailbtn == 2) {
      this.financeReportSummaryNewFormat()
    }
    else if (this.emailbtn == 3) {
      this.sendEmailPayout()
    }

  }
  transferringBank: boolean = false
  transferToBank(id) {
    var title = ''
    if (this.checkBankDetail == false) {
      this.translocoService.selectTranslate('reuseableWords.Are you sure?').subscribe(translation => {
        title = translation;
      });
    }
    var confirmButtonText = ''
    this.translocoService.selectTranslate('reuseableWords.Yes, proceed to payout!').subscribe(translation => {
      confirmButtonText = translation;
    });
    var cancelButtonText = ''
    this.translocoService.selectTranslate('reuseableWords.Cancel').subscribe(translation => {
      cancelButtonText = translation;
    });
    var text = ''
    this.translocoService.selectTranslate('reuseableWords.You wont be able to revert this!').subscribe(translation => {
      text = translation;
    });
    var swarltextHtml = ``
    var isShowConfirmbutton: boolean
    if (this.checkBankDetail == false) {
      isShowConfirmbutton = true
      if (this.accountDetail.accountHolderName != null && this.accountDetail.accountHolderName != '') {
        swarltextHtml = this.getHtmlContent(text, 0)
      }
      else {
        swarltextHtml = this.getHtmlContent(text, 1)
      }
    }
    else {
      isShowConfirmbutton = false
      swarltextHtml = ` <div><h5 class="mt-5"> No bank attach for transfer</h5></div>`
    }
    Swal.fire({
      title: title,
      html: swarltextHtml,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: cancelButtonText,
      confirmButtonText: confirmButtonText,
      showConfirmButton: isShowConfirmbutton
    }).then((result) => {
      if (result.isConfirmed) {
        this.transferringBank = true;
        this.merchantService.transferToBank(id, this.merchantId).subscribe((data: any) => {
          this.toaster.success("Paid out! Refreshing data.")
          this.getTransferList()
          this.transferringBank = false;
        }, (err) => {
          this.transferringBank = false;
          this.toaster.error(err.error.message);
        })
      }
    })

  }

  getHtmlContent(text, status) {
    if (status == 0) {
      var html = ` ${text}
      <div style="margin-top: 1.25rem;">
      <div style="display: flex; align-items: baseline; margin-bottom: 5px;">
        <span style="width: 200px; font-weight: bold; text-align: right; padding-right: 10px;">Bank Name:</span>
        <span>${this.accountDetail.bankName}</span>
      </div>
      <div style="display: flex; align-items: baseline; margin-bottom: 5px;">
        <span style="width: 200px; font-weight: bold; text-align: right; padding-right: 10px;">Account Name:</span>
        <span>${this.accountDetail.accountHolderName}</span>
      </div>
      <div style="display: flex; align-items: baseline; margin-bottom: 5px;">
        <span style="width: 200px; font-weight: bold; text-align: right; padding-right: 10px;">Account Number:</span>
        <span>********${this.accountDetail.last4}</span>
      </div>
    </div>
    `;
    }
    else {
      var html = ` ${text}
      <div style="margin-top: 1.25rem;">
        <div style="display: flex; align-items: baseline; margin-bottom: 5px;">
          <span style="width: 200px; font-weight: bold; text-align: right; padding-right: 10px;">Bank Name:</span>
          <span>${this.accountDetail.bankName}</span>
        </div>

        <div style="display: flex; align-items: baseline; margin-bottom: 5px;">
          <span style="width: 200px; font-weight: bold; text-align: right; padding-right: 10px;">Account Number:</span>
          <span>********${this.accountDetail.last4}</span>
        </div>
      </div>
    `;
    }
    return html
  }
  getBankInfoText(item: any): string {
    let bankInfoText = '';
    if (item.bankName !== '' && item.bankName !== 'null' && item.bankName !== null) {
      bankInfoText += 'Bank Name: ' + item.bankName;
    }
    if (item.accountHolderName !== '' && item.accountHolderName !== 'null' && item.accountHolderName !== null) {
      if (bankInfoText !== '') {
        bankInfoText += ', ';
      }
      bankInfoText += 'Account Holder Name: ' + item.accountHolderName;
    }
    if (item.last4 !== '' && item.last4 !== 'null' && item.last4 !== null) {
      if (bankInfoText !== '') {
        bankInfoText += ', ';
      }
      bankInfoText += 'Account Number: ********' + item.last4;
    }
    if (bankInfoText !== '') {
      bankInfoText = '( ' + bankInfoText + ' )';
    }
    return bankInfoText;
  }

}
