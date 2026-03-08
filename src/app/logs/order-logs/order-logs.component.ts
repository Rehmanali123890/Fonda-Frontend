import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/core/app-state.service';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { ActivityLogsTypes, MerchantListDto, OrderLogsTypes } from 'src/app/Models/merchant.model';
import { UserRoleEnum } from 'src/app/Models/user.model';
@UntilDestroy()

@Component({
  selector: 'app-order-logs',
  templateUrl: './order-logs.component.html',
  styleUrls: ['./order-logs.component.scss']
})
export class OrderLogsComponent implements OnInit {
  orderExternalRefrence: string = '9aa09d60'
  gettingActivityList: boolean
  ShowgettingActivityList: boolean
  Shownotfound: boolean = false
  userRoleType: UserRoleEnum;
  orderLogsList: OrderLogsTypes[] = [];
  eventDetail: string = ''
  @ViewChild('basicModal') basicModal: ModalDirective;
  formattedString: string


  constructor(private merchantService: MerchantService, private activatedRoute: ActivatedRoute, private toaster: ToastrService, private appState: AppStateService, private securityService: SecurityService, private filterDataService: FilterDataService) {


  }

  ngOnInit(): void {
    // this.orderExternalRefrence = this.activatedRoute.snapshot.paramMap.get('referenceId');
    this.userRoleType = this.securityService.securityObject.user.role;

  }
  format(value) {
    const textString = value;
    this.formattedString = `<pre>${textString}</pre>`;
  }
  activityDataList() {
    this.Shownotfound = false
    this.gettingActivityList = true
    this.ShowgettingActivityList = true
    this.merchantService.getOrderLogsData(this.orderExternalRefrence).subscribe({
      next: (result) => {
        this.gettingActivityList = false
        this.orderLogsList = result['data'];
        for (let i in this.orderLogsList) {
          const jsonString = this.orderLogsList[i].order_state;
          if (this.orderLogsList[i].order_state != '') {
            const result = this.checkJson(jsonString)
   
            if (result == true) {
              this.formattedString = JSON.stringify(JSON.parse(jsonString), null, 2);
              this.orderLogsList[i].order_state = this.formattedString
            }

          }
        }

        if (this.orderLogsList.length == 0) { this.Shownotfound = true }
      },
      error: (err) => {
        this.gettingActivityList = false
        this.Shownotfound = true
        console.log(err.error.message);
      },
    });
  }
  ShowEventDetails(eventDetail) {
    if (eventDetail != '' && eventDetail != null) {
      this.eventDetail = eventDetail
      this.basicModal.show()
    }
  }

  checkJson(value) {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  }
}
