import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { SecurityService } from 'src/app/core/security.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class SSOInterceptor implements HttpInterceptor {

  private lastCheckTimestamp: number | null = null;  // Store the last check timestamp
  private checkInterval = 5 * 1000;  // 30 seconds interval between checks

  constructor(public http: HttpClient, public auth: AuthService, private securityService: SecurityService,) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Hardcoded token and userSSOId
    const withSSO = this.securityService.securityObject.user.withSSO
    if (withSSO == 1) {

      const token = this.securityService.securityObject.token
      const userSSOId = this.securityService.securityObject.user.SSOId;
      const managementApiUrl = `https://${environment.SSODomain}/api/v2/users/${userSSOId}`;

      // Get the current timestamp
      const now = Date.now();

      // Check if enough time has passed since the last API call
      if (!this.lastCheckTimestamp || now - this.lastCheckTimestamp >= this.checkInterval) {
        // Update the last check timestamp to the current time
        this.lastCheckTimestamp = now;

        // Perform the user status check
        this.http.get(managementApiUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).subscribe({
          next: (userData: any) => {
            if (userData.blocked) {
              console.warn('User is blocked in Auth0.');
              this.auth.logout();  // Perform logout
              this.securityService.LogOut(true);
            } else {
              console.log('User is active in Auth0.');
            }
          },
          error: (err) => {
            if (err.status === 401 || err.status === 403) {
              console.error('Token expired or invalid:', err);
              this.auth.logout();  // Perform logout
              this.securityService.LogOut(true);
            } else if (err.status === 404) {
              console.error('User not found in Auth0 (might be removed).');
              this.auth.logout();  // Perform logout
              this.securityService.LogOut(true);
            } else {
              console.error('Error retrieving user status from Auth0:', err);
            }
          }
        });
      } else {
        console.log('Skipping user status check as it was recently performed.');
      }

      // Proceed with the API request and intercept
      return next.handle(req).pipe(
        finalize(() => {
          // Finalize logic (if any) after the API call completes
          console.log('API call completed.');
        })
      );
    }
    else {
      return next.handle(req).pipe(
        finalize(() => {
          // Finalize logic (if any) after the API call completes
          console.log('API call completed.');
        })
      );
    }
  }
}
