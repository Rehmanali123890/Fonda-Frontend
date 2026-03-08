import { FilterDataService } from './../../core/filter-data.service';
import { EsperDevices, MerchantUserListDto } from 'src/app/Models/merchant.model';
import { MerchantListDto, MerchantStatusEnum, ParserSetting } from './../../Models/merchant.model';
import { MerchantService } from './../../core/merchant.service';
import { SidenavComponent } from 'src/app/public/sidenav/sidenav.component'
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { SecurityService } from 'src/app/core/security.service';
import { UserRoleEnum } from 'src/app/Models/user.model';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppStateService } from 'src/app/core/app-state.service';
import { ToastrService } from 'ngx-toastr';
@UntilDestroy()
@Component({
  selector: 'app-merchants-list',
  templateUrl: './merchants-list.component.html',
  styleUrls: ['./merchants-list.component.scss']
})
export class MerchantsListComponent implements OnInit {
  @Input() merchantId: string;
  gettingMerchants: boolean;
  MerchantsList: MerchantListDto[] = [];
  merchantDto = new MerchantListDto();
  parserSetting = new ParserSetting();
  UpdatingSarserSetting: boolean = false
  merchantStatusEnum = MerchantStatusEnum;
  filterMerchantStatus: MerchantStatusEnum;
  merchantStatusEnumList = this.filterDataService.getEnumAsList(MerchantStatusEnum);
  savingMerchant: boolean;
  onBoardingCompleted: number;
  esperDeviceFilter: number
  marketStatus: boolean
  merchantName = '';
  merchantEmail = '';
  smsMerchantName: string = ""
  smsText = ""
  smsNumber = ""
  smsMerchantId: string = ""
  busyLoadingData: boolean = false;
  userRoleType: UserRoleEnum;
  experDevicesList: EsperDevices[] = []
  esperDevicesFilterList: string[] = []
  isChecked: boolean = false
  filter: number = 0
  hoursFilter: boolean = false;
  openingHoursFilter: any = 'all';
  GMBConnFilter: any = '';
  GMBVerifyFilter: any = '';
  DDstreamConnFilter: number;
  GHstreamConnFilter: number;
  constructor(private injector: Injector, private toaster: ToastrService, private appState: AppStateService, private securityService: SecurityService, private router: Router,
    private merchantservice: MerchantService, private filterDataService: FilterDataService, private translocoService: TranslocoService) { }

