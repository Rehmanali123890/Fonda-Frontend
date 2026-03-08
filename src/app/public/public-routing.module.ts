// import { MerchantModule } from './../merchant/merchant.module';
// import { OrderModule } from './../order/order.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  {
    path: '', component: MainLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', loadChildren: () => import('../user/user.module').then(m => m.UserModule) },
      { path: 'orders', loadChildren: () => import('../order/order.module').then(m => m.OrderModule) },
      { path: 'merchants', loadChildren: () => import('../merchant/merchant.module').then(m => m.MerchantModule) },
      { path: 'products', loadChildren: () => import('../products/products.module').then(m => m.ProductsModule) },
      { path: 'customers', loadChildren: () => import('../my-customer/my-customer.module').then(m => m.MyCustomerModule) },
      { path: 'profile', loadChildren: () => import('../my-profile/my-profile.module').then(m => m.MyProfileModule) },
      { path: 'logs', loadChildren: () => import('../logs/logs.module').then(m => m.LogsModule) },

      // leazyloading for new menu
      { path: 'menus', loadChildren: () => import('../menu-v2/menu-v2.module').then(m => m.MenuV2Module) }
    ]
  },
  { path: 'notFound', component: ErrorComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
