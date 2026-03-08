import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { WoflowService } from 'src/app/core/woflow.service';
import { SecurityService } from 'src/app/core/security.service';
import { LazyModalDto } from 'src/app/Models/app.model';
import { MerchantListDto, MerchantStatusEnum } from 'src/app/Models/merchant.model';
import { UserRoleEnum } from 'src/app/Models/user.model';
import { AppStateService } from 'src/app/core/app-state.service';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { forkJoin } from 'rxjs';
import { WoflowJobs } from 'src/app/Models/woflow.model'
import { MerchantService } from 'src/app/core/merchant.service';
@UntilDestroy()
@Component({
  selector: 'app-woflow',
  templateUrl: './woflow.component.html',
  styleUrls: ['./woflow.component.scss']
})
export class WoflowComponent implements OnInit {

  constructor(private merchantservice: MerchantService, private toaster: ToastrService, private securityService: SecurityService, private router: Router,
    private woflowService: WoflowService, private appState: AppStateService, private filterDataService: FilterDataService, private appUi: AppUiService, private activatedRoute: ActivatedRoute) { }
  merchantId: string;
  filesToUpload: FileList
  allJobs: WoflowJobs[] = [];
  processingType: string
  merchantDto = new MerchantListDto();
  instrutions: string
  remarks: string
  gettingWoflowList: boolean;
  downloadWoflowMenu: boolean;
  savingActionReason: boolean;
  namesArrayToShowOnUI = []
  action: string
  selectedJobId: string
  isNewJob: boolean;
  ngOnInit(): void {
    this.subscribeAppState()
    this.GetMerchantDetail();
    this.getAllJobs()

  }
  GetMerchantDetail() {
    this.merchantservice.GetMerchantById(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;

    }, (err) => {
      this.toaster.error(err.message);
    })
  }

  subscribeAppState() {
    this.merchantId = this.appState.currentMerchant;
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.merchantId = merchntId;
      this.GetMerchantDetail()
      this.getAllJobs()
    })
  }
  expandtable: { expandtable: boolean, idx: number }[] = [];
  onChangeExpandtable(idx) {
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }
  getAllJobs() {
    this.gettingWoflowList = true;
    this.woflowService.getAllJobs().subscribe((data: any) => {
      this.gettingWoflowList = false;
      this.allJobs = data.data
      // for mobile view
      this.expandtable = new Array(this.allJobs.length).fill({ expandtable: false, idx: 0 });
      this.expandtable = this.expandtable.map((item, idx) => {
        return {
          ...item,
          idx: idx
        }
      })
    }, (err) => {
      this.gettingWoflowList = false;
      this.toaster.error(err.error.message);

    })
  }

  blob = null
  downloadMenu(menuId: string) {
    this.downloadWoflowMenu = true;
    this.woflowService.getPDFOfMenu(menuId).subscribe((data: any) => {
      this.blob = new Blob([data], { type: 'application/pdf' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "Woflow Menu";
      link.click();
      this.downloadWoflowMenu = false;
    }, (err) => {
      this.downloadWoflowMenu = false;
      console.log(err)
      this.toaster.error(err.error.message);
    })
  }
  reloadJob(woflowColumnId: string) {
    this.woflowService.refereshJob(woflowColumnId).subscribe((data: any) => {
      this.toaster.success("Job status refreshed successfully")
      this.getAllJobs();
    }, err => {
      this.isNewJob = false;
      this.toaster.error(err.error.message);
    })

  }
  handleFileInput(files: FileList) {
    this.isNewJob = true;
    this.filesToUpload = files
    var namesArray = [];
    var fullUrls = []
    Array.from(files).forEach(file => {
      //console.log(file)
      namesArray.push(String(+new Date()) + String(Math.floor(Math.random() * 6000) + 1) + file.name)
    });
    this.woflowService.uploadMenu(true, namesArray).subscribe((data: any) => {
      let calls = [];
      let number = 0;
      this.toaster.success("The job submission is in progress. Please Wait");
      data.data.forEach((element, index) => {
        calls.push(this.woflowService.uploadFilesToAWS(element.presignedUrl.url, element.presignedUrl.fields, this.filesToUpload[index]));
        fullUrls.push(element.presignedUrl.url + element.presignedUrl.fields.key)
        // this.woflowService.uploadFilesToAWS(element.presignedUrl.url, element.presignedUrl.fields, this.filesToUpload[index]).subscribe((data: any) => {
        //   this.toaster.success("image added successfully.")

        // }, (err) => {
        //   this.toaster.error(err.error.message);
        // })
      });
      forkJoin(...calls).subscribe(
        data => { // Note: data is an array now
      
          this.woflowService.uploadMenu(false, fullUrls).subscribe((data: any) => {
      
            this.woflowService.PostMenu(data.data.id, this.processingType, this.instrutions).subscribe((data: any) => {
              this.isNewJob = false;
              this.toaster.success("Job submitted successfully");
              this.getAllJobs()
            }, (err) => {
              this.isNewJob = false;
              this.toaster.error(err.message);
            })
          }, (err) => {
            this.isNewJob = false;
            this.toaster.error(err.message);
          })

        }, err => {
          this.isNewJob = false;
          this.toaster.error(err.error.message);
        },
        () => console.log('Ok ')
      );
    }, (err) => {
      this.isNewJob = false;
      this.toaster.error(err.message);
    })


  }
  showNamesONUI() {
    let filesID = document.getElementById('takeInput');
    const files = filesID['files']
    Array.from(files).forEach(file => {
  
      this.namesArrayToShowOnUI.push(file["name"])
    });

  }

  submitJob() {
    let filesID = document.getElementById('takeInput');
    const files = filesID['files']
    this.handleFileInput(files);
  }
  @ViewChild('ConfirmModal') ConfirmModal: ModalDirective;
  acceptMenu(jobId: string, action: string) {
    this.selectedJobId = jobId
    this.action = action
    this.remarks = ""
    this.ConfirmModal.show()

  }
  performActionPopup() {
    this.savingActionReason = true;
    this.woflowService.aceptRejectMenu(this.selectedJobId, this.action, this.remarks).subscribe((data: any) => {
      this.savingActionReason = false
      this.ConfirmModal.hide()
      this.getAllJobs()
    }, err => {
      this.savingActionReason = false;
      this.toaster.error(err.error.message);
    })
  }
}
