import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductssListComponent } from './productss-list/productss-list.component';

const routes: Routes = [
  { path: 'productsList', component: ProductssListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
