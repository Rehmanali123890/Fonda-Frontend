
import { Injectable } from '@angular/core';
import { SecurityService } from './security.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from './../../environments/environment';

import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AppStateService } from './app-state.service';
import { createSubjectOnTheInstance } from '@ngneat/until-destroy/lib/internals';

var httpOptions = {}

@Injectable({
  providedIn: 'root'
})
export class GoogleMyBusinessService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient, private appState: AppStateService,
    private securityService: SecurityService) {
    this.securityService.getToken().subscribe(securityObject => {
      this.initializeHeader(securityObject)
      console.log("subscribe the  securityObject in constructor")
    });
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
  ConnectGMB(token: string, payload: any) {
    return this.http.post(
      this.baseUrl + `platform/connect_google?token=${token}`,
      payload,
      httpOptions
    );
  }
  linkLocation(token: string, payload: any) {
    return this.http.post(
      this.baseUrl + `platform/link_location?token=${token}`,
      payload,
      httpOptions
    );
  }
  unLinkLocation(token: string, payload: any) {
    return this.http.post(
      this.baseUrl + `platform/unlink_location?token=${token}`,
      payload,
      httpOptions
    );
  }
  syncMenu(token: string, payload: any, merchantId: string) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/uploadMenuToGoogle?token=${token}`,
      payload,
      httpOptions
    );
  }
  syncProfile(token: string, payload: any) {
    return this.http.post(
      this.baseUrl + `platform/sync_google_profile?token=${token}`,
      payload,
      httpOptions
    );
  }
  loadReviews(payload: any) {
    return this.http.post(
      this.baseUrl + `platform/get_reviews`,
      payload,
      httpOptions
    );
  }
  sendCommentReply(payload: any) {
    return this.http.post(
      this.baseUrl + `platform/reply_review`,
      payload,
      httpOptions
    );
  }

  getLocationByMerchantId(token: string, merchantId?) {
    console.log("merchantid is in gmb service ", merchantId)
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/location?token=${token}`,
      httpOptions
    );
  }
  getMenuById(token: string, payload: any) {
    return this.http.post(
      this.baseUrl + `platform/get_menu?token=${token}`,
      payload,
      httpOptions
    );
  }
  uploadMedia(token: string, fileToUpload: File, media_data: any) {
    let formData = new FormData();
    formData.append('photo', fileToUpload, fileToUpload.name);
    formData.append('media_data', JSON.stringify(media_data));
    return this.http.post(
      this.baseUrl + `platform/upload-media?token=${token}`,
      formData,
      {
        headers: new HttpHeaders({
          'x-api-key': environment.apiKey,
        }),
      }
    );
  }
  delMediaById(token: string, payload: any) {
    return this.http.post(
      this.baseUrl + `platform/delete-media?token=${token}`,
      payload,
      httpOptions
    );
  }
  updatePlaceActionLink(token: string, payload: any) {
    return this.http.patch(
      this.baseUrl + `platform/update_order_placer?token=${token}`,
      payload,
      httpOptions
    );
  }
  getMedia(token: string, payload: any) {
    return this.http.post(
      this.baseUrl + `platform/get_all_media?token=${token}`,
      payload,
      httpOptions
    );
  }
  getOrderPlaceLink(token: string, payload: any) {
    return this.http.post(
      this.baseUrl + `platform/get_order_placer?token=${token}`,
      payload,
      httpOptions
    );
  }
  syncMenuToGmb(token: string, payload: any) {
    return this.http.post(
      this.baseUrl + `platform/upload-menu?token=${token}`,
      payload,
      httpOptions
    );
  }
  syncMenuHoursToGmb(token: string, payload: any) {
    return this.http.patch(
      this.baseUrl + `platform/menu_hour?token=${token}`,
      payload,
      httpOptions
    );
  }
  syncOpeningHoursToGmb(token: string, payload: any) {
    return this.http.patch(
      this.baseUrl + `platform/sync_business_hour?token=${token}`,
      payload,
      httpOptions
    );
  }
  syncBusinessProfileToGmb(token: string, payload: any) {
    return this.http.post(
      this.baseUrl + `platform/sync_google_profile?token=${token}`,
      payload,
      httpOptions
    );
  }
  createLocation(merchantId: string) {
    return this.http.get(this.baseUrl + `platform/${merchantId}/create_google_location`, httpOptions)
  }

}
