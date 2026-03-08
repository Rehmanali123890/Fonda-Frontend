import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/core/app-state.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { ConnectedPlatformObj } from 'src/app/Models/merchant.model';
import { Output } from '@angular/core';
import { environment } from 'src/environments/environment';
@UntilDestroy()
@Component({
  selector: 'app-passwords',
  templateUrl: './passwords.component.html',
  styleUrls: ['./passwords.component.scss']
})
export class PasswordsComponent implements OnInit {

  constructor(private securityService: SecurityService,
    private appStateService: AppStateService,
    private toaster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private merchantService: MerchantService,
    private appState: AppStateService) { }
  @Input() isProcessing: boolean;
  @Output() triggerChangeParent = new EventEmitter<any>();
  @Input() ConnectedPlatforms: ConnectedPlatformObj[] = [];
  @Input() merchantId: string;
  isConnected: boolean = false;
  username: string = "";
  password: string = ""
  initialized = false;
  hasUsername: boolean = false
  ngOnInit(): void {
    this.initialized = true;
    // this.subscribeAppState();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized) {
      this.getPasswords()
    }
  }
  // subscribeAppState() {
  //   this.merchantId = this.appState.currentMerchant;
  //   this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
  //     this.merchantId = merchntId;
  //   })
  // }
  getPasswords() {
    this.merchantService.GetMerchantPlatformPasswords(this.merchantId).subscribe((data: any) => {
      let objList = data.data
      let filtered = objList.filter(x => x.platformtype == 5)
      if (filtered.length > 0) {
        this.username = filtered[0].email;
        this.password = filtered[0].password
        this.hasUsername = true
      }
    }, (err) => {
      this.toaster.error(err.error.message)
    })
  }
  savePassword() {
    this.merchantService.saveMerchantPlatformPasswords(this.merchantId, {
      "platformCredentials": [
        {
          "platformtype": 5,
          "email": this.username,
          "password": this.password
        }
      ]
    }).subscribe((data: any) => {
      this.toaster.info("Credentials saved successfully")
      this.hasUsername = true
    }, (err) => {
      this.toaster.error(err.error.message)
    })
  }
  deletePassword() {
    this.merchantService.saveMerchantPlatformPasswords(this.merchantId, {
      "platformCredentials": []
    }).subscribe((data: any) => {
      this.toaster.info("Credentials removed successfully")
      this.hasUsername = false
      this.username = "";
      this.password = "";
      this.getPasswords()
    }, (err) => {
      this.toaster.error(err.error.message)
    })
  }
}
