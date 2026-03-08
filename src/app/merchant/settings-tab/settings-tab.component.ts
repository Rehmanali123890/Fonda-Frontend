import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { EsperDevices, MerchantListDto, MerchantStatusEnum } from 'src/app/Models/merchant.model';
import { UserRoleEnum } from 'src/app/Models/user.model';
import { StorefrontService } from 'src/app/core/storefront.service';
import * as descriptions from '../../../../src/app/tooltips-for-fields/tooltips';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-settings-tab',
  templateUrl: './settings-tab.component.html',
  styleUrls: ['./settings-tab.component.scss']
})
export class SettingsTabComponent implements OnInit {
  @Output() settingsTabSelected = new EventEmitter<void>();
  @Input() merchantDto = new MerchantListDto();
  @Input() gettingMerchantDetail: boolean;
  @Input() selectedTab: string;
  @Input() merchantId: string;
  esperDeviceIdLocal = ""
  merchantStatusEnum = MerchantStatusEnum;
  merchantStatusEnumList = this.filterDataService.getEnumAsList(MerchantStatusEnum);
  savingMerchant: boolean;
  savingMerchantComission: boolean;
  tagsEmailDistributionArray: string[] = []
  gettingPDF: boolean;
  currentDate: string



  showHintOnHover: boolean = false;
  userRoleType: UserRoleEnum;
  constructor(private toaster: ToastrService, private securityService: SecurityService, private router: Router, private storeFrontService: StorefrontService,
    private merchantservice: MerchantService, private filterDataService: FilterDataService, private appUi: AppUiService, private activatedRoute: ActivatedRoute,
    private translocoService: TranslocoService) { }

  // tooltips start
  acceptSpecialInstructionsDescription = descriptions.acceptSpecialInstructionsDescription;
  autoAcceptUbereatsOrdersDescription = descriptions.autoAcceptUbereatsOrdersDescription;
  connectedDeviceIdDescription = descriptions.connectedDeviceIdDescription;
  pauseResumeParserDescription = descriptions.pauseResumeParserDescription;
  pauseResumeFondaParserDescription = descriptions.pauseResumeFondaParserDescription;
  busyModeDescription = descriptions.busyModeDescription;
  orderPreparationTimeDescription = descriptions.orderPreparationTimeDescription;
  orderDelayTimeDescription = descriptions.orderDelayTimeDescription;
  allowGoogleReviewsReplyDescription = descriptions.allowGoogleReviewsReplyDescription;
  storefrontChargeCardFeesDescription = descriptions.storefrontChargeCardFeesDescription;
  merchantEmailDistributionListDescription = descriptions.merchantEmailDistributionListDescription;

  fieldsToExtract = ['onboardingdate', 'cardfeeType', 'googleReviewsReply', 'acceptSpecialInstructions',
    'order_creation_permission', 'language', 'parserStatus', 'orderDelayTime',
    'preparationTime', 'autoAcceptOrder', 'busyMode', 'merchantStatus', 'email', 'notificationText', 'notificationTextToggle', 'polling_frequency', 'is_polling_enabled', 'is_bogo', 'platform_price_flag'];

  ngOnInit(): void {

    this.userRoleType = this.securityService.securityObject.user.role;
    const currentDate = new Date();
    // Get the next day by adding 1 to the current day
    this.currentDate = currentDate.toISOString().split('T')[0];
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("ngOnChanges in setting tab=")
    this.myFunction()
  }
  myFunction() {

    this.GetMerchantDetail()

  }

  showHint() {
    this.showHintOnHover = true;
  }

