import { SecurityService } from 'src/app/core/security.service';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateOrderDto, OrderDetailDto, OrderStatusEnum } from '../Models/order.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
    'x-api-key': environment.apiKey
  })
};

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient, private securityService: SecurityService) { }
  GetOrders(token: string, merchantId: string, status: string) {
    return this.http.get(this.baseUrl + `orders?token=${token}&merchantID=${merchantId}&status=${status}`, httpOptions);
  }
  GetAllMerchantOrders(token: string, filterMRIds: string[], status: string,
    searchExternalReferenceNumber: string, searchOrderId: string, searchSource: string, searchcustomerName: string) {
    const obj = {
      token: token
    };
    let searchString = "";
    if (filterMRIds && filterMRIds.length && !filterMRIds.find(x => x === '-1')) {
      obj['merchants'] = filterMRIds;
    }
    if (searchExternalReferenceNumber !== "") {
      searchString = searchString + `&orderExternalReference=${searchExternalReferenceNumber}`
    }
    if (searchOrderId !== "") {
      searchString = searchString + `&shortOrderId=${searchOrderId}`

    }
    if (searchSource !== "" && searchSource !== null) {
      searchString = searchString + `&orderSource=${searchSource}`


    }
    if (searchcustomerName !== "") {
      searchString = searchString + `&customerName=${searchcustomerName}`

    }
    if (searchString.length > 0) {
      return this.http.post(this.baseUrl + `orders?limit=1000${searchString}`, obj, httpOptions);

    } else {
      return this.http.post(this.baseUrl + `orders?status=${status}&limit=1000${searchString}`, obj, httpOptions);

    }

  }
  CreateNewOrder(dObj: CreateOrderDto) {
    const pObj = {
      token: this.securityService.securityObject.token,
      order: dObj
    }
    return this.http.post(this.baseUrl + `order`, pObj, httpOptions);
  }
  updatestatus(merchantId: string, orderId: string, orderStatus: OrderStatusEnum, reason: string, explaination: string, partialRefund: any, amount: any, remarks: any, orderType: any) {
    const pObj = {
      "token": this.securityService.securityObject.token,
      "merchantID": merchantId,
      "partialRefund": partialRefund,
      "amount": amount,
      "remarks": remarks,
      "orderType": orderType,
      "update": {
        "orderStatus": orderStatus,
        "reason": reason,
        "explanation": explaination
      }
    };
    return this.http.put(this.baseUrl + `order/${orderId}/updatestatus`, pObj, httpOptions);
  }
  GetOrderDetail(token: string, merchantId: string, orderID: string, historical: any) {
    return this.http.get(this.baseUrl + `order/${orderID}?token=${token}&merchantID=${merchantId}&historical=${historical}`, httpOptions);
  }
  updateOrder(orderId: string, order: OrderDetailDto) {

    return this.http.put(this.baseUrl + `order/${orderId}/edit`, order, httpOptions);
  }

  orderDetailPdf(orderID: string, token: string, merchantId: string) {
    const httpOptionsFile = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': environment.apiKey
      })
    };
    return this.http.get(`${this.baseUrl}` + `orderpdf/${orderID}?token=${token}&merchantID=${merchantId}`, httpOptionsFile);

  }

  importToastOrders(merchantId: string, obj: any) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/importToastOrders`,
      obj,
      httpOptions
    );
  }
  
  customerFedbackMailChimp(feedbackObj: any) {
    return this.http.post(
      this.baseUrl + `webhook-storefront-zapier`,
      feedbackObj,
      httpOptions
    );
  }

  importTransactionCSV(token: string, fileToUpload: File, terms_data: any) {
    let formData = new FormData();
    formData.append('document', fileToUpload, fileToUpload.name);
    formData.append('terms_data', JSON.stringify(terms_data));
    return this.http.post(
      this.baseUrl + `transaction-csv?token=${token}`,
      formData,
      {
        headers: new HttpHeaders({
          'x-api-key': environment.apiKey,
        }),
      }
    );
  }
}
