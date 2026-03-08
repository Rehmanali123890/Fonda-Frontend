import { SecurityService } from './security.service';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import {
} from '../Models/merchant.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': environment.apiKey,
    'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
    Authorization: (localStorage.getItem('securityData') !== null) ? ('Bearer ' + JSON.parse(localStorage.getItem('securityData')).token) : "",
  }),
};
const httpOptionsWithFile = {
  headers: new HttpHeaders({
    // 'Content-Type': 'multipart/form-data',
    'x-api-key': environment.apiKey,
    'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
    Authorization: (localStorage.getItem('securityData') !== null) ? ('Bearer ' + JSON.parse(localStorage.getItem('securityData')).token) : "",
  }),
};

@Injectable({
  providedIn: 'root',
})
export class MerchantTreasuryService {
  baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient,
    private securityService: SecurityService
  ) { }

  getAllTransactions(merchantId) {
    return this.http.get<any>(this.baseUrl + `merchant/${merchantId}/getfinancialaccounttransections`, httpOptions)
  }
  getAccountDetails(merchantId) {
    return this.http.get<any>(this.baseUrl + `merchant/${merchantId}/getfinacialaccountdetails`, httpOptions)
  }
  getStripeBalanceDetail() {
    return this.http.get<any>(this.baseUrl + `merchant/get-stripe-balance`, httpOptions)
  }
  getConnectAccountDetails(merchantId) {
    return this.http.get<any>(this.baseUrl + `merchant/${merchantId}/getstripeconnectaccount`, httpOptions)
  }

  getIssuedCards(merchantId) {
    return this.http.get<any>(this.baseUrl + `merchant/${merchantId}/getissuedcards`, httpOptions)
  }
  addTreasuryFeatures(merchantId) {
    return this.http.post<any>(this.baseUrl + `merchant/${merchantId}/activatetreasury`, {}, httpOptions)
  }

  createFinancialAccount(merchantId) {
    return this.http.post<any>(this.baseUrl + `merchant/${merchantId}/createfinacialaccount`, {}, httpOptions)
  }

  addTrasuaryAuthPhone(merchantId, data) {
    return this.http.post<any>(this.baseUrl + `merchant/${merchantId}/addtrasuaryauthphone`, data, httpOptions)
  }
  requestforPhoneUpdate(merchantId, data) {
    return this.http.post<any>(this.baseUrl + `merchant/${merchantId}/changetrasuaryauthphone`, data, httpOptions)
  }
  validteTrasuaryAuthPhone(merchantId, data) {
    return this.http.post<any>(this.baseUrl + `merchant/${merchantId}/validatetrasuaryauthphone`, data, httpOptions)
  }
  sendTrasuaryAuthOtp(merchantId) {
    return this.http.post<any>(this.baseUrl + `merchant/${merchantId}/sendtrasuaryauthotp`, {}, httpOptions)
  }
  updateTrasuaryuAthPhone(merchantId, data) {
    return this.http.post<any>(this.baseUrl + `merchant/${merchantId}/updatetrasuaryauthphone`, data, httpOptions)
  }
  sendMoneyApi(merchantId, data) {
    return this.http.post<any>(this.baseUrl + `merchant/${merchantId}/fundstransfertoexternalbankaccount`, data, httpOptions)
  }
  sendMoneyApi_ToRecipient(merchantId, data) {

    return this.http.post<any>(this.baseUrl + `merchant/${merchantId}/transferfundstorecipient`, data, httpOptions)
  }
  AddRecipientsApi(merchantId, data) {

    return this.http.post<any>(this.baseUrl + `merchant/${merchantId}/addrecipient`, data, httpOptions)
  }
  ManageRecipientsApi(merchantId) {

    return this.http.get<any>(this.baseUrl + `merchant/${merchantId}/getrecipients`, httpOptions)
  }
  remove_RecipientsApi(merchantId, data) {

    return this.http.post<any>(this.baseUrl + `merchant/${merchantId}/deleterecipient`, data, httpOptions)
  }





}