  ngOnInit(): void {
    const parentComponent = this.injector.get(SidenavComponent);
    parentComponent.CheckMerchantName = false
    this.userRoleType = this.securityService.securityObject.user.role;
    this.GetMerchantsList();
    this.GetMerchantDetail()
    this.subscribeAppState()
    // this.getParserSetting()
  }
  subscribeAppState() {

    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {

      this.merchantId = merchntId;
      this.GetMerchantDetail()

    })

  }
  ngOnChanges(changes: SimpleChanges): void {

    this.GetMerchantDetail()
  }
  merchantStatusToogle(merchantId: string, marketStatus: boolean) {
    this.merchantservice.marketStatusData(merchantId, {
      "marketStatus": marketStatus,
      "caller": "dashboard"
    }).subscribe({
      next: data => {
        this.toaster.success('Data saved successfully');
      }, error: err => {
        this.toaster.error(err.error.message);
      }
    })
  }

  saveParserSetting() {
    this.UpdatingSarserSetting = true
    this.merchantservice.parserSetting(this.securityService.securityObject.token, this.parserSetting).subscribe((data: MerchantListDto[]) => {
      this.toaster.success('Data saved successfully');
      this.UpdatingSarserSetting = false
      this.getParserSetting()
    }, (err) => {
      this.UpdatingSarserSetting = false
      this.getParserSetting()
      this.toaster.error(err.message);
    })
  }
  getParserSetting() {
    this.merchantservice.getparserSetting().subscribe((data: any) => {
      this.parserSetting = data.data
    }, (err) => {

      this.toaster.error(err.message);
    })
  }
  onChangeOpeningHoursFilter(event: any) {
    this.openingHoursFilter = event.target.value;
    this.GetMerchantsList()
    // this.onScroll()
  }
  onChangeGMBConnFilter(event: any) {
    this.GMBConnFilter = event.target.value;
    this.GetMerchantsList()
    // this.onScroll()
  }
  onChangeDDstreamConnFilter(event: any) {
    this.DDstreamConnFilter = event.target.value;
    this.GetMerchantsList()
    // this.onScroll()
  }
  onChangeGHstreamConnFilter(event: any) {
    this.GHstreamConnFilter = event.target.value;
    this.GetMerchantsList()
    // this.onScroll()
  }
  onChangeGMBVerifyFilter(event: any) {
    this.GMBVerifyFilter = event.target.value;
    this.GetMerchantsList()
    // this.onScroll()
  }
  objectValuesOpeningHoursFilter() {
    let openingHoursFilter: { startTime: string; endTime: string } = {
      startTime: "00:00:00",
      endTime: "23:59:59",
    };

    if (this.filter === 0) {
      this.openingHoursFilter = "all"
    }

    if (this.openingHoursFilter === "morning") {
      openingHoursFilter = {
        startTime: "09:00:00",
        endTime: "12:59:59",
      }
    } else if (this.openingHoursFilter === "afternoon") {
      openingHoursFilter = {
        startTime: "13:00:00",
        endTime: "17:59:59",
      }
    } else if (this.openingHoursFilter === "eveningOnwards") {
      openingHoursFilter = {
        startTime: "17:00:00",
        endTime: "23:59:59",
      }
    }
    return openingHoursFilter
  }
  expandtable: { expandtable: boolean, idx: number }[] = [];
  onChangeExpandtable(idx) {
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }
  GetMerchantsList() {
    let openingHoursFilter = this.objectValuesOpeningHoursFilter();

    this.gettingMerchants = true;
    this.merchantservice.GetMerchantsListPost(this.securityService.securityObject.token, this.merchantName, this.filterMerchantStatus, this.merchantEmail, 0, this.onBoardingCompleted, this.marketStatus, {
      "esperDeviceIds": this.esperDevicesFilterList,
      "openingHoursFilter": {
        "filter": this.filter,
        ...openingHoursFilter,
      }
    }, this.GMBConnFilter, this.GMBVerifyFilter, this.DDstreamConnFilter, this.GHstreamConnFilter).subscribe((data: MerchantListDto[]) => {
      this.MerchantsList = data;
      // for mobile view
      this.expandtable = new Array(this.MerchantsList.length).fill({ expandtable: false, idx: 0 });
      this.expandtable = this.expandtable.map((item, idx) => {
        return {
          ...item,
          idx: idx
        }
      })

      this.gettingMerchants = false;
      this.getMerchantDevicesList();
    }, (err) => {
      this.gettingMerchants = false;
      this.toaster.error(err.message);
    })
  }
  consolidateCheckbox() {
    this.isChecked = !this.isChecked
    this.isChecked === false ? this.filter = 0 : this.filter = 1
    this.GetMerchantsList()
    this.hoursFilter = !this.hoursFilter
    this.hoursFilter === false ? this.filter = 0 : this.filter = 1
  }

  onScroll(): void {
    let openingHoursFilter = this.objectValuesOpeningHoursFilter();
    if (this.busyLoadingData) return;
    this.busyLoadingData = true

    this.gettingMerchants = true;
    this.merchantservice.GetMerchantsListPost(
      this.securityService.securityObject.token,
      this.merchantName, this.filterMerchantStatus,
      this.merchantEmail, this.MerchantsList.length, this.onBoardingCompleted, this.marketStatus,

      {
        "esperDeviceIds": this.esperDevicesFilterList, "openingHoursFilter": {
          "filter": this.filter,
          ...openingHoursFilter
        }
      }, this.GMBConnFilter, this.GMBVerifyFilter).subscribe((data: MerchantListDto[]) => {
        this.MerchantsList.push(...data);
        this.getMerchantDevicesList()

        if (data.length == 0) {
          this.toaster.warning('No more results.');
        }
        this.gettingMerchants = false;
        this.busyLoadingData = false;
      }, (err) => {
        this.gettingMerchants = false;
        this.toaster.error(err.message);
        this.busyLoadingData = false;
      })


  }
  navigateMerchatUsers(merchant: MerchantListDto) {
    this.router.navigateByUrl(`/home/merchants/merchantUsers/${merchant.id}`);
  }
  navigateToMerchantSetting(merchant: MerchantListDto) {
    this.router.navigateByUrl(`/home/merchants/merchant-setting/${merchant.id}`);
  }
  resetObj() {
    this.merchantDto = new MerchantListDto();
  }
  SaveMerchantData(modal: ModalDirective) {
    this.savingMerchant = true;
    this.merchantDto.merchantStatus = MerchantStatusEnum.Active;
    this.merchantservice.AddMerchant(this.securityService.securityObject.token, this.merchantDto).subscribe((data: any) => {
      // this.MerchantsList = data;
      modal.hide();
      this.toaster.success('Data saved successfully');
      this.GetMerchantsList();
      this.savingMerchant = false;
    }, (err) => {
      this.savingMerchant = false;
      this.toaster.error(err.message);
    })
  }
  getMerchantDevicesList() {
    this.merchantservice.getEsperList().subscribe((data: any) => {
      this.experDevicesList = data.data

      this.MerchantsList.map((obj) => {
        obj.esperDetailObj = this.experDevicesList.filter((x) => {
          return x.device_name == obj.esperDeviceId
        })[0]
      })
    })
  }
  SendSms() {
    this.merchantservice.sendSMS({
      "to": this.smsNumber,
      "message": this.smsText
    }, this.smsMerchantName).subscribe((data: any) => {
      this.toaster.success('SMS sent successfully');
    }, (err) => {
      this.toaster.error(err.message);
    })
  }
  changeEsperFilter() {
    this.esperDevicesFilterList = []
    this.experDevicesList.map((x) => {
      if (this.esperDeviceFilter == 1) {
        if (x.status == 1) {
          this.esperDevicesFilterList.push(x.device_name)
        }
      }
      else {
        if (x.status == 60) {
          this.esperDevicesFilterList.push(x.device_name)
        }
      }
    })
    this.GetMerchantsList()
  }
  changeSMSTemplate(merchantName) {
    this.smsText = `Hello ${merchantName}, your Tablet is currently offline and orders will not populate or print automatically, please check if the tablet it's plugged to the charger making sure is on with full battery. Or please check if the tablet is connected to your restaurant Wi-Fi network, thank you.  If you think it is not correct, please contact customer support dialing or texting +18318244198.`
  }
  GetMerchantDetail() {

    this.merchantservice.GetMerchantById(this.securityService.securityObject.token, localStorage.getItem('currentMerchant')).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;

      // Check if the language is already set from localStorage
      if (localStorage.getItem('lang')) {
        return; // Ignore API language
      }
      this.translocoService.setActiveLang(this.merchantDto.language);

    }, (err) => {
      this.toaster.error(err.message);
    })
  }
}
