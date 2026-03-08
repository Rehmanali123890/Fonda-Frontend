import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SecurityService } from 'src/app/core/security.service';
import { AuthService } from '@auth0/auth0-angular';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    public auth: AuthService,
    private securityService: SecurityService,
    private toaster: ToastrService // Inject JwtHelperService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Check if the error is an instance of HttpErrorResponse
        if (error instanceof HttpErrorResponse) {
          // Log the error details
          console.log("error in interceptor", error.error)
          if ('message' in error.error) {
            const errorMessagesToCheck = ['user', 'User', 'USER', 'token', 'Token', 'TOKEN'];
            if (errorMessagesToCheck.some(msg => error.error.message.includes(msg))) {
              // logout here
              if (this.securityService.securityObject && this.securityService.securityObject.user) {
                const withSSO = this.securityService.securityObject.user.withSSO;


                if (withSSO == 1) {
                  this.toaster.error('Your session has expired. Please log in again.');
                  setTimeout(() => {
                    this.auth.logout();  // Perform logout
                    this.securityService.LogOut(true);
                  }, 3000);
                }
                else {
                  this.toaster.error('Your session has expired. Please log in again.');
                  setTimeout(() => {
                    // Perform logout
                    this.securityService.LogOut();
                  }, 3000);
                }
              }
              console.log(`Error message field exists: ${error.error.message}`);
            }
            else {
              // Check if the status exists
              if ('status' in error.error) {
                if (error.error.status === 401) {
                  // logout here
                  if (this.securityService.securityObject && this.securityService.securityObject.user) {
                    const withSSO = this.securityService.securityObject.user.withSSO;


                    if (withSSO == 1) {
                      this.toaster.error('Your session has expired. Please log in again.');
                      setTimeout(() => {
                        this.auth.logout();  // Perform logout
                        this.securityService.LogOut(true);
                      }, 3000);
                    }
                    else {
                      this.toaster.error('Your session has expired. Please log in again.');
                      setTimeout(() => {
                        // Perform logout
                        this.securityService.LogOut();
                      }, 3000);
                    }
                  }
                  console.log(`Error Status: ${error.error.status}`);
                }
              } else {
                console.log(`No status code found`);
              }
            }
          } else {
            console.log(`Error does not contain a message field`);
          }


        }
        // Re-throw the error after logging it
        return throwError(() => error);
      })
    );
  }
}
