


import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { UserRoleEnum } from 'src/app/Models/user.model';
import { MerchantListDto, PayoutCalculations, PayoutTypeDescription, SubscriptionDescription } from 'src/app/Models/merchant.model';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/core/app-state.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-new-single-payout-details',
  templateUrl: './new-single-payout-details.component.html',
  styleUrls: ['./new-single-payout-details.component.css']
})
export class NewSinglePayoutDetailsComponent implements OnInit {
  merchantDto = new MerchantListDto();
  merchantId: string;
  PayoutTypeDescription = PayoutTypeDescription;
  payoutType: number = 2;
  showDetails: boolean = false
  SubscriptionDescriptionEnum = SubscriptionDescription
  gettingMerchantDetail: boolean;
  payoutId = this.activatedRoute.snapshot.paramMap.get('id');
  PayoutCalculationsObj: PayoutCalculations;
  querryparam: boolean = true
  userRoleType: UserRoleEnum;
  gettingCalculations: boolean;
  startDate: string
  netPayout: number
  endDate: string
  disableTransferBtn: boolean = false;
  PayoutCalculationsListObj: PayoutCalculations[] = []
  financepayoutcalculationObj = []
  showmainloader: boolean = true
  constructor(private toaster: ToastrService, private merchantService: MerchantService, private securityService: SecurityService, private router: Router,
    private merchantservice: MerchantService, private appState: AppStateService, private filterDataService: FilterDataService, private appUi: AppUiService, private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.userRoleType = this.securityService.securityObject.user.role;
    if (this.activatedRoute.snapshot.queryParams['referrer'] == 'newpayout') {
      this.querryparam = false
    }
    this.startDate = this.activatedRoute.snapshot.queryParams['startdate']
    this.endDate = this.activatedRoute.snapshot.queryParams['enddate']
    this.merchantId = this.activatedRoute.snapshot.queryParams['payout_merchantid']
    this.subscribeAppState()
    this.GetFinancePayout()
    this.GetMerchantDetail();
  }
  subscribeAppState() {
    // Only set merchantId if it wasn't set from the query parameters
    if (!this.merchantId) {
      this.merchantId = this.appState.currentMerchant;
    }
  
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.merchantId = merchntId;
      this.GetMerchantDetail();
    })
  }



  GetFinancePayout() {
    this.showmainloader = true
    const mData = {
      "startDate": this.startDate,
      "endDate": this.endDate,
      "createTransfer": 0,
      "orderSource": "",
      "payoutType": this.payoutType,
      "unlocked_only": 1,
      "payout_id": this.payoutId,
    };
    console.log('Finance data object ---->',mData)
    this.merchantService.getfinancepayout(this.merchantId, mData).subscribe((data: any) => {

      this.financepayoutcalculationObj = data.data
      console.log('Finance object -->',this.financepayoutcalculationObj)
      if (this.financepayoutcalculationObj) {
        this.netPayout = this.financepayoutcalculationObj['netPayout']
      }
      this.showmainloader = false
    }, (err) => {
      this.showmainloader = false
      this.toaster.error(err.error.message);
    })
  }

  GetMerchantDetail() {
    this.gettingMerchantDetail = true;
    this.merchantservice.GetMerchantById(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;
    }, (err) => {
      this.gettingMerchantDetail = false;
      this.toaster.error(err.message);
    })
    this.merchantservice.GetFinanceMerchantPayoutById(this.payoutId, this.merchantId).subscribe((data: any) => {
      this.PayoutCalculationsObj = data.data
      this.gettingMerchantDetail = false;
      this.showDetails = true
    }, (err) => {
      this.gettingMerchantDetail = false;
      this.toaster.error(err.message);
    })
  }
  async redirectBack() {

    if (this.activatedRoute.snapshot.queryParams['referrer'] == 'settings') {
      //const compl = await this.router.navigateByUrl('/home/merchants/merchant-setting/' + this.merchantId);
      const queryParams = { type: 'new-payout' };
      const compl = await this.router.navigate(['/home/merchants/merchant-setting', this.merchantId], { queryParams });

    }
    else if (this.activatedRoute.snapshot.queryParams['referrer'] == 'newpayout') {
      const compl = await this.router.navigateByUrl('/home/merchants/new-payout');
    }
    else if (this.activatedRoute.snapshot.queryParams['referrer'] == 'reports') {
      const compl = await this.router.navigateByUrl(`/home/merchants/reports?selectedTab=${this.activatedRoute.snapshot.queryParams['selectedTab']}&applyStartDate=${this.activatedRoute.snapshot.queryParams['applyStartDate']}&applyEndDate=${this.activatedRoute.snapshot.queryParams['applyEndDate']}`);
    }
    else {
      const compl = await this.router.navigateByUrl('/home/logs/audit-logs');
    }
  }
  getBankInfoText(): string {
    let bankInfoText = '';
    if (this.PayoutCalculationsObj.bankName !== '' && this.PayoutCalculationsObj.bankName !== 'null' && this.PayoutCalculationsObj.bankName !== null) {
      bankInfoText += 'Bank Name: ' + this.PayoutCalculationsObj.bankName;
    }
    if (this.PayoutCalculationsObj.accountHolderName !== '' && this.PayoutCalculationsObj.accountHolderName !== 'null' && this.PayoutCalculationsObj.accountHolderName !== null) {
      if (bankInfoText !== '') {
        bankInfoText += ', ';
      }
      bankInfoText += 'Account Holder Name: ' + this.PayoutCalculationsObj.accountHolderName;
    }
    if (this.PayoutCalculationsObj.last4 !== '' && this.PayoutCalculationsObj.last4 !== 'null' && this.PayoutCalculationsObj.last4 !== null) {
      if (bankInfoText !== '') {
        bankInfoText += ', ';
      }
      bankInfoText += 'Account Number: ********' + this.PayoutCalculationsObj.last4;
    }
    if (bankInfoText !== '') {
      bankInfoText = '( ' + bankInfoText + ' )';
    }
    return bankInfoText;
  }
}
