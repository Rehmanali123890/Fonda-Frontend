import { UserDto } from 'src/app/Models/user.model';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': environment.apiKey,
    'CorrelationId': (Math.round(+new Date() / 1000)).toString()
  })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }
  GetUsers(token: string, userRole: number = 1, merchantId: string = null, offset: number = 0, limit: number = 1000) {
    if (userRole === 3 || userRole === 4) {
      return this.http.get(this.baseUrl + `users?token=${token}&from=${offset}&limit=${limit}&merchant=${merchantId}`, httpOptions);
    } else {
      return this.http.get(this.baseUrl + `users?token=${token}&from=${offset}&limit=${limit}`, httpOptions);
    }
  }
  GetUser(userId: string, token: string) {
    return this.http.get(this.baseUrl + `user/${userId}?token=${token}`, httpOptions);
  }
  DeleteUser(userId: string, token: string) {
    return this.http.delete(this.baseUrl + `user/${userId}?token=${token}`, httpOptions);
  }
  AddUser(token: string, obj: UserDto) {
    const mData = {
      token: token,
      user: obj,
    }
    return this.http.post(this.baseUrl + `user`, mData, httpOptions);
  }
  UpdateUser(token: string, obj: UserDto) {
    const mData = {
      token: token,
      user: obj,
    }
    return this.http.put(this.baseUrl + `user/${obj.id}`, mData, httpOptions);
  }
}
