import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { LazyModalDto } from 'src/app/Models/app.model';
import { MerchantListDto, MerchantStatusEnum, storeFronturl } from 'src/app/Models/merchant.model';
import { UserRoleEnum } from 'src/app/Models/user.model';
import * as moment from "moment";
import * as descriptions from '../../../../src/app/tooltips-for-fields/tooltips';


@Component({
  selector: 'app-merchant-account-details',
  templateUrl: './merchant-account-details.component.html',
  styleUrls: ['./merchant-account-details.component.scss']
})

export class MerchantAccountDetailsComponent implements OnInit {
  @Input() merchantDto = new MerchantListDto();
  @Input() gettingMerchantDetail: boolean;
  @Input() merchantId: string;
  // @Output() triggerChangeParent = new EventEmitter<any>();
  @Input() selectedTab: string;

  merchantStatusEnum = MerchantStatusEnum;
  merchantStatusEnumList = this.filterDataService.getEnumAsList(MerchantStatusEnum);
  savingMerchant: boolean;
  connectAccount: boolean;
  gettingMerchantDetail_alert: boolean = false;
  savingMerchantComission: boolean;
  userHasBankEditAccess: boolean = false;
  userRoleType: UserRoleEnum;
  accountsData: any;

  // tooltips start
  businessAddressDescription = descriptions.businessAddressDescription;
  timezoneDescription = descriptions.timezoneDescription;
  emailDescription = descriptions.emailDescription;
  dobDescription = descriptions.dobDescription;
  phoneDescription = descriptions.phoneDescription;
  onboardingCompletedDescription = descriptions.onboardingCompletedDescription;

  legalBusinessNameDescription = descriptions.legalBusinessNameDescription;
  einNumberDescription = descriptions.einNumberDescription;
  businessWebsiteDescription = descriptions.businessWebsiteDescription;
  businessAddressLineDescription = descriptions.businessAddressLineDescription;
  cityDescription = descriptions.cityDescription;
  stateDescription = descriptions.stateDescription;
  zipCodeDescription = descriptions.zipCodeDescription;
  businessNumberDescription = descriptions.businessNumberDescription;
  bankAccountNumberDescription = descriptions.bankAccountNumberDescription;
  bankAccountRoutingNumberDescription = descriptions.bankAccountRoutingNumberDescription

  fieldsToExtract = ['stripeAccountId', 'merchantName', 'email', 'firstName', 'lastName', 'pocdob', 'zip', 'businessWebsite', 'businessNumber', 'legalBusinessName',
    'address', 'phone', 'bankAccountRoutingNumber', 'bankAccountNumber', 'businessAddressState', 'businessAddressCity', 'businessAddressLine'
    , 'businessTaxId'];


  // tooltips end
  constructor(private toaster: ToastrService, private securityService: SecurityService, private router: Router,
    private merchantservice: MerchantService, private filterDataService: FilterDataService, private appUi: AppUiService, private activatedRoute: ActivatedRoute) {

    activatedRoute.params.subscribe(val => {
      this.merchantId = this.activatedRoute.snapshot.paramMap.get('id');
    });
  }

  ngOnInit(): void {
    this.userRoleType = this.securityService.securityObject.user.role;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getMerchantAccountDetail()

  }
  resetObj() {
    this.merchantDto = new MerchantListDto();
  }
  getAccountdetail() {
    this.getMerchantAccountDetail()

  }
  getMerchantAccountDetail = () => {
    this.merchantservice.GetMerchantAccountDetail(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data
      this.userHasBankEditAccess = false

      if (this.merchantDto.bank_edit_emails_access && this.merchantDto.bank_edit_emails_access.trim() !== '') {
        const allowedEmails = this.merchantDto.bank_edit_emails_access.split(',').map(email => email.trim().toLowerCase());
        const loggedInEmail = this.securityService.securityObject.user.email.toLowerCase();
        this.userHasBankEditAccess = allowedEmails.includes(loggedInEmail);
      }
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
  processSaveMerchantData = () => {
    this.savingMerchant = true;
    const newMerchantDto = this.extractFields()
    // this.merchantDto.merchantStatus = MerchantStatusEnum.Active;
    this.merchantservice.UpdateMerchantAccountDetail(this.securityService.securityObject.token, this.merchantId, newMerchantDto).subscribe((data: MerchantListDto) => {
      // this.MerchantsList = data;
      this.toaster.success('Data saved successfully');
      // this.GetMerchantsList();
      this.savingMerchant = false;
      this.merchantDto = data
      // this.triggerChangeParent.emit();
    }, (err) => {
      this.savingMerchant = false;
      this.toaster.error(err.error.message);
    })
  }

  openConnectAccount = () => {
    this.merchantDto.openStripeConnectAccount = true
    this.connectAccount = true;
    // this.merchantDto.merchantStatus = MerchantStatusEnum.Active;
    this.merchantservice.OpenConnectAccount(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
      this.toaster.success('Connect account created successfully ');
      // this.GetMerchantsList();
      this.merchantDto = data
      this.connectAccount = false;
      // this.triggerChangeParent.emit();
    }, (err) => {
      this.connectAccount = false;
      this.toaster.error(err.error.message);
    })
  }

  changeTab(tab) {
    alert(tab)
  }
  merchantStatusToogle() {
    if (this.merchantDto.marketStatus == false) {
      this.gettingMerchantDetail_alert = true
    }
    this.merchantservice.marketStatusData(this.merchantId, {
      "marketStatus": this.merchantDto.marketStatus,
      "caller": "dashboard"
    }).subscribe({
      next: data => {
        this.gettingMerchantDetail_alert = false
        this.toaster.success('Data saved successfully');
        this.getMerchantAccountDetail()
      }, error: err => {
        this.gettingMerchantDetail_alert = false
        this.toaster.error(err.error.message);
      }
    })
  }
  sendReminderEmail() {
    this.merchantservice.sendReminderEmail(this.merchantId).subscribe(() => {
      this.toaster.success('Email sent successfully');
    }, (err) => {
      this.savingMerchant = false;
      this.toaster.error(err.error.message);
    })
  }

  extractFields(): any {
    const result = {};
    this.fieldsToExtract.forEach(field => {
      if (this.merchantDto.hasOwnProperty(field)) {
        result[field] = this.merchantDto[field];
      }
    });
    return result;
  }
}
