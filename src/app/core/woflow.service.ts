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

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': environment.apiKey,
    'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('securityData')).token,
  }),
};
const httpOptionsWithFile = {
  headers: new HttpHeaders({
    // 'Content-Type': 'multipart/form-data',
    'x-api-key': environment.apiKey,
    'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('securityData')).token,
  }),
};
@Injectable({
  providedIn: 'root'
})
export class WoflowService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient, private appState: AppStateService,
    private securityService: SecurityService) { }


  uploadMenu(generatePresigendUrls: boolean, files: string[]) {
    return this.http.post(
      this.baseUrl + `woflow/upload-menu`,
      {
        "merchantId": this.appState.currentMerchant,
        "generatePresigendUrls": generatePresigendUrls,
        "files": files
      },
      httpOptions
    );
  }
  uploadFilesToAWS(baseUrl: string, data: any, file: any) {
    let formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    formData.append("file", file)
    // formData = data
    return this.http.post<any>(baseUrl, formData, {

    });
  }
  getAllJobs() {
    return this.http.get(
      this.baseUrl + `woflow/get-records?merchantId=${this.appState.currentMerchant}`,
      httpOptions
    );
  }
  refereshJob(woflowColumnId: string) {
    return this.http.get(
      this.baseUrl + `woflow/refresh-job?woflowColumnId=${woflowColumnId}`,
      httpOptions
    );
  }
  PostMenu(woflowColumnId: string, processingType: string, instructions: string) {
    return this.http.post(
      this.baseUrl + `woflow/process-menu`,
      {
        "merchantId": this.appState.currentMerchant,
        "woflowColumnId": woflowColumnId,
        "processingType": processingType,
        "instructions": instructions,
      },
      httpOptions
    );
  }
  getPDFOfMenu(menuId: string) {
    const httpOptionsFile = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': environment.apiKey,
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('securityData')).token,
      })
    };
    return this.http.get(
      this.baseUrl + `woflow/${menuId}/download-menu`,
      httpOptionsFile
    );
  }
  aceptRejectMenu(woflowColumnId: string, operation: string, reason: string) {
    return this.http.post(
      this.baseUrl + `woflow/update-job-status`,
      {
        "woflowColumnId": woflowColumnId,
        "operation": operation,
        "reason": reason
      },
      httpOptions
    );
  }
}
