import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { GoogleMyBusinessService } from 'src/app/core/google-my-business.service'
import { MerchantListDto } from 'src/app/Models/merchant.model';
import { SidenavComponent } from 'src/app/public/sidenav/sidenav.component';
import { Locations } from 'src/app/Models/googleMyBusiness.model'
import { Location_obj } from 'src/app/Models/googleMyBusiness.model'
import { menu } from 'src/app/Models/googleMyBusiness.model'
import { provider } from 'src/app/Models/googleMyBusiness.model'
import { environment } from 'src/environments/environment';
import { AppStateService } from 'src/app/core/app-state.service';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-gmb-tabs',
  templateUrl: './gmb-tabs.component.html',
  styleUrls: ['./gmb-tabs.component.css']
})
export class GmbTabsComponent {
  @Input() merchantId: string;
  connectingGMB: boolean = false;
  gettingLocationList: boolean = false
  linkingLocation: boolean = false
  unlinkingLocation: boolean = false
  loadingReviews: boolean = false
  syncingMenu: boolean = false
  savingcommentReply: boolean = false
  syncingProfile: boolean = false
  showConnectGoogleBtn: boolean = false
  showingtabs: boolean = false
  showingReviewsSection: boolean = false
  locationsList: Locations[] = [];
  commentReply: string;
  showloader: boolean = true
  onlyConnectGoogle: boolean = false
  selectedlocation = new Locations()
  MerchantsList: MerchantListDto[] = [];
  loc_obj = new Location_obj()
  menu_obj = new menu()
  media_obj: any = [];
  provider_obj = new provider()
  map: any
  connectedGMB: boolean = false
  connectGMBErrorCrad: boolean = false
  constructor(private sidenav: SidenavComponent, private merchantService: MerchantService, private appState: AppStateService, private googleMyBusiness: GoogleMyBusinessService, private securityService: SecurityService, private toaster: ToastrService,) { }

  @ViewChild('createLocation') createLocation: ModalDirective;

  ngOnInit(): void {
    this.sidenav.shouldDisplayElement(true)
    this.merchantId = this.appState.currentMerchant;
    this.getLocation('parent')
    this.subscribeAppState()


  }



