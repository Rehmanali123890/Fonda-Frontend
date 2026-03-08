import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/core/app-state.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { Router } from '@angular/router';
import { AuditLogsTypes, MerchantListDto } from 'src/app/Models/merchant.model';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss'],
})
export class AuditLogsComponent implements OnInit {
  auditLogsList: AuditLogsTypes[];
  userId: string = '';
  userName: string = '';
  merchantId: string = '';
  eventName: string = '';
  newPayoutData: any;
  payoutType: string = '';
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
    private securityService: SecurityService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
    this.endDate = moment().format('YYYY-MM-DD');
    this.auditLogsData();
    this.GetMerchantsList()
  }
  expandtable: { expandtable: boolean, idx: number }[] = [];
  onChangeExpandtable(idx) {
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }
  auditLogsData() {
    console.log('Username---->',this.userName)
    console.log('Userid---->',this.userId)
    console.log('Merchantid---->',this.merchantId)
    console.log('EventName---->',this.eventName)
    this.gettingAuditLogsList = true;
    this.merchantService
      .getAuditLogs(this.userId, this.userName, this.merchantId, this.eventName, this.startDate, this.endDate)
      .subscribe(
        (data: AuditLogsTypes[]) => {
          this.auditLogsList = data['data'];
          console.log('Audit log list ------->',this.auditLogsList)
          this.gettingAuditLogsList = false
          // for mobile view
          this.expandtable = new Array(this.auditLogsList.length).fill({ expandtable: false, idx: 0 });
          this.expandtable = this.expandtable.map((item, idx) => {
            return {
              ...item,
              idx: idx
            }
          })

        },
        (err: any) => console.log(err),
        () => console.log(this.auditLogsList)
      );
  }
  GetMerchantsList() {
    this.merchantService
      .GetMerchants(this.securityService.securityObject.token)
      .subscribe(
        (data: MerchantListDto[]) => {
          this.MerchantsList = data;
          if (this.MerchantsList && this.MerchantsList.length) {
            this.auditLogsData();
          }
        },
        (err) => {
          this.toaster.error(err.message);
        }
      );
  }
  getPayoutDetail(merchantid, payoutid, startDate, endDate) {
    console.log('merchantid ---->', merchantid);
    console.log('payoutid ---->', payoutid);
    
    this.merchantService.GetPayoutType(payoutid, merchantid).subscribe((data: any) => {
        console.log(data);
        
        if (data['data'] === 'Oldpayout') {
            this.router.navigate([`/home/merchants/transfer-details/${payoutid}`]);
        } 
        else if (data['data'] === 'Newpayout') {
            this.merchantService.GetNewPayout(payoutid, merchantid).subscribe((newData: any) => {
                this.newPayoutData = newData['data'];
                console.log('new payout data --->', this.newPayoutData);
                const startDate = new Date(this.newPayoutData['startdate']);
                const endDate = new Date(this.newPayoutData['enddate']);
                console.log('Start Date->',startDate)
                console.log('End Date->',endDate)
                const formattedStartDate = startDate.toISOString().split('T')[0];
                const formattedEndDate = endDate.toISOString().split('T')[0];
                console.log('formattedStartDate Date->',formattedStartDate)
                console.log('formattedEndDate Date->',formattedEndDate)
                
                if (newData['data']) {
                    this.router.navigate([
                        `/home/merchants/new-transfer-details/${payoutid}`
                    ], {
                        queryParams: {
                            startdate: formattedStartDate,
                            enddate: formattedEndDate,
                            payout_merchantid: this.newPayoutData['merchantid']
                            // referrer: 'newpayout'
                        }
                    });
                }
            }, (err) => {
                this.toaster.error(err.message);
            });
        }
    }, (err) => {
        this.toaster.error(err.message);
    });
  }

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
  MerchantChanged() {
    this.appState.currentMerchant = this.merchantId;
  }
}
