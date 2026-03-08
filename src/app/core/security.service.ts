import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginDto, SecurityObjDto } from '../Models/security.model';
import { tap, map, filter, retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppStateService } from 'src/app/core/app-state.service';
import { AuthService } from '@auth0/auth0-angular';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': environment.apiKey,
    'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
  })
};

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  baseUrl = environment.baseUrl;
  securityObject = new SecurityObjDto();
  private tokenSubject = new BehaviorSubject<SecurityObjDto>(this.securityObject);
  constructor(public auth: AuthService, private appState: AppStateService, private http: HttpClient, private router: Router) { }
  Login(pData: LoginDto, redirect_uri?, is_stream?) {
    return this.http.post(this.baseUrl + `user/login?redirect_uri=${redirect_uri}&is_stream=${is_stream}`, pData, httpOptions).pipe(tap((res: SecurityObjDto) => {
      Object.assign(this.securityObject, res);
      this.updateToken(res);
      this.tokenSubject.next(this.securityObject);
      this.appState.currentMerchant = res.merchantid

    }));
  }
  getToken(): Observable<SecurityObjDto> {
    return this.tokenSubject.asObservable();
  }
  ResetPassword(pData: any) {
    return this.http.post(this.baseUrl + `user/reset-password`, pData, httpOptions)
  }
  SendForgetPasswordLink(pData: any) {
    return this.http.post(this.baseUrl + `user/forgot-password`, pData, httpOptions)
  }
  updateToken(data: SecurityObjDto) {
    this.resetSecurityObject();
    Object.assign(this.securityObject, data);
    // Store into local storage
    localStorage.setItem('securityData', JSON.stringify(this.securityObject));
  }
  resetSecurityObject(): void {
    this.securityObject = new SecurityObjDto();
    localStorage.removeItem('currentMerchant');
    localStorage.removeItem('securityData');
  }
  LogOut(withSSO?) {
    this.resetSecurityObject();
    if (!withSSO) {
      this.router.navigateByUrl('/accounts/login');
    }
  }
  isLoggedIn(): boolean {

    if (this.securityObject && this.securityObject.token) {
      return true;
    } else {
      return false;
    }
  }

}
