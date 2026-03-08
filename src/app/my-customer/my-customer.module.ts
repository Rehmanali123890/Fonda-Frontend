import { SharedPipesModule } from './../shared-pipes/shared-pipes.module';
import { SharedDirectivesModule } from './../shared-directives/shared-directives.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbSharedModule } from './../mdb-shared/mdb-shared.module';

import { MyCustomerRoutingModule } from './my-customer-routing.module';
import { CustomerComponent } from './customer/customer.component';


@NgModule({
  declarations: [
    CustomerComponent
  ],
  imports: [
    CommonModule,
    MyCustomerRoutingModule,
    MdbSharedModule,
    SharedDirectivesModule,
    SharedPipesModule,
    FormsModule,
  
  ]
})
export class MyCustomerModule { }

