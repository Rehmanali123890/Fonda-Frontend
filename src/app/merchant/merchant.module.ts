import { SharedDirectivesModule } from './../shared-directives/shared-directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbSharedModule } from './../mdb-shared/mdb-shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantsListComponent } from './merchants-list/merchants-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
// import { WavesModule, TableModule, IconsModule } from 'ng-uikit-pro-standard';
import { MerchantUsersComponent } from './merchant-users/merchant-users.component';
import { MerchantSettingComponent } from './merchant-setting/merchant-setting.component';
import { MerchantTimeManagementComponent } from './merchant-time-management/merchant-time-management.component';
import { MerchantAccountDetailsComponent } from './merchant-account-details/merchant-account-details.component';
import { MerchantPlatformsComponent } from './merchant-platforms/merchant-platforms.component';
import { FinnaceReportComponent } from './finnace-report/finnace-report.component';
import { ProblematicTransactionReportComponent } from './problematic-transaction-report/problematic-transaction-report.component';
import { UbereatsComponent } from './merchant-platforms/ubereats/ubereats.component';
import { DoordashComponent } from './merchant-platforms/doordash/doordash.component';
import { OrderTransactionReportComponent } from './order-transaction-report/order-transaction-report.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CloverComponent } from './merchant-platforms/clover/clover.component';
import { MerchantPayoutDetailsComponent } from './merchant-payout-details/merchant-payout-details.component';
import { MerchantSubscriptionDetailsComponent } from './merchant-subscription-details/merchant-subscription-details.component';
import { BulkPayoutComponent } from './bulk-payout/bulk-payout.component';
import { MerchantSinglePayoutDetailComponent } from './merchant-single-payout-detail/merchant-single-payout-detail.component';
import { FinanceSettingsComponent } from './finance-settings/finance-settings.component';
import { PasswordsComponent } from './merchant-platforms/passwords/passwords.component';
import { GoogleAnalyticsComponent } from './google-analytics/google-analytics.component';
import { SquareComponent } from './merchant-platforms/square/square.component';
import { WoflowComponent } from './woflow/woflow.component';
import { MatProgressBarModule } from '@angular/material/progress-bar'
// import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { VirtualResturantsComponent } from './virtual-resturants/virtual-resturants.component';
import { SettingsTabComponent } from './settings-tab/settings-tab.component';
import { LoyaltyPointsComponent } from './loyalty-points/loyalty-points.component';
import { StoreFrontSettingsComponent } from './store-front-settings/store-front-settings.component';
import { StripeTreasuryAccountComponent } from './stripe-treasury-account/stripe-treasury-account.component';
import { PayoutComponent } from './payout/payout.component';
import { NewPayoutComponent } from './new-payout/new-payout.component';
import { SendgridEmailSummaryComponent } from './sendgrid-email-summary/sendgrid-email-summary.component'
import { ImportToastOrdersComponent } from './import-toast-orders/import-toast-orders.component';
import { TranslocoModule } from '@ngneat/transloco';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { GmbTabsComponent } from './gmb-tabs/gmb-tabs.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MediaComponent } from './media/media.component';
import { GmbMenusComponent } from './gmb-menus/gmb-menus.component';
import { FoodOrderingComponent } from './food-ordering/food-ordering.component';
import { TermAndConditionComponent } from './term-and-condition/term-and-condition.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

import { PreventEDirective } from 'src/app/core/prevent-e-numeric.directive';
import { NewPayoutDetailsComponent } from './new-payout-details/new-payout-details.component';
import { NewSinglePayoutDetailsComponent } from './new-single-payout-details/new-single-payout-details.component';

import { ImportTransactionFileComponent } from './import-transaction-file/import-transaction-file.component';

import { DoordashDetailsComponent } from './doordash-details/doordash-details.component';
import { GrubhubDetailsComponent } from './grubhub-details/grubhub-details.component';
import { UbereatsDetailsComponent } from './ubereats-details/ubereats-details.component';
import { StorefrontDetailsComponent } from './storefront-details/storefront-details.component';
import { EstimatePayoutDetailsComponent } from './estimate-payout-details/estimate-payout-details.component';
import { NewBulkPayoutComponent } from './new-bulk-payout/new-bulk-payout.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [MerchantsListComponent, MerchantSettingComponent, MerchantAccountDetailsComponent, SendgridEmailSummaryComponent, SettingsTabComponent, MerchantTimeManagementComponent, MerchantPayoutDetailsComponent, FinanceSettingsComponent, VirtualResturantsComponent, LoyaltyPointsComponent, MerchantPlatformsComponent, SquareComponent, CloverComponent, DoordashComponent, UbereatsComponent, PasswordsComponent, StoreFrontSettingsComponent, StripeTreasuryAccountComponent, OrderTransactionReportComponent, FinnaceReportComponent,ProblematicTransactionReportComponent, GoogleAnalyticsComponent, BulkPayoutComponent, PayoutComponent, WoflowComponent, ImportToastOrdersComponent, MerchantSubscriptionDetailsComponent, MerchantSinglePayoutDetailComponent, MerchantUsersComponent, GmbTabsComponent, EditProfileComponent, MediaComponent, GmbMenusComponent, FoodOrderingComponent, TermAndConditionComponent, PreventEDirective, NewPayoutDetailsComponent, NewSinglePayoutDetailsComponent, DoordashDetailsComponent, GrubhubDetailsComponent, UbereatsDetailsComponent, StorefrontDetailsComponent, EstimatePayoutDetailsComponent, ImportTransactionFileComponent, NewPayoutComponent, NewBulkPayoutComponent],

  imports: [
    CommonModule,
    MerchantRoutingModule,
    MdbSharedModule,
    FormsModule,
    NgxDocViewerModule,
    ToastrModule,
    PdfViewerModule,
    SharedDirectivesModule,
    MatProgressBarModule,
    NgSelectModule,
    InfiniteScrollModule,
    MatTabsModule,
    MdbTabsModule,
    MatDatepickerModule,
    CarouselModule,


    MatNativeDateModule,
    MDBBootstrapModule.forRoot(),
    // WavesModule,
    // TableModule,
    // IconsModule,
    // InfiniteScrollModule,
    ReactiveFormsModule,
    TranslocoModule,
    HttpClientModule


  ]
})
export class MerchantModule { }
