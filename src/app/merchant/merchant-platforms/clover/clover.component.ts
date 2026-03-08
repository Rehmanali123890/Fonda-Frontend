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
  selector: 'app-clover',
  templateUrl: './clover.component.html',
  styleUrls: ['./clover.component.scss']
})
export class CloverComponent implements OnInit {

  constructor(private securityService: SecurityService,
    private appStateService: AppStateService,
    private toaster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private merchantService: MerchantService,
    private appState: AppStateService) { }
  @Input() merchantId: string;
  merchantIdOnClover: string;
  @Input() isProcessing: boolean;
  @Output() triggerChangeParent = new EventEmitter<any>();
  @Input() ConnectedPlatforms: ConnectedPlatformObj[] = [];
  syncing: boolean = false;
  AutoSync: string = "0";
  isConnected: boolean = false;
  currentPlatform: string = "Clover"
  currentPlatformId: number = 4;
  connectClover: boolean = false
  ngOnInit(): void {

    this.merchantId = this.activatedRoute.snapshot.paramMap.get('id');
    this.subscribeAppState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isConnected = false
    if (this.ConnectedPlatforms.length > 0) {
      let connectedPlatfromObj = this.ConnectedPlatforms.filter(x => x.platformtype == this.currentPlatformId)[0]
      if (connectedPlatfromObj != undefined && Object.keys(connectedPlatfromObj).length > 0) {
        this.isConnected = true
        this.AutoSync = String(connectedPlatfromObj.synctype)
      } else {

      }
    }
    //this.isProcessing = false;

  }

  subscribeAppState() {
    this.merchantId = this.appState.currentMerchant;
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.merchantId = merchntId;
    })
  }
  getStoreinfo(platformType: number) {
    if (this.ConnectedPlatforms.length > 0) {
      let name = this.ConnectedPlatforms.filter(x => x.platformtype === platformType)[0].metadata.store.name;
      let address = this.ConnectedPlatforms.filter(x => x.platformtype === platformType)[0].metadata.store.phoneNumber
      return [name, address]
    }
    return ['', '']
  }
  saveAutoSyncSettings(platformType: number) {
    let id = this.ConnectedPlatforms.filter(x => x.platformtype == platformType)[0].id

    this.merchantService.saveAutoSyncSettings(this.merchantId, id, this.AutoSync).subscribe((data: any) => {
      this.toaster.info("Settings saved successfully")
    }, (err) => {
      this.toaster.error(err.error.message)
    })

  }
  triggerManualSync(platformType: number, downloadMenu: number) {
    this.merchantService.TriggerManualSync(this.merchantId, this.ConnectedPlatforms.filter(x => x.platformtype == platformType)[0].id, downloadMenu).subscribe((data: any) => {
      this.toaster.info("Menu sync will be completed in 15 minutes.")
      this.syncing = true;
    },
      (err) => {
        this.toaster.error(err.error.message);
      }
    );
  }

  disconnectPlatform(platformType: number) {

    this.merchantService.DisonnectPlatform(this.merchantId, this.ConnectedPlatforms.filter(x => x.platformtype == platformType)[0].id).subscribe((data: any) => {
      this.toaster.info('Disconnected successfully')
      this.triggerChangeParent.emit();
      // this.GetConnectedPlatforms();
    },
      (err) => {
        this.isProcessing = false;
        this.toaster.error(err.message);
      }
    );
  }


  doAuthorizationClover() {
    let url = environment.cloverLoginURL
    this.doAuthorization(url, 'https://sandbox.dev.clover.com/oauth/authorize?client_id=25CCGWSAP52DE', 4)
  }

  authorizationCode: string;

  // popup related
  windowHandle: Window;   // reference to the window object we will create    
  private intervalId: any = null;  // For setting interval time between we check for authorization code or token
  private loopCount = 6000;   // the count until which the check will be done, or after window be closed automatically.
  private intervalLength = 100;   // the gap in which the check will be done for code.
  changeOauthUrl(url, windowhandle) {
    windowhandle.location = url
  }
  doAuthorization(loginUrl: string, logoutUrl: string, platformId: number) {
    this.connectClover = true
    let loopCount = this.loopCount;
    /* Create the window object by passing url and optional window title */
    this.windowHandle = this.createOauthWindow(logoutUrl, 'OAuth login Clover');

    setTimeout(this.changeOauthUrl, 200, loginUrl, this.windowHandle);
    /* Now start the timer for which the window will stay, and after time over window will be closed */
    this.intervalId = window.setInterval(() => {
      if (loopCount-- < 0) {
        window.clearInterval(this.intervalId);
        this.windowHandle.close();
      } else {
        let href: string;  // For referencing window url
        try {
          href = this.windowHandle.location.href; // set window location to href string
        } catch (e) {
          // console.log('Error:', e); // Handle any errors here
        }
        if (href != null) {

          // Method for getting query parameters from query string
          const getQueryString = function (field: any, url: string) {
            const windowLocationUrl = url ? url : href;
            const reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
            const string = reg.exec(windowLocationUrl);
            return string ? string[1] : null;
          };
          /* As i was getting code and oauth-token i added for same, you can replace with your expected variables */
          if (href.match('code')) {

            window.clearInterval(this.intervalId);
            this.authorizationCode = getQueryString('code', href);
            this.merchantIdOnClover = getQueryString('merchant_id', href);

            this.windowHandle.close();
            if (this.connectClover == true) {
              this.connectClover = false
              this.merchantService.ConnectClover({
                "code": this.authorizationCode,
                "merchant_id": this.merchantIdOnClover
              }, this.merchantId).subscribe((data: any) => {
                // this.GetConnectedPlatforms()
                this.toaster.success("Clover Connected");
                this.triggerChangeParent.emit();
              },
                (err) => {
                  console.log(err)
                  this.toaster.error(err.error.message);
                });
            }
          }
        }
      }
    }, this.intervalLength);
  }

  createOauthWindow(url: string, name = 'Authorization', width = 500, height = 700, left = 50, top = 0) {
    if (url == null) {
      return null;
    }
    const options = `width=${width},height=${height},left=${left},top=${top}`;
    return window.open(url, name, options);
  }

}
