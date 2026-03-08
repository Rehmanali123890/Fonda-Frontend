import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomerDto } from '../Models/customer.model';

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
export class CustomerService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }
  GetCustomers(token: string, merchantId: string) {
    return this.http.get(this.baseUrl + `customers?limit=500&token=${token}&merchant=${merchantId}`, httpOptions);
  }
  DeleteCustomer(customerId: string, token: string) {
    return this.http.delete(this.baseUrl + `customer/${customerId}?token=${token}`, httpOptions);
  }
  AddCustomer(token: string, obj: CustomerDto) {
    const mData = {
      token: token,
      customer: obj,
    }
    return this.http.post(this.baseUrl + `customer`, mData, httpOptions);
  }
  UpdateCustomer(token: string, obj: CustomerDto) {
    const mData = {
      token: token,
      customer: obj,
    }
    return this.http.put(this.baseUrl + `customer/${obj.id}`, mData, httpOptions);
  }

}
