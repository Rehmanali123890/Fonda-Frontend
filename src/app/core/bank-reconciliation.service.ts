
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SecurityService } from './security.service';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BankReconciliationService {
  fileUploadUrl = environment.fileUploadUrl;

  constructor(private http: HttpClient,
    private securityservice: SecurityService
  ) { }

  // Method to upload files
  uploadFile(file: File, fileType: string): Observable<any> {
    let token = this.securityservice.securityObject.token
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('platform', fileType);

    return this.http.post(`${this.fileUploadUrl}platform-bank-reconciliation-upload-files?token=${token}`, formData); // Adjust API endpoint if needed
  }

  // Method to perform reconciliation
  reconcile(start_Date: string, end_Date: string): Observable<any> {
    let token = this.securityservice.securityObject.token
    console.log(`Reconciling from ${start_Date} to ${end_Date}`);
    const url = `${this.fileUploadUrl}platform-bank-reconciliation?start_date=${start_Date}&end_date=${end_Date}&token=${token}`;
    // Send GET request with query parameters
    return this.http.get(url);

  }
}
