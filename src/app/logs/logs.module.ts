import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogsRoutingModule } from './logs-routing.module';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { ErrorLogComponent } from './error-log/error-log.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TreasuryLogsComponent } from './treasury-logs/treasury-logs.component';
import { OrderLogsComponent } from './order-logs/order-logs.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {MatProgressBarModule} from '@angular/material/progress-bar'



@NgModule({
  declarations: [ActivityLogComponent, ErrorLogComponent, AuditLogsComponent, TreasuryLogsComponent, OrderLogsComponent],
  imports: [
    CommonModule,
    LogsRoutingModule,
    FormsModule,
    NgSelectModule,
    MdbSharedModule,
    InfiniteScrollModule,
    MDBBootstrapModule,
    MatProgressBarModule
  ]
})
export class LogsModule { }
