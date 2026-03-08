import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/core/app-state.service';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { ErrorLogsTypes, MerchantListDto } from 'src/app/Models/merchant.model';
import { UserRoleEnum } from 'src/app/Models/user.model';


@UntilDestroy()
@Component({
  selector: 'app-error-log',
  templateUrl: './error-log.component.html',
  styleUrls: ['./error-log.component.scss']
})

export class ErrorLogComponent implements OnInit {
  userName: string = '';
  merchantId: string;
  merchantName: string;
  errorStatus: string;
  errorSource: string = '';
  errorName: string;
  errorDetails: string;
  errorDatetime: string;
  userRoleType: UserRoleEnum;
  gettingErrorList: boolean;
  errorLogsList: ErrorLogsTypes[] = [];
  eventName: string = '';
  startDate: string | Date;
  endDate: string | Date;
  MerchantsList: MerchantListDto[] = [];
  filterType = 2;
  gettingMerchants: boolean;
  busyLoadingData = false;
  constructor(private merchantService: MerchantService, private toaster: ToastrService, private appState: AppStateService, private securityService: SecurityService, private filterDataService: FilterDataService) { }

  ngOnInit(): void {
    this.userRoleType = this.securityService.securityObject.user.role;
    this.startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
    this.endDate = moment().format('YYYY-MM-DD');
    // this.errorDataList();
    this.subscribeAppState();
    this.GetMerchantsList();
  }

  onScroll(): void {

    if (this.busyLoadingData) return;
    this.busyLoadingData = true;

    this.merchantService.getErrorLogsData(this.merchantId, this.userName, this.errorSource, this.startDate, this.endDate, this.errorLogsList.length).subscribe(

      (result) => {
        this.busyLoadingData = false;
        this.errorLogsList.push(...result['data']);

        if (result['data'].length === 0) {
          // No more results
          this.busyLoadingData = true;

          this.toaster.warning('No more results.');
        }
      },
      (err) => {
        this.busyLoadingData = false;
        console.log(err.error.message);
      }
    );
  }
  expandtable: { expandtable: boolean, idx: number }[] = [];
  onChangeExpandtable(idx) {
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }
  errorDataList() {
    this.gettingErrorList = true;
    this.merchantService.getErrorLogsData(this.merchantId, this.userName, this.errorSource, this.startDate, this.endDate, 0).subscribe({
      next: (result) => {
        this.gettingErrorList = false;
        this.errorLogsList = result['data'];
        console.log(this.errorLogsList);
        // for mobile view
        this.expandtable = new Array(this.errorLogsList.length).fill({ expandtable: false, idx: 0 });
        this.expandtable = this.expandtable.map((item, idx) => {
          return {
            ...item,
            idx: idx
          }
        })

      },
      error: (err) => {
        this.gettingErrorList = false
        console.log(err.error.message);
      },
    });
  }
  subscribeAppState() {
    this.merchantId = '';

    this.appState.merchantChangedSubject
      .pipe(untilDestroyed(this))
      .subscribe((merchantId) => {
        this.merchantId = merchantId;
      });
    // this.errorDataList();
  }
  GetMerchantsList() {
    this.merchantService
      .GetMerchants(this.securityService.securityObject.token)
      .subscribe(
        (data: MerchantListDto[]) => {
          this.MerchantsList = data;
          if (this.MerchantsList && this.MerchantsList.length) {
            this.errorDataList();
          }
        },
        (err) => {
          this.toaster.error(err.message);
        }
      );
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
    this.errorDataList()
  }
  MerchantChanged() {
    this.appState.currentMerchant = this.merchantId;
  }
}

