import { MySocketService } from './core/my-socket.service';
import { AppStateService } from './core/app-state.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SecurityService } from './core/security.service';
import { SwUpdate } from '@angular/service-worker';
import { TranslocoService } from '@ngneat/transloco';
import { LoaderService } from './core/loader.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading: boolean;
  title = 'Fonda';
  constructor(private location: Location, private toaster: ToastrService, private route: ActivatedRoute, public http: HttpClient, public auth: AuthService, public loaderService: LoaderService, private securityService: SecurityService, private sw: SwUpdate, private mySocket: MySocketService, private router: Router, private appState: AppStateService,
    private translocoService: TranslocoService) {

  }
  ngOnInit(): void {
    this.checkAuth0URL()
    
    const lang = localStorage.getItem('lang');
    if (lang) {
      // this.translocoService.setActiveLang(lang);
    }
    this.sw.available.subscribe(event => {
      this.sw.activateUpdate().then(() => window.location.reload());
    });
    const securityObjectstring = localStorage.getItem('securityData');
    if (securityObjectstring) {
      this.securityService.securityObject = JSON.parse(securityObjectstring);
      this.mySocket.startConnection();
      this.printCallbackValues()
      // this.globalSnackBar.suscribeNewOrders();


    }
    const currentMerchant = localStorage.getItem('currentMerchant');
    if (currentMerchant) {
      this.appState.currentMerchant = currentMerchant;
    }
    this.SubscribeNavigationsState();
  }
  SubscribeNavigationsState() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {

        // this.spinner.show('globleSpinner');
        this.loading = true;

      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        // this.spinner.hide('globleSpinner');
        this.loading = false;
      }
    });
  }
  checkAuth0URL() {
    console.log('check that Redirected from Auth0');

    // Extract query parameters from the URL
    const urlParams = new URLSearchParams(this.location.path(true).split('?')[1]);

    // Get the 'fromAuth0' and 'error' parameters
    const fromAuth0 = urlParams.get('fromAuth0');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');



    // Check if 'fromAuth0' and 'error' are present
    if (fromAuth0 && error) {
      console.log('fromAuth0:', fromAuth0);
      console.log('error:', error);
      console.log('error_description:', errorDescription);
      // Show different error messages based on the error type
      if (error === 'unauthorized') {
        this.toaster.error('Your account has been blocked or suspended. Please contact support for further assistance.');
      } else {
        // Display a generic error if other errors exist
        this.toaster.error(errorDescription || 'An unknown error occurred.');
      }
    }


  }
  checkUserStatus(token: string, userId: string): void {
    const managementApiUrl = `https://${environment.SSODomain}/api/v2/users/${userId}`;

    this.http.get(managementApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (userData: any) => {
        if (userData.blocked) {
          console.warn('User is blocked in Auth0.');
          // Handle your own security logic for logout
          this.toaster.error('Your account has been blocked. Please contact support for assistance.');
          setTimeout(() => {
            this.auth.logout();  // Perform logout
            this.securityService.LogOut(true);
          }, 3000);
        } else {
          console.log('User is active in Auth0.');
        }
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          console.error('Token expired or invalid:', err);

          this.toaster.error('Your session has expired. Please log in again.');
          setTimeout(() => {
            this.auth.logout();  // Perform logout
            this.securityService.LogOut(true);
          }, 3000); // Handle your own security logic for logout
        } else if (err.status === 404) {
          console.error('User not found in Auth0 (might be removed).');

          this.toaster.error('Account not found. Please contact support  for further assistance.');
          setTimeout(() => {
            this.auth.logout();  // Perform logout
            this.securityService.LogOut(true);
          }, 3000);  // Handle your own security logic for logout
        } else {
          console.error('Error retrieving user status from Auth0:', err);

          this.toaster.error('Something went wrong while retrieving your account. Please log in again.');
          setTimeout(() => {
            this.auth.logout();  // Perform logout
            this.securityService.LogOut(true);
          }, 3000);
        }
      }
    });
  }
  printCallbackValues(): void {
    console.log("app component")
    if (this.securityService.securityObject && this.securityService.securityObject.user) {
      const withSSO = this.securityService.securityObject.user.withSSO;
      console.log("sso status is in app", withSSO);

      if (withSSO == 1) {
        const token = this.securityService.securityObject.token;
        const SSOId = this.securityService.securityObject.user.SSOId;
        this.checkUserStatus(token, SSOId); // Call the function to check user status
      }
    }


  }
}
