import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { MatProgressBarModule } from '@angular/material/progress-bar'


const routes: Routes = [
  {path: 'customer', component: CustomerComponent}
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,MatProgressBarModule]
})
export class MyCustomerRoutingModule { }
