import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDirectivesModule } from './../shared-directives/shared-directives.module';

// import { ChipsModule } from 'ng-uikit-pro-standard';
import { NgSelectModule } from '@ng-select/ng-select';

import { StoreFrontRoutingModule } from './store-front-routing.module';
import { OrderComponent } from './order/order.component';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
// import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { FormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ConfirmationScreenComponent } from './confirmation-screen/confirmation-screen.component';



@NgModule({
  declarations: [OrderComponent, ConfirmationScreenComponent],
  imports: [
    CarouselModule,  // Add Owl Carousel module here

    CommonModule,
    // ChipsModule,
    NgSelectModule,
    // GooglePlaceModule,
    StoreFrontRoutingModule,
    SharedDirectivesModule,
    FormsModule,
    MDBBootstrapModule,
    MdbSharedModule,

    MatProgressBarModule,
  ]
})
export class StoreFrontModule { }
