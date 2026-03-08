import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/core/app-state.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { AuditLogsTypes, MerchantListDto } from 'src/app/Models/merchant.model';

@Component({
  selector: 'app-treasury-logs',
  templateUrl: './treasury-logs.component.html',
  styleUrls: ['./treasury-logs.component.scss']
})
export class TreasuryLogsComponent implements OnInit {
  auditLogsList: AuditLogsTypes[];
  userId: string = '';
  userName: string = '';
  merchantId: string = '';
  eventName: string = '';
  startDate: string | Date;
  endDate: string | Date;
  gettingAuditLogsList: boolean;
  filterType = 2;
  MerchantsList: MerchantListDto[] = [];
  gettingMerchants: boolean;

  constructor(
    private merchantService: MerchantService,
    private toaster: ToastrService,
    private appState: AppStateService,
    private activatedRoute: ActivatedRoute,
    private securityService: SecurityService,
  ) { }

  ngOnInit(): void {
    this.startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
    this.endDate = moment().format('YYYY-MM-DD');
    this.auditLogsData();
    // this.GetMerchantsList()
  }

  auditLogsData() {
    this.gettingAuditLogsList = true;
    this.merchantService
      .getTreasuryLogs(this.userId, this.userName, this.activatedRoute.snapshot.queryParams["merchant"], this.eventName, this.startDate, this.endDate)
      .subscribe(
        (data: AuditLogsTypes[]) => {
          this.auditLogsList = data['data'];
          this.gettingAuditLogsList = false
        },
        (err: any) => console.log(err),
        () => console.log(this.auditLogsList)
      );
  }
  // GetMerchantsList() {
  //   this.merchantService
  //     .GetMerchants(this.securityService.securityObject.token)
  //     .subscribe(
  //       (data: MerchantListDto[]) => {
  //         this.MerchantsList = data;
  //         if (this.MerchantsList && this.MerchantsList.length) {
  //           this.auditLogsData();
  //         }
  //       },
  //       (err) => {
  //         this.toaster.error(err.message);
  //       }
  //     );
  // }
  changeDateAccordinglySearch() {
    if (+this.filterType === 1) {
      this.startDate = moment().format('YYYY-MM-DD');
      this.endDate = moment().format('YYYY-MM-DD');
    }
    if (+this.filterType === 2) {
      this.startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
      this.endDate = moment().format('YYYY-MM-DD');
    }
    const sTime = moment(this.startDate);
    const eTime = moment(this.endDate);
    const res = sTime.isAfter(eTime);
    if (res) {
      this.toaster.warning('Start Date should not be greater than End Date');
      return;
    }
    this.auditLogsData();
  }
  // MerchantChanged() {
  //   this.appState.currentMerchant = this.merchantId;
  // }
}