  hideHint() {
    this.showHintOnHover = false;
  }
  notificationToggle(notificationtoggle: number) {
    if (notificationtoggle == 0) {
      this.merchantDto.notificationText = ''
    }
    this.SaveMerchantData()
  }
  SaveMerchantData() {
    this.savingMerchant = true;

    if (this.tagsEmailDistributionArray.length > 1 && this.tagsEmailDistributionArray[0] == '') {
      this.tagsEmailDistributionArray.splice(0, 1)
    }
    console.log("old merchant dto ", this.merchantDto)
    const newMerchantDto = this.extractFields()
    console.log("new merchant dto ", newMerchantDto)
    this.merchantservice.UpdateMerchantSetting(this.securityService.securityObject.token, this.merchantId, { ...newMerchantDto, emailDistributionList: this.tagsEmailDistributionArray.join(";") }).subscribe((data: MerchantListDto) => {
      this.toaster.success('Data saved successfully');
      this.merchantDto = data
      this.savingMerchant = false;
    }, (err) => {
      this.savingMerchant = false;
      this.toaster.error(err.error.message);
    })
  }
  experDevicesList: EsperDevices[] = []
  esperDetailObj: EsperDevices = new EsperDevices()
  @Output() triggerChangeParent = new EventEmitter<any>();
  gettingEsperInformation: boolean = false;
  @ViewChild('EsperDevicePopup') EsperDevicePopup: ModalDirective;
  AssigningDeviceToMerchant: boolean = false
  detachingDeviceToMerchant: boolean = false
  getEsperDetails() {
    this.gettingEsperInformation = true
    this.merchantservice.getEsperList().subscribe((data: any) => {
      this.experDevicesList = data.data
      let temp = []
      temp = this.experDevicesList.filter((x) => {
        return x.device_name == this.esperDeviceIdLocal
      })

      if (temp.length == 0) {
        this.toaster.error("Please provide correct device Id");
        this.gettingEsperInformation = false
      }
      else {
        this.esperDetailObj = temp[0]

        this.gettingEsperInformation = false

      }
      // this.gettingEsperInformation = false
      // if (this.esperDetailObj == undefined) {

      // }

    }, (err) => {
      this.toaster.error(err.error.message);
      this.gettingEsperInformation = false

    })
  }
  connectDisconnectEsper(status) {
    this.AssigningDeviceToMerchant = true
    this.merchantservice.connectDisconnectEsperDevice({
      "esperDeviceId": this.esperDetailObj.device_name,
      "disconnect": status
    }, this.merchantId).subscribe((data: any) => {
      this.toaster.success('Device saved successfully');
      this.AssigningDeviceToMerchant = false
      this.EsperDevicePopup.hide()
      this.triggerChangeParent.emit()
    }, (err) => {
      this.toaster.error(err.error.message);
      this.AssigningDeviceToMerchant = false

    })
  }
  detachEsperDevice() {
    this.detachingDeviceToMerchant = true
    this.merchantservice.connectDisconnectEsperDevice({
      "esperDeviceId": this.merchantDto.esperDeviceId,
      "disconnect": 1
    }, this.merchantId).subscribe((data: any) => {
      this.detachingDeviceToMerchant = false

      this.toaster.success('Device disconnected successfully');
      this.triggerChangeParent.emit()
    }, (err) => {
      this.toaster.error(err.error.message);
      this.detachingDeviceToMerchant = false

    })
  }
  // TAG INPUT CHIPS !!!
  removeTag(tag) {

    this.tagsEmailDistributionArray = this.tagsEmailDistributionArray.filter((email, idx) => email !== tag)

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
  GetMerchantDetail() {

    this.merchantservice.GetMerchantById(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;


      if (this.merchantDto.emailDistributionList != null) {
        this.tagsEmailDistributionArray = []
        this.tagsEmailDistributionArray = [...this.tagsEmailDistributionArray, ...this.merchantDto.emailDistributionList.split(";")]
      }
      else {
        this.tagsEmailDistributionArray = [...this.tagsEmailDistributionArray]
      }
      // Check if the language is already set from localStorage
      if (localStorage.getItem('lang')) {
        return; // Ignore API language
      }
      this.translocoService.setActiveLang(this.merchantDto.language);
    }, (err) => {
      this.toaster.error(err.message);
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
  preventzerovalue(event: KeyboardEvent, preptime: number) {
    const inputChar = event.key;

    // Block if input is '0' and the field is empty (i.e., 0 as the first digit)
    if (inputChar === '0' && preptime == 1 && !this.merchantDto.preparationTime) {
      event.preventDefault();
    }
    if (inputChar === '0' && preptime == 0 && !this.merchantDto.orderDelayTime) {
      event.preventDefault();
    }
    if (['e', 'E', '+', '-'].includes(inputChar)) {
      event.preventDefault();
    }

  }

}

