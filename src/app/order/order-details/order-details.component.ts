import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { subscribeOn } from 'rxjs/operators';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { OrdersService } from 'src/app/core/orders.service';
import { SecurityService } from 'src/app/core/security.service';
import { TranslocoService } from '@ngneat/transloco';

import {
  OrderCancellationReasons,
  OrderDetailDto,
  OrderRejectionReasons,
  OrdersListDto,
  OrderStatusEnum
} from 'src/app/Models/order.model';
import { UserRoleEnum } from 'src/app/Models/user.model';
import { ItemDetailObject } from "../../Models/item.model";



@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  gettingOrderDetail: boolean;
  gettingPDF: boolean;
  editOrder: boolean = false;
  updatingOrder: boolean = false;
  merchantId: string;
  orderId: string;
  orderDetailObj = new OrderDetailDto();
  userStatusEnum = OrderStatusEnum;
  userRoleType: UserRoleEnum;
  showaddonprices: boolean;
  userStatusEnumList = this.filterDataService.getEnumAsList(OrderStatusEnum);
  orderDetailPdf: any;
  selectedOrderStatus: OrderStatusEnum;
  selectedOrderId: string;
  selectedMerchantId: string;
  updatingStatus: boolean;
  reason: string;
  explaination: string;
  selectedStatusStr = '0,1,2,3,4,6';
  orderCancellationReasons = OrderCancellationReasons;
  orderRejectionReasons = OrderRejectionReasons;
  enumKeyOrderCancellationReasons = [];
  enumKeyOrderRejectionReasons = [];

  constructor(private translocoService: TranslocoService, private toaster: ToastrService, private filterDataService: FilterDataService, private activatedRoute: ActivatedRoute, private securityService: SecurityService, private orderService: OrdersService, private merchantService: MerchantService) {

    this.enumKeyOrderCancellationReasons = Object.keys(this.orderCancellationReasons);
    this.enumKeyOrderRejectionReasons = Object.keys(this.orderRejectionReasons)
  }
  showRefundOptions: boolean = false
  refundAmount: number = 0
  partialRefund: number = 1
  ngOnInit(): void {
    this.userRoleType = this.securityService.securityObject.user.role
    this.GetOrderDetail()
    //this.GetOrderTransactionDetail()
  }
  resetPopupValues() {
    this.reason = '';
    this.explaination = '';
    this.showRefundOptions = false
    this.partialRefund = 1
    this.refundAmount = 0
  }
  calculateTotalItems(items) {
    let total = 0;
    items.forEach(element => {
      total = total + element.quantity
    });
    return total
  }
  GetOrderDetail() {
    this.gettingOrderDetail = true;
    this.showaddonprices = true
    this.orderDetailObj = new OrderDetailDto();
    this.merchantId = this.activatedRoute.snapshot.paramMap.get('merchantId');
    this.orderId = this.activatedRoute.snapshot.paramMap.get('orderId');
    this.orderService.GetOrderDetail(this.securityService.securityObject.token, "", this.orderId, 1).subscribe((data: OrderDetailDto) => {
      if (data) {
        this.orderDetailObj = data;
        if (this.orderDetailObj.orderSource == "grubhub" && this.orderDetailObj.orderMerchant.MarketPlacePriceStatus == 1) {
          this.showaddonprices = false
        }

        if (this.orderDetailObj.orderStatus == 7) {
          this.selectedStatusStr = '5,7'
        }

        let dt = moment(this.orderDetailObj.orderDateTime, 'YYYY-MM-DDTHH:mm:ss').format('MM-DD-YYYY HH:mm:ss')
        this.orderDetailObj.orderDateTime = dt;
        // this.orderDetailObj.orderDateTime = this.orderDetailObj.orderDateTime.replace('T', ' ');
      }
      this.gettingOrderDetail = false;

    }, (err) => {
      this.gettingOrderDetail = false;
      this.toaster.error(err.error.message);
    })
  }
  blob = null
  downloadOrderDetailPdf() {
    this.gettingPDF = true
    this.orderService.orderDetailPdf(this.orderId, this.securityService.securityObject.token, this.orderDetailObj.orderMerchant.id).subscribe((data: any) => {


      this.blob = new Blob([data], { type: 'application/pdf' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = this.orderId;
      link.click();
      this.gettingPDF = false
    }, (err) => {
      this.gettingPDF = false;
      this.toaster.error(err.error.message);
    })
  }
  openOrdeerchangeMOdal(item: OrderDetailDto, modal: ModalDirective) {
    this.selectedOrderStatus = null;
    this.selectedOrderId = item.id;
    this.selectedMerchantId = item.merchantid;
    modal.show();
  }
  updatestatus(modal: ModalDirective) {
    if (this.refundAmount > this.orderDetailObj.orderTotal) {
      this.toaster.error('Partial refund amount can not be greater than total order amount.')
      return
    }
    this.updatingStatus = true;
    this.orderService.updatestatus(this.selectedMerchantId, this.selectedOrderId,
      this.selectedOrderStatus, this.reason, this.explaination, this.partialRefund,
      this.refundAmount, this.orderDetailObj.remarks, this.orderDetailObj.orderSource).subscribe((data: ItemDetailObject) => {
        modal.hide();
        this.GetOrderDetail();
        this.toaster.success('Order status updated successfully ')
        this.updatingStatus = false;
      }, (err) => {
        this.updatingStatus = false;
        this.toaster.error(err.error.message);
      })
  }
  updateOrder() {
    this.updatingOrder = true;
    this.orderService.updateOrder(this.orderId, this.orderDetailObj).subscribe((data: any) => {
      this.updatingOrder = false;
      this.editOrder = false
      this.GetOrderDetail()
    }, (err) => {
      this.updatingOrder = false;
      this.toaster.error(err.error.message);
    })
  }
  addItemsPriceArrayByMultiplyingWithTheirQuantity(array: any[], itemCost: string): number {
    let totalPrice = 0;
    array.map(({ addon }) => addon?.addonOptions.map(({ price, quantity }) => {
      totalPrice += Number(price) * quantity
    }));
    return totalPrice + Number(itemCost);
  }
  multiplyTwoValues(n1: string | number, n2: string | number): number {
    return Number(n1) * Number(n2)
  }
  getStatusTranslation(orderstatus): string {
    // Assuming you have translations for each enum value in your language files
    let status = ''
    this.translocoService.selectTranslate('Orders.' + this.userStatusEnum[orderstatus]).subscribe(translation => {
      status = translation;
    });
    return status
  }
}



