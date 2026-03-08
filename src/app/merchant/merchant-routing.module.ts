import { MerchantUsersComponent } from './merchant-users/merchant-users.component';
import { MerchantsListComponent } from './merchants-list/merchants-list.component';
import { MerchantSettingComponent } from './merchant-setting/merchant-setting.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantPlatformsComponent } from './merchant-platforms/merchant-platforms.component';
import { FinnaceReportComponent } from './finnace-report/finnace-report.component';
import { ProblematicTransactionReportComponent } from './problematic-transaction-report/problematic-transaction-report.component';
import { OrderTransactionReportComponent } from './order-transaction-report/order-transaction-report.component';
// import { MerchantOnBoardingComponent } from './merchant-on-boarding/merchant-on-boarding.component';
import { PayoutComponent } from './payout/payout.component';
import { NewPayoutComponent } from './new-payout/new-payout.component';
import { SendgridEmailSummaryComponent } from './sendgrid-email-summary/sendgrid-email-summary.component'
import { BulkPayoutComponent } from './bulk-payout/bulk-payout.component';
import { MerchantSinglePayoutDetailComponent } from './merchant-single-payout-detail/merchant-single-payout-detail.component';
import { GoogleAnalyticsComponent } from './google-analytics/google-analytics.component';
import { WoflowComponent } from './woflow/woflow.component';

import { ImportToastOrdersComponent } from './import-toast-orders/import-toast-orders.component';
import { ImportTransactionFileComponent } from './import-transaction-file/import-transaction-file.component';
import { MerchantSubscriptionDetailsComponent } from './merchant-subscription-details/merchant-subscription-details.component';
import { StoreFrontSettingsComponent } from './store-front-settings/store-front-settings.component';
import { StripeTreasuryAccountComponent } from './stripe-treasury-account/stripe-treasury-account.component';
import { GmbTabsComponent } from './gmb-tabs/gmb-tabs.component';
import { TermAndConditionComponent } from './term-and-condition/term-and-condition.component';
import { NewSinglePayoutDetailsComponent } from './new-single-payout-details/new-single-payout-details.component';
import { DoordashDetailsComponent } from './doordash-details/doordash-details.component';
import { GrubhubDetailsComponent } from './grubhub-details/grubhub-details.component';
import { UbereatsDetailsComponent } from './ubereats-details/ubereats-details.component';
import { StorefrontDetailsComponent } from './storefront-details/storefront-details.component';
import { EstimatePayoutDetailsComponent } from './estimate-payout-details/estimate-payout-details.component';
import { NewBulkPayoutComponent } from './new-bulk-payout/new-bulk-payout.component';
import { BankReconciliationComponent } from '../bank-reconciliation/bank-reconciliation.component';


const routes: Routes = [
  { path: 'merchantsList', component: MerchantsListComponent },
  { path: 'import-toast-orders', component: ImportToastOrdersComponent },
  { path: 'import-transaction-file', component: ImportTransactionFileComponent },
  { path: 'merchantUsers/:id', component: MerchantUsersComponent },
  { path: ':id/platforms', component: MerchantPlatformsComponent },
  { path: 'merchant-setting/:id', component: MerchantSettingComponent },
  { path: 'MerchantSubscriptionDetailsComponent', component: MerchantSubscriptionDetailsComponent },
  { path: 'StoreFrontSettingsComponent', component: StoreFrontSettingsComponent },
  { path: 'StripeTreasuryAccountComponent', component: StripeTreasuryAccountComponent },
  { path: 'finaceReport', component: FinnaceReportComponent },
  { path: 'problematicTransactionReportComponent', component: ProblematicTransactionReportComponent },
  { path: 'reports', component: OrderTransactionReportComponent },
  // { path: 'merchant-onBoarding', component: MerchantOnBoardingComponent },
  { path: 'bulk-invoice', component: BulkPayoutComponent },
  { path: 'payout', component: PayoutComponent },
  { path: 'new-payout', component: NewPayoutComponent },
  { path: 'sendgrid-email-summary', component: SendgridEmailSummaryComponent },
  { path: 'transfer-details/:id', component: MerchantSinglePayoutDetailComponent },
  { path: 'new-transfer-details/:id', component: NewSinglePayoutDetailsComponent },

  { path: 'google-analytics', component: GoogleAnalyticsComponent },
  { path: 'woflow', component: WoflowComponent },

  { path: 'google_my_business', component: GmbTabsComponent },
  { path: 'term-and-condition', component: TermAndConditionComponent },
  { path: 'doordash-details', component: DoordashDetailsComponent },
  { path: 'grubhub-details', component: GrubhubDetailsComponent },
  { path: 'ubereats-details', component: UbereatsDetailsComponent },
  { path: 'storefront-details', component: StorefrontDetailsComponent },
  { path: 'estimate-payout-details', component: EstimatePayoutDetailsComponent },
  { path: 'new-bulk-invoice', component: NewBulkPayoutComponent },
  { path: 'payout-reconciliation', component:BankReconciliationComponent },





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
