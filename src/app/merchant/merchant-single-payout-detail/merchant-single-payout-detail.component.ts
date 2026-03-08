import { Component, OnInit } from '@angular/core';
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
  selector: 'app-merchant-single-payout-detail',
  templateUrl: './merchant-single-payout-detail.component.html',
  styleUrls: ['./merchant-single-payout-detail.component.scss']
})
export class MerchantSinglePayoutDetailComponent implements OnInit {
  merchantDto = new MerchantListDto();
  merchantId: string;
  PayoutTypeDescription = PayoutTypeDescription;
  showDetails: boolean = false
  SubscriptionDescriptionEnum = SubscriptionDescription
  gettingMerchantDetail: boolean;
  payoutId = this.activatedRoute.snapshot.paramMap.get('id');
  PayoutCalculationsObj: PayoutCalculations;
  querryparam: boolean = true
  userRoleType: UserRoleEnum;
  showmainloader: boolean = true
  constructor(private toaster: ToastrService, private securityService: SecurityService, private router: Router,
    private merchantservice: MerchantService, private appState: AppStateService, private filterDataService: FilterDataService, private appUi: AppUiService, private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.userRoleType = this.securityService.securityObject.user.role;
    if (this.activatedRoute.snapshot.queryParams['referrer'] == 'payout') {
      this.querryparam = false
    }
    this.subscribeAppState()
    this.GetMerchantDetail();
  }
  subscribeAppState() {
    this.merchantId = this.appState.currentMerchant;
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.merchantId = merchntId;
      this.GetMerchantDetail()
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
    this.merchantservice.GetMerchantPayoutById(this.payoutId, this.merchantId).subscribe((data: any) => {
      this.PayoutCalculationsObj = data.data
      this.gettingMerchantDetail = false;
      this.showDetails = true
      this.showmainloader = false;
    }, (err) => {
      this.gettingMerchantDetail = false;
      this.toaster.error(err.message);
      this.showmainloader = false;
    })
  }
  async redirectBack() {

    if (this.activatedRoute.snapshot.queryParams['referrer'] == 'settings') {
      const compl = await this.router.navigateByUrl('/home/merchants/merchant-setting/' + this.merchantId);

    }
    else if (this.activatedRoute.snapshot.queryParams['referrer'] == 'payout') {
      const compl = await this.router.navigateByUrl('/home/merchants/payout');
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
