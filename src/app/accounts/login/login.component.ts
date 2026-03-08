import { MySocketService } from './../../core/my-socket.service';
import { SecurityService } from './../../core/security.service';
import { LoginDto, SecurityObjDto } from './../../Models/security.model';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import { ToastService } from 'ng-uikit-pro-standard';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginUserObj = new LoginDto();
  loginSSOUserObj = new LoginDto();
  securityObject = new SecurityObjDto();
  processing: boolean;
  processingwithsso: boolean

  withCredentials: boolean = false;
  initialStep: boolean = true;
  forgotPasswordStep: boolean = false
  iframeUrl: SafeResourceUrl;
  rememberMe: boolean = false;
  email_redirection: boolean = false;

  constructor(private location: Location, private http: HttpClient, public auth: AuthService, private toaster: ToastrService, private activatedRoute: ActivatedRoute, private mySocket: MySocketService, private securityService: SecurityService, private router: Router, private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
    // Sanitize the iframe URL
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.iframeUrl);
    // Load stored credentials if they exist for remember me
    this.loadSavedCredentials();
    // this.printCallbackValues()
    if (this.activatedRoute.snapshot.queryParams['redirect_from'] && this.activatedRoute.snapshot.queryParams['redirect_from'] === "email"){
      console.log("emails redirection")
      this.changeStep()
      this.email_redirection = true
    }
    this.loginonSSORedirect()
    if (this.activatedRoute.snapshot.queryParams['email'] && this.activatedRoute.snapshot.queryParams['password']) {
      this.securityService.LogOut();
      this.loginUserObj.email = decodeURIComponent(this.activatedRoute.snapshot.queryParams['email']);
      this.loginUserObj.password = decodeURIComponent(this.activatedRoute.snapshot.queryParams['password']);
      this.Login();
    }
  }
  checkUserStatus(token: string, userId: string): void {
    const managementApiUrl = `https://${environment.SSODomain}/api/v2/users/${userId}`;
    console.log()
    this.http.get(managementApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (userData: any) => {
        if (userData.blocked) {
          this.auth.logout();
          console.warn('User is blocked in Auth0.');
        } else {
          console.log('User is active in Auth0.');
          this.loginUserObj.email = userData.email
          this.Login(true)
        }
      },
      error: (err) => {
        if (err.status === 404) {
          console.error('User not found in Auth0 (might be removed).');
        } else {
          console.error('Error retrieving user status from Auth0:', err);
        }
      }
    });
  }
  loginonSSORedirect() {
    console.log('Full URL:', this.location.path(true));
    this.auth.user$.subscribe((user) => {
      console.log('User Profile: ', user);

      if (user) {
        // this.auth.getAccessTokenSilently().subscribe({
        //   next: (token) => {
        //     console.log('Access Token:', token);
        //     this.Login(true, user.email, token)
        //   },
        //   error: (err) => {
        //     console.error('Token retrieval error:', err);
        //   }
        // });
        this.auth.getAccessTokenSilently().subscribe({
          next: (token) => {
            console.log('Access Token:', token);

            // Initialize the JwtHelperService
            const helper = new JwtHelperService();

            // Decode the token
            const decodedToken = helper.decodeToken(token);
            console.log('Decoded Token:', decodedToken);

            // Check if the token is expired
            const isExpired = helper.isTokenExpired(token);
            console.log('Is Token Expired:', isExpired);

            // Get the expiration date
            const expirationDate = helper.getTokenExpirationDate(token);
            console.log('Expiration Date:', expirationDate);

            this.Login(true, user.email, token, user.sub);
          },
          error: (err) => {
            console.error('Token retrieval error:', err);
          }
        });

      }
    });
  }
  printCallbackValues(): void {
    // Get user profile data
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        console.log('User is authenticated');
      } else {
        console.log('User is not authenticated');
      }
    });


    // check user status
    this.auth.user$.subscribe((user) => {
      console.log('User Profile: ', user);

      if (user) {
        // Fetch access token to call Auth0 Management API
        this.auth.getAccessTokenSilently().subscribe({
          next: (token) => {
            console.log('Access Token:', token);
            this.Login(true, user.email)
            // this.checkUserStatus(token, user.sub); // Call the function to check user status
          },
          error: (err) => {
            this.auth.loginWithRedirect()
            console.error('Token retrieval error:', err);
          }
        });
      }
      // else { this.auth.loginWithRedirect() }
    });

    // Handle authentication errors


  }
  Login(withSSO?, email?, token?, SSOId?) {
    console.log("login work 11111")
    var newloginUserObj = new LoginDto();
    if (withSSO) {
      this.processingwithsso = true;
      this.loginSSOUserObj['withSSO'] = 1
      this.loginSSOUserObj['SSOToken'] = token
      this.loginSSOUserObj['SSOId'] = SSOId
      this.loginSSOUserObj.password = 'pswd'
      this.loginSSOUserObj.email = email
      console.log(this.loginSSOUserObj)
      newloginUserObj = this.loginSSOUserObj
    }
    else {
      this.processing = true
      newloginUserObj = this.loginUserObj
    }
    console.log("login work2222")
    var redirect_uri = ''
    var is_stream = false
    if (this.activatedRoute.snapshot.queryParams['response_type'] == 'code' && this.activatedRoute.snapshot.queryParams['redirect_uri']) {
      redirect_uri = this.activatedRoute.snapshot.queryParams['redirect_uri']
      is_stream = true
    }
    this.securityService.Login(newloginUserObj, redirect_uri, is_stream).subscribe((data) => {
      if (this.activatedRoute.snapshot.queryParams['response_type'] == 'code' && this.activatedRoute.snapshot.queryParams['redirect_uri']) {
        redirect_uri = this.activatedRoute.snapshot.queryParams['redirect_uri']
        const streamAuthUrl = `${redirect_uri}?code=${data.token}`;
        window.location.href = streamAuthUrl;
      }
      else {
        this.processing = false;
        this.processingwithsso = false
        this.router.navigateByUrl('/home/dashboard');
        this.mySocket.startConnection();
      }

    }, (err) => {
      this.processing = false;
      this.processingwithsso = false
      console.log("errorrrr iss ", err.error)

      this.toaster.error(err.error.message);
    })
  }
  login_with_sso() {
    this.processingwithsso = true
    this.auth.loginWithRedirect()
    // this.auth.user$.subscribe((user) => {
    //   console.log('User Profile: ', user);

    //   if (user) {
    //     this.Login(true, user.email)
    // Fetch access token to call Auth0 Management API
    // this.auth.getAccessTokenSilently().subscribe({
    //   next: (token) => {
    //     console.log('Access Token:', token);
    //     this.Login(true, user.email)
    //     // this.checkUserStatus(token, user.sub); // Call the function to check user status
    //   },
    //   error: (err) => {
    //     this.auth.loginWithRedirect()
    //     console.error('Token retrieval error:', err);
    //   }
    // });
    // }
    //   else { this.auth.loginWithRedirect() }
    // });
  }

  // Load saved credentials from local storage for remember me
  loadSavedCredentials(): void {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');

    if (savedEmail && savedPassword) {
      this.loginUserObj.email = savedEmail;
      this.loginUserObj.password = CryptoJS.AES.decrypt(savedPassword, 'secret-key').toString(CryptoJS.enc.Utf8);
    }
  }
  // Handle the checkbox change event for remember me
  onRememberMeChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.saveCredentials();
    } else {
      this.clearCredentials();
    }
  }
  // Save credentials to local storage for remember me
  saveCredentials(): void {
    const encryptedPassword = CryptoJS.AES.encrypt(this.loginUserObj.password, 'secret-key').toString(); // Encrypt the password
    localStorage.setItem('savedEmail', this.loginUserObj.email);
    localStorage.setItem('savedPassword', encryptedPassword);
  }

  // Clear credentials from local storage for remember me
  clearCredentials(): void {
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('savedPassword');
  }
  changeStep() {
    this.withCredentials = true;
    this.initialStep = false;
  }
  stepForForgorPassword() {
    this.withCredentials = false;
    this.initialStep = false;
  }

  isPasswordVisible = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
