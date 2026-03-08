import { SharedDirectivesModule } from './../shared-directives/shared-directives.module';
import { MdbSharedModule } from './../mdb-shared/mdb-shared.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { ChipsModule } from 'ng-uikit-pro-standard';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderRoutingModule } from './order-routing.module';
import { OrdersListComponent } from './orders-list/orders-list.component';

import { OrderDetailsComponent } from './order-details/order-details.component';
import { TranslocoModule } from '@ngneat/transloco';
import { HttpClientModule } from '@angular/common/http';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressBarModule} from '@angular/material/progress-bar'

@NgModule({
  declarations: [OrdersListComponent, OrderDetailsComponent],
  imports: [
    FormsModule,
    MdbSharedModule,
    SharedDirectivesModule,
    NgSelectModule,
    MatChipsModule,
    MatProgressBarModule,
    // ChipsModule,
    CommonModule,
    OrderRoutingModule,
    TranslocoModule,
    HttpClientModule
  ]
})
export class OrderModule { }