  subscribeAppState() {
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.merchantId = merchntId;
      this.getLocation('parent')
    })

  }
  getLocation(param: string) {
    //check that call from parent
    if (param == 'parent') {
      this.gettingLocationList = true
      this.showloader = true
      this.showConnectGoogleBtn = false
      this.onlyConnectGoogle = false
      this.showingtabs = false
    }
    this.googleMyBusiness.getLocationByMerchantId(this.securityService.securityObject.token, this.merchantId).subscribe((data: any) => {
      console.log("data is ", data)
      this.gettingLocationList = false
      this.showConnectGoogleBtn = false
      if (data.hasOwnProperty('all_locations')) {
        this.locationsList = data.all_locations
        this.showloader = false
        this.onlyConnectGoogle = true
        // console.log("this.locationsList in getlocation", this.locationsList)

      }
      else if (data.hasOwnProperty('location')) {

        this.loc_obj = data.location
        console.log("this.loc_obj ........", this.loc_obj)
        if (param == 'parent') { this.getmenu() }

      }

    }, (err) => {
      console.log("data is in error")
      this.gettingLocationList = false
      this.showloader = false
      this.showConnectGoogleBtn = true
      // this.toaster.error(err.error.message);
    })
  }
  getmenu() {

    this.googleMyBusiness.getMenuById(this.securityService.securityObject.token,
      {
        "merchantid": this.merchantId,
        "locationid": this.loc_obj.locationId,
        "accountid": this.loc_obj.accountId,

      }
    ).subscribe((data: any) => {
      // console.log("data is ", data)
      this.menu_obj = data

      if (this.loc_obj.status == 3) {
        console.log("stati sss ", this.loc_obj.status)
        this.getmedia()
      }
      else {
        this.showloader = false
        this.showingtabs = true
        this.onlyConnectGoogle = false
      }

      // console.log("this.menu_obj in tabs", this.menu_obj)
    }, (err) => {
      // console.log("menu data is in error")
      this.toaster.error(err.error.message);

    })
  }
  getmedia() {

    this.googleMyBusiness.getMedia(this.securityService.securityObject.token,
      {
        "merchantid": this.merchantId,
        "locationid": this.loc_obj.locationId,
        "accountid": this.loc_obj.accountId,

      }
    ).subscribe((data: any) => {
      console.log("media data is ", data)
      this.media_obj = data.categories.mediaItems
      console.log("media data is ", this.media_obj)
      this.getPlaceAction()
    }, (err) => {
      console.log("media data is in error")
      this.toaster.error(err.error.message);
    })
  }
  getPlaceAction() {

    this.googleMyBusiness.getOrderPlaceLink(this.securityService.securityObject.token,
      {
        "merchantid": this.merchantId,
        "locationid": this.loc_obj.locationId,
        "accountid": this.loc_obj.accountId,
      }
    ).subscribe((data: any) => {
      console.log("getPlaceAction data is ", data)
      this.provider_obj = data
      this.showloader = false
      this.showingtabs = true
      this.onlyConnectGoogle = false

    }, (err) => {
      console.log("media data is in error")
      // this.toaster.error(err.error.message);
      this.showloader = false
      this.showingtabs = true
      this.onlyConnectGoogle = false
      this.provider_obj = new provider()

    })
  }
  doAuthorizationGoogle() {
    let url = environment.GmbAuthURL
    this.doAuthorization(url, 'https://www.google.com')
  }
  authorizationCode: string;
  oAuthToken: string;
  oAuthVerifier: string;
  // popup related
  windowHandle: Window;   // reference to the window object we will create    
  private intervalId: any = null;  // For setting interval time between we check for authorization code or token
  private loopCount = 6000;   // the count until which the check will be done, or after window be closed automatically.
  private intervalLength = 100;   // the gap in which the check will be done for code.
  changeOauthUrl(url, windowhandle) {
    windowhandle.location = url
  }
  doAuthorization(loginUrl: string, logoutUrl: string) {
    this.connectedGMB = true
    let loopCount = this.loopCount;
    /* Create the window object by passing url and optional window title */
    this.windowHandle = this.createOauthWindow(logoutUrl, 'OAuth login');

    setTimeout(this.changeOauthUrl, 40, loginUrl, this.windowHandle);
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

            this.windowHandle.close();
            this.connectingGMB = true
            this.connectGMBErrorCrad = false
            if (this.connectedGMB == true) {
              this.connectedGMB = false
              this.googleMyBusiness.ConnectGMB(this.securityService.securityObject.token, {
                "code": this.authorizationCode,
                "redirect_uri": window.location.origin,
                "merchantid": this.merchantId
              }).subscribe((data: any) => {
                this.connectingGMB = false;
                console.log("data ", data)
                this.locationsList = data.all_locations
                this.connectingGMB = false
                if (this.locationsList.length > 0) {
                  this.toaster.success("Connected successfully!")
                  this.showConnectGoogleBtn = false
                  this.onlyConnectGoogle = true

                }
                else {
                  this.toaster.error("there is no GMB associated or there is no location against it.")
                  this.connectGMBErrorCrad = true
                }
              }, err => {
                this.showConnectGoogleBtn = true
                this.connectingGMB = false;
                this.toaster.error(err.error.message);
              })
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



  linkLocation() {
    this.linkingLocation = true
    this.showloader = true
    this.googleMyBusiness.linkLocation(this.securityService.securityObject.token, {
      "locationId": this.selectedlocation.locationId,
      "merchantId": this.merchantId,
      "accountId": this.selectedlocation.accountId
    }).subscribe((data: any) => {

      this.linkingLocation = false

      this.loc_obj = data.location
      this.getmenu()
      this.toaster.success("Location Linked Successfully");

    },
      (err) => {
        this.linkingLocation = false
        this.showloader = false
        this.toaster.error(err.error.message);
      })
  }
  UnlinkLocation() {
    this.unlinkingLocation = true
    this.googleMyBusiness.unLinkLocation(this.securityService.securityObject.token, {
      "locationId": this.loc_obj.locationId,
      "merchantId": this.merchantId
    }).subscribe((data: any) => {
      this.unlinkingLocation = false
      this.getLocation('parent')
      this.toaster.success("Location unlinked Successfully");

    },
      (err) => {
        this.unlinkingLocation = false
        this.toaster.error(err.error.message);
      })
  }

  menuSync(merchantId, locationId, accountId) {
    this.syncingMenu = true
    this.googleMyBusiness.syncMenu(this.securityService.securityObject.token, {
      "locationId": locationId,
      "accountId": accountId
    }, merchantId).subscribe((data: any) => {
      this.syncingMenu = false
      this.toaster.success("Menu sync will be completed in 15 mins.");
    },
      (err) => {
        this.syncingMenu = false
        this.toaster.error(err.error.message);
      })
  }





  openModalforCreateLocation() {
    this.createLocation.show()
  }
  closeModal() {
    this.createLocation.hide();
  }
  newLocation: any
  createLoc: boolean = false

}
