import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankReconciliationComponent } from './bank-reconciliation/bank-reconciliation.component';

const routes: Routes = [
  { path: '', redirectTo: 'accounts', pathMatch: 'full' },
  { path: 'home', canActivate: [AuthGuard], loadChildren: () => import('./public/public.module').then(m => m.PublicModule) },
  { path: 'accounts', canActivate: [LoginGuard], loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule) },
  { path: 'onBoarding', loadChildren: () => import('./on-boarding/on-boarding.module').then(m => m.OnBoardingModule) },
  { path: 'storeOrder', loadChildren: () => import('./store-front/store-front.module').then(m => m.StoreFrontModule) },
  { path: '**', loadChildren: () => import('./store-front/store-front.module').then(m => m.StoreFrontModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
