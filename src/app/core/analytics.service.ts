import { SecurityService } from '../core/security.service';
import { SecurityObjDto } from './../Models/security.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CustomerDto } from '../Models/customer.model';

var httpOptions = {}
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  baseUrl = environment.baseUrl;
  _securityObjDto = new SecurityObjDto();
  constructor(private http: HttpClient, private securityService: SecurityService) {
    this.securityService.getToken().subscribe(securityObject => {
      this._securityObjDto = securityObject;
      this.initializeHeader(securityObject)
      console.log("subscribe the  securityObject in constructor.")
    });
    this._securityObjDto = this.securityService.securityObject;
  }
  initializeHeader(securityObject) {
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': environment.apiKey,
        // 'CorrelationId': 'sasasa',
        'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
        Authorization: securityObject.token ? `Bearer ${securityObject.token}` : 'Bearer ' + JSON.parse(localStorage.getItem('securityData')).token
      })
    };
  }
  getMerchantReport(merchantId: string, startDate: string | Date, endDate: string | Date) {
    console.log("httpOptions is ", httpOptions)
    return this.http.get(this.baseUrl + `analytics/getMerchantReport?token=${this._securityObjDto.token}&merchantId=${merchantId}&startDate=${startDate}&endDate=${endDate}`, httpOptions);
  }
  getMerchantRevenueReport(merchantId: string, startDate: string | Date, endDate: string | Date) {
    console.log("httpOptions is ", httpOptions)
    return this.http.get(this.baseUrl + `finance/revenue-report?token=${this._securityObjDto.token}&merchantId=${merchantId}&startDate=${startDate}&endDate=${endDate}`, httpOptions);
  }
  getMerchantProductsOverview(merchantId: string, startDate: string | Date, endDate: string | Date) {
    return this.http.get(this.baseUrl + `analytics/merchantProductsOverview?token=${this._securityObjDto.token}&merchantId=${merchantId}&startDate=${startDate}&endDate=${endDate}`, httpOptions);
  }

  getMerchantRevenueByPlatfrom(merchantId: string, startDate: string | Date, endDate: string | Date) {
    return this.http.get(this.baseUrl + `analytics/getDashboardReport?token=${this._securityObjDto.token}&merchantId=${merchantId}&startDate=${startDate}&endDate=${endDate}`, httpOptions);
  }
  getDownTime(merchantId: string, startDate: string | Date, endDate: string | Date) {
    return this.http.get(this.baseUrl + `merchant/${merchantId}/analytics/down-time?startDate=${startDate}&endDate=${endDate}`, httpOptions);
  }
  getFinancialAnalyticsOfVR(merchantId: string, startDate: string | Date, endDate: string | Date) {
    return this.http.get(this.baseUrl + `merchant/${merchantId}/analytics/virtual-merchant-report?startDate=${startDate}&endDate=${endDate}`, httpOptions)
  }
}
