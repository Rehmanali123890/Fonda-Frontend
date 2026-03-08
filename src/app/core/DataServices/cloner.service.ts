import { Injectable } from '@angular/core';
import * as clone from 'clone';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MerchantListDto } from 'src/app/Models/merchant.model';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
    'x-api-key': environment.apiKey,
  }),
};

@Injectable({
  providedIn: 'root'
})
export class ClonerService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  deepClone<T>(value): T {
    return clone<T>(value);
  }

  saveMerchantOnBoardingInfo(token: string, obj: MerchantListDto) {
    const mData = {
      merchant: obj,
    };
    return this.http.post(this.baseUrl + `onboardmerchant?token=${token}`, mData, httpOptions);
  }

  completePaymentStripe(chargeId: string, merchantId: string) {
    const mData = {
      chargeId: chargeId,
    };
    return this.http.post(this.baseUrl + `merchant/${merchantId}/completePayment`, mData, httpOptions);
  }
  getCardToken() {
    return this.http.get(
      this.baseUrl + `merchant/stripeToken`,
      httpOptions
    );
  }

}
