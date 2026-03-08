import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { ErrorLogComponent } from "./error-log/error-log.component";
import { TreasuryLogsComponent } from './treasury-logs/treasury-logs.component';
import { OrderLogsComponent } from './order-logs/order-logs.component';

const routes: Routes = [
  { path: 'logs', component: ActivityLogComponent },
  { path: 'error-log', component: ErrorLogComponent },
  { path: 'treasury-logs', component: TreasuryLogsComponent },
  { path: 'audit-logs', component: AuditLogsComponent },
  { path: 'order-logs', component: OrderLogsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogsRoutingModule { }
