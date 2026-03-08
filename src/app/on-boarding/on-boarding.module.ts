import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnBoardingRoutingModule } from './on-boarding-routing.module';
import { MerchantOnBoardingComponent } from './merchant-on-boarding/merchant-on-boarding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
// import { TableModule, WavesModule } from 'ng-uikit-pro-standard';
import { SharedDirectivesModule } from '../shared-directives/shared-directives.module';
import { OnboardingFormComponent } from './onboarding-form/onboarding-form.component';
import { ThanksMessageComponent } from './thanks-message/thanks-message.component';
import { TranslocoModule } from '@ngneat/transloco';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [MerchantOnBoardingComponent, OnboardingFormComponent, ThanksMessageComponent],
  imports: [
    CommonModule,
    OnBoardingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MdbSharedModule,
    NgSelectModule,
    // WavesModule,
    // TableModule,
    MDBBootstrapModule,
    SharedDirectivesModule,  
    TranslocoModule,
    HttpClientModule

  ]
})
export class OnBoardingModule { }
