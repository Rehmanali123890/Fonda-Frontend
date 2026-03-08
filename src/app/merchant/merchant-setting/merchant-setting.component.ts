import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { MerchantListDto } from 'src/app/Models/merchant.model';
import * as moment from "moment";
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/core/app-state.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserRoleEnum } from 'src/app/Models/user.model';
import { SettingsTabComponent } from 'src/app/merchant/settings-tab/settings-tab.component';
import { NewPayoutDetailsComponent } from 'src/app/merchant/new-payout-details/new-payout-details.component';
import { MerchantAccountDetailsComponent } from 'src/app/merchant/merchant-account-details/merchant-account-details.component';
import { SendgridEmailSummaryComponent } from 'src/app/merchant/sendgrid-email-summary/sendgrid-email-summary.component';
import { MerchantPayoutDetailsComponent } from 'src/app/merchant/merchant-payout-details/merchant-payout-details.component';
import { TranslocoService } from '@ngneat/transloco';
import { MdbTabsComponent, MdbTabComponent } from 'mdb-angular-ui-kit/tabs'; // Use these components
import { SidenavComponent } from 'src/app/public/sidenav/sidenav.component'



@UntilDestroy()
@Component({
  selector: 'app-merchant-setting',
  templateUrl: './merchant-setting.component.html',
  styleUrls: ['./merchant-setting.component.scss']
})
export class MerchantSettingComponent implements OnInit {
  @ViewChild('tabs') tabs!: MdbTabsComponent;
  @ViewChild(SettingsTabComponent) settingTabComponent: SettingsTabComponent;
  @ViewChild(MerchantAccountDetailsComponent) merchantAccountDetailsComponent: MerchantAccountDetailsComponent;
  @ViewChild(SendgridEmailSummaryComponent) SendgridEmailSummaryComponent: SendgridEmailSummaryComponent;
  @ViewChild(MerchantPayoutDetailsComponent) MerchantPayoutDetailComponent: MerchantPayoutDetailsComponent;
  @ViewChild(NewPayoutDetailsComponent) NewPayoutDetailsComponent: NewPayoutDetailsComponent;
  merchantDto = new MerchantListDto();
  merchantId: string;
  gettingMerchantDetail: boolean;
  showtreasury: boolean = false;
  showmainloader: boolean = true;
  selectedTab: string
  type: string
  userRoleType: UserRoleEnum;
  constructor(private injector: Injector, private route: ActivatedRoute, private translocoService: TranslocoService, private toaster: ToastrService, private securityService: SecurityService, private router: Router,
    private merchantservice: MerchantService, private appState: AppStateService, private filterDataService: FilterDataService, private appUi: AppUiService, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(val => {
      this.merchantId = this.activatedRoute.snapshot.paramMap.get('id');
      const parentComponent = this.injector.get(SidenavComponent);
      parentComponent.parentFunction(this.merchantId);
      parentComponent.CheckMerchantName = true
      this.GetMerchantDetail();
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];
    });
    this.userRoleType = this.securityService.securityObject.user.role;
    this.showtreasury = this.securityService.securityObject.user.showtreasury
    this.selectedTab = "settings"
    this.merchantId = this.activatedRoute.snapshot.paramMap.get('id');

    this.subscribeAppState()
    this.GetMerchantDetail();
  }
  ngAfterViewInit() {
    const tabs = document.querySelectorAll('.nav-tabs .nav-link');
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        const title = tab.textContent.trim();
        if (title == 'Payouts' || title == 'Pagos') {
          this.MerchantPayoutDetailComponent.mydateFunction();
        }
        else if (title == 'Email Summary' || title == 'Resumen Correo Electrónico') {

          this.SendgridEmailSummaryComponent.myFunction();
        }
        else if (title == 'Settings' || title == 'Configuraciones') {
          // this.settingTabComponent.myFunction();
        }
        else if (title == 'Account Details' || title == 'Detalles de la Cuenta') {
          this.merchantAccountDetailsComponent.getAccountdetail()
        }
      });
    });


  }

  subscribeAppState() {
    //this.merchantId = this.appState.currentMerchant;
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.showmainloader = true
      this.router.navigate(['/home/merchants/merchant-setting/' + merchntId])
      // this.merchantId = merchntId;
      // this.GetMerchantDetail()
    })



  }


  GetMerchantDetail() {

    this.gettingMerchantDetail = true;
    this.merchantservice.GetMerchantById(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;
      // this.translocoService.setActiveLang(this.merchantDto.language);
      this.gettingMerchantDetail = false;
      this.showmainloader = false
      // this.marketStatus = this.merchantDto.marketStatus
      if (this.merchantDto.subscriptionStartDate) {
        this.merchantDto.subscriptionStartDate = moment(this.merchantDto.subscriptionStartDate).format('YYYY-MM-DD');
        //this.merchantDto.nextSubscriptionChargeDate = moment(this.merchantDto.subscriptionStartDate).add(this.merchantDto.subscriptionFrequency, 'M').format('YYYY-MM-DD');
      }
      if (this.merchantDto.slug == null) {
        this.merchantDto.slug = this.merchantDto.merchantName
      }




      if (this.type == 'new-payout') {
        setTimeout(() => {
          this.tabs.setActiveTab(3);
        }, 0);
        this.NewPayoutDetailsComponent.mydateFunction();
        this.NewPayoutDetailsComponent.calculatePayout(0);
      }

    }, (err) => {
      this.gettingMerchantDetail = false;
      this.showmainloader = false
      this.toaster.error(err.message);
    })
  }



}
