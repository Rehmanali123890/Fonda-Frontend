import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { AppStateService } from 'src/app/core/app-state.service';
import { DocumentDownloadService } from 'src/app/core/download-document.service';
import { SecurityService } from 'src/app/core/security.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { ToastrService } from 'ngx-toastr';
import { TCDocsTypes } from 'src/app/Models/merchant.model';
import { MerchantListDto } from 'src/app/Models/merchant.model';
import { environment } from 'src/environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-term-and-condition',
  templateUrl: './term-and-condition.component.html',
  styleUrls: ['./term-and-condition.component.css']
})
export class TermAndConditionComponent {

  @Input() merchantId: string;
  @ViewChild('createOurPoints') createOurPoints: ModalDirective;
  @ViewChild('confirmationmodal') confirmationmodal: ModalDirective;
  fileToUpload: File | null = null;
  documents: any = {}
  desiredOrder = ["Fonda", "Doordash", "Grubhub", "UberEat"];
  sortedDocuments: { key: string, urls: string[] }[] = [];
  TCDocsTypes = TCDocsTypes;
  openDocUrl: string = ''
  delDocId: string = ''
  openDocName: string = ''
  userRole: number
  merchantName: string = ''
  showloader: boolean = true
  showmainloader: boolean = true
  showInfoAlert: boolean = false
  environment = environment;

  constructor(private downloadService: DocumentDownloadService, private el: ElementRef, private toaster: ToastrService, private appState: AppStateService, private securityService: SecurityService, private merchantservice: MerchantService) { }
  ngOnInit(): void {
    this.merchantId = this.appState.currentMerchant;
    this.userRole = this.securityService.securityObject.user.role
    console.log("userrole is ", this.userRole)
    this.GetMerchantDetail()
    this.subscribeAppState()
    this.getdocs()

  }
  subscribeAppState() {
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.merchantId = merchntId;
      this.getdocs()
    })

  }
  GetMerchantDetail() {

    this.merchantservice.GetMerchantById(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
      this.merchantName = data.merchantName
    }, (err) => {
      this.toaster.error(err.message);
    })
  }
  getdocs() {

    this.showInfoAlert = false
    this.merchantservice.GetDocs(this.securityService.securityObject.token, this.merchantId).subscribe((data) => {
      this.sortedDocuments = []
      this.documents = data
      this.showloader = false
      this.showmainloader = false
      this.desiredOrder.forEach(type => {
        if (this.documents.hasOwnProperty(type)) {
          this.sortedDocuments.push({ key: type, urls: this.documents[type] });
        }
      });

      console.log("sorted documents are ", this.sortedDocuments)
      if (this.sortedDocuments.every(doc => doc.urls.length === 0) && (this.userRole == 3 || this.userRole == 4)) {
        this.showInfoAlert = true
      }
      console.log("documents are ", this.sortedDocuments)
    }, (err) => {
      this.showloader = false
      this.toaster.error(err.message);
    })
  }
  deldocs() {
    this.showloader = true
    this.merchantservice.DelDocs(this.securityService.securityObject.token, this.merchantId, this.delDocId).subscribe((data) => {
      this.getdocs()
      this.toaster.success("Document deleted successfully.")
    }, (err) => {
      this.toaster.error(err.message);
    })
  }
  handleFileInput(files: FileList, docType: number) {
    this.fileToUpload = files.item(0);
    if (this.fileToUpload) {
      if (this.fileToUpload.type != "application/pdf") {
        this.toaster.error("Invalid file type. Please upload a PDF document.");
      }
      else {
        let maxFileSize = 2097152
        if (this.fileToUpload.size > maxFileSize) {
          this.toaster.error("File size should not exceed 2 MB.");
        }
        else {
          this.showloader = true
          console.log("file size is ", this.fileToUpload)
          let terms_data = {
            "merchantid": this.merchantId,
            "documenttype": docType
          }
          console.log("terms_data ", terms_data)
          console.log("this.fileToUpload  ", this.fileToUpload)
          this.merchantservice.uploadDOc(this.securityService.securityObject.token, this.fileToUpload, terms_data).subscribe((data: any) => {
            this.getdocs()
            this.toaster.success("Document added successfully.")

          }, (err) => {
            this.toaster.error(err.error.message);
          })
        }
      }
    }
    else {
      this.toaster.error("File was not uploaded successfully.");

    }

  }
  downloadDoc() {

    this.downloadService.downloadDocument(this.openDocUrl, this.openDocName);
  }
  openModalforCreatePoints(docUrl: string, docName: string) {
    this.openDocUrl = docUrl
    this.openDocName = docName
    console.log("opendocurl ", this.openDocUrl)
    // const iframeElement: HTMLIFrameElement = this.el.nativeElement.querySelector('#openDoc');
    // iframeElement.src = docUrl;
    this.createOurPoints.show()
  }
  openModalforConfirmation(url: any) {
    console.log("url is ", url)
    this.delDocId = url.id
    this.openDocName = url.docfilename
    console.log("url is delDocId ", this.delDocId)
    console.log("url is openDocName ", this.openDocName)
    this.confirmationmodal.show()
  }
  closeModal() {
    this.openDocUrl = ''
    this.openDocName
    this.createOurPoints.hide();
  }
  closeConfirmModal() {
    this.openDocName = ''
    this.confirmationmodal.hide();
  }
}
