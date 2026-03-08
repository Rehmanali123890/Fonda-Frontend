import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';
import { SecurityService } from 'src/app/core/security.service';
import { JwtHelperService } from '@auth0/angular-jwt';  // Import JwtHelperService
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class SSOInterceptor implements HttpInterceptor {

  constructor(
    public auth: AuthService,
    private securityService: SecurityService,
    private toaster: ToastrService,
    private jwtHelper: JwtHelperService  // Inject JwtHelperService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if securityObject and user are defined before accessing withSSO
    if (this.securityService.securityObject && this.securityService.securityObject.user) {
      const withSSO = this.securityService.securityObject.user.withSSO;


      if (withSSO == 1) {
        const token = this.securityService.securityObject.token;

        // Check if the token is expired without using an API call
        if (this.jwtHelper.isTokenExpired(token)) {
          console.warn('Token is expired.');
          this.toaster.error('Your session has expired. Please log in again.');
          setTimeout(() => {
            this.auth.logout();  // Perform logout
            this.securityService.LogOut(true);
          }, 3000);
          return of();  // Stop further requests if token is expired
        }

        // Skip the API call for user status, just proceed with the API request
        return next.handle(req).pipe(
          finalize(() => {

          })
        );
      }
    }

    // In case withSSO is not 1 or securityObject/user is not defined
    return next.handle(req).pipe(
      finalize(() => {

      })
    );
  }
}
