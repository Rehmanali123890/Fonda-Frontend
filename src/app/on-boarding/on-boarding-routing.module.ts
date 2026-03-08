import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantOnBoardingComponent } from './merchant-on-boarding/merchant-on-boarding.component';
import { ThanksMessageComponent } from './thanks-message/thanks-message.component';

const routes: Routes = [
  { path: 'merchant-onBoarding/:merchant-id', component: MerchantOnBoardingComponent },
  { path: 'merchant-onBoarding', component: MerchantOnBoardingComponent },
  { path: 'onboarding-form', redirectTo: '/', pathMatch: 'full' },
  { path: 'thanks', component: ThanksMessageComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnBoardingRoutingModule { }
