import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService } from 'src/app/core/app-state.service';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import {
  MerchantListDto,
  TorderTransaction,
} from 'src/app/Models/merchant.model';
import { OrderStatusEnum } from 'src/app/Models/order.model';
import { UserRoleEnum } from 'src/app/Models/user.model';
@UntilDestroy()
@Component({
  selector: 'app-order-transaction-report',
  templateUrl: './order-transaction-report.component.html',
  styleUrls: ['./order-transaction-report.component.scss'],
})
export class OrderTransactionReportComponent implements OnInit {
  merchantId: string;
  startDate: string | Date;
  endDate: string | Date;
  filterType = 2;
  searchOrderId: string = '';
  searchCustomerName: string = '';
  searchSource: string = '';
  searchExternalReferenceNumber: string = '';
  disabledStartDateDiv: boolean = false
  email: any = JSON.parse(localStorage.getItem('securityData')).user.email;
  userStatusEnumList = this.filterDataService.getEnumAsList(OrderStatusEnum);
  MerchantsList: MerchantListDto[] = [];
  transactionDataList: TorderTransaction[];
  gettingTransactionList: boolean;
  gettingMerchants: boolean;
  userRoleType: UserRoleEnum;
  selecetedTab: number = 1

  constructor(
    private merchantService: MerchantService,
    private toaster: ToastrService,
    private appState: AppStateService,
    private securityService: SecurityService,
    private filterDataService: FilterDataService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (parseInt(this.activatedRoute.snapshot.queryParams['selectedTab'], 10) === 2) {
      this.selecetedTab = 2;
    }
    this.userRoleType = this.securityService.securityObject.user.role;
    console.log("Selected tab ---->",this.selecetedTab)

    this.startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
    this.endDate = moment().format('YYYY-MM-DD');
    // this.orderTransactionList();
    this.subscribeAppState();
    this.GetMerchantsList();
  }
  subscribeAppState() {
    this.merchantId = this.appState.currentMerchant;

    this.appState.merchantChangedSubject
      .pipe(untilDestroyed(this))
      .subscribe((merchantId) => {
        this.merchantId = merchantId;
      });
    this.orderTransactionList();
  }
  orderTransactionList() {
    this.gettingTransactionList = true;
    this.merchantService
      .getOrderTransactionData(
        this.merchantId,
        this.startDate,
        this.endDate,
        this.searchCustomerName,
        this.searchOrderId,
        this.searchSource,
        this.searchExternalReferenceNumber,
        0,
        this.email
      )
      .subscribe(
        (result) => {
          this.transactionDataList = result['data'];
          console.log("Transaction report data --->",this.transactionDataList)
          this.gettingTransactionList = false;
        },
        (err) => {
          this.gettingTransactionList = false;
          this.toaster.error(err.error.message);
        }
      );
  }
  downloadTransactionReport() {
    this.merchantService
      .getOrderTransactionData(
        this.merchantId,
        this.startDate,
        this.endDate,
        this.searchCustomerName,
        this.searchOrderId,
        this.searchSource,
        this.searchExternalReferenceNumber,
        1,
        this.email
      )
      .subscribe(
        (result) => {
          this.transactionDataList = result['data'];
          this.toaster.success('Yow will receive the email shortly');
        },
        (error) => console.log('something went wrong', error)
      );
  }
  GetMerchantsList() {
    this.gettingMerchants = true;
    this.merchantService
      .GetMerchants(this.securityService.securityObject.token)
      .subscribe(
        (data: MerchantListDto[]) => {
          this.MerchantsList = data;
          if (this.MerchantsList && this.MerchantsList.length) {
            // this.merchantId = this.MerchantsList[0].id;
            this.orderTransactionList();
          }
          this.gettingMerchants = false;
        },
        (err) => {
          this.toaster.error(err.message);
          this.gettingMerchants = false;
        }
      );
  }
  disableSDateRange() {
    this.disabledStartDateDiv = true
  }
  enableSDateRange() {
    this.disabledStartDateDiv = false
  }

  changeDateAccordinglySearch() {
    if (+this.filterType === 1) {
      this.startDate = moment().format('YYYY-MM-DD');
      this.endDate = moment().format('YYYY-MM-DD');
      this.enableSDateRange()
    }
    if (+this.filterType === 2) {
      this.startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
      this.endDate = moment().format('YYYY-MM-DD');
      this.enableSDateRange()
    }
    if (+this.filterType === 3) {
      this.startDate = moment()
        .startOf('week')
        .subtract(1, 'days')
        .startOf('week')
        .add(1, 'day')
        .format('YYYY-MM-DD');
      this.endDate = moment().startOf('week').format('YYYY-MM-DD');
      this.enableSDateRange()
    }
    if (+this.filterType === 4) {
      this.startDate = moment()
        .startOf('month')
        .subtract(1, 'days')
        .startOf('month')
        .format('YYYY-MM-DD');
      this.endDate = moment()
        .startOf('month')
        .subtract(1, 'days')
        .format('YYYY-MM-DD');
      this.enableSDateRange()
    }
    if (+this.filterType === 5) {
      this.startDate = moment()
        .startOf('year')
        .subtract(1, 'year')
        .startOf('year')
        .add(0, 'day')
        .format('YYYY-MM-DD');
      this.endDate = moment().format('YYYY-MM-DD');
      this.disableSDateRange()

    }
    if (+this.filterType === 6) {
      this.enableSDateRange()

    }
    const sTime = moment(this.startDate);
    const eTime = moment(this.endDate);
    const res = sTime.isAfter(eTime);
    if (res) {
      this.toaster.warning('Start Date should not be greater than End Date');
      return;
    }
    this.orderTransactionList();
    // this.subscribeAppState();

  }
  MerchantChanged() {
    this.appState.currentMerchant = this.merchantId;
  }
}
