import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentDownloadService {

  constructor(private http: HttpClient) { }

  downloadDocument(docUrl: string, docName: string): void {
    this.http.get(docUrl, { responseType: 'blob' }).subscribe(blob => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = docName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(downloadLink);
    });
  }
}
