import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, take, catchError } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    public auth: AuthService,
    public http: HttpClient,
    public router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Hardcoded token for testing purposes
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkRrSVdGeE90TnJQSDgxc1dvR1Z2QSJ9.eyJpc3MiOiJodHRwczovL2Rldi16YWU3cWd2bjMyeG15dTNnLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJzYW1scHxzYW1sfEthbSIsImF1ZCI6WyJodHRwczovL2Rldi16YWU3cWd2bjMyeG15dTNnLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9kZXYtemFlN3Fndm4zMnhteXUzZy51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzI4Mzk0Njg0LCJleHAiOjE3Mjg0ODEwODQsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgcmVhZDpjdXJyZW50X3VzZXIiLCJhenAiOiJPdTVIeW9ueTNtbVdQWTRHQ0xuM1Z4WThtTEg5SDFqQSJ9.IcWlHh95YgEIKSDRKXQB1CU-6G4Onk9_qhpcJLviBtUsxcNJSP1zBdNyOm722F1Di_n99bKF0Rc7DNWSia0nUH0ZIncU77pDSpq5wGGqG8lr4EVP2Z9Pz5iyvmoUUpv0euuEy71WRk8Cmxxe5yTjy7Ms6d-E6FD9RLXIOeam9RxiJ_sLiA6tQesndPJd00MIqK4TKoRFd_F8iMP1I1zst7nhMGjVHbLZkcVNJNKik_kWLASJ21mz_FtinVFfCJQWqJGyTqkg6cvaWxLlR2c8i8X4O-ZZAyTf2sSceS3CGCu4FfyNaOKNhSjjiZBOHvVRmMkPiJbE9CYUx8GkBtZb1g';

    // Check the user status from Auth0's observable
    return this.auth.user$.pipe(
      take(1),  // Take the current user value and unsubscribe immediately after
      switchMap(user => {
        if (token && user) {
          // Clone the request and add the authorization header
          const clonedRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });

          // Proceed with the API request
          return next.handle(clonedRequest).pipe(
            catchError(err => {
              // Handle errors for API requests
              console.error('Request error:', err);
              return throwError(() => new Error(err));
            })
          );
        } else {
          // If no valid token or user, log out and redirect to login
          console.error('No valid token or user');
          // Commenting out logout and navigation as requested:
          // this.auth.logout();
          // this.router.navigate(['/login']);
          return throwError(() => new Error('No valid token or user'));
        }
      }),
      catchError(err => {
        // Handle any errors during user check
        console.error('Error during user check:', err);
        return throwError(() => new Error(err));
      })
    );
  }

  // The checkUserStatus function remains optional based on what you'd like to add here
  checkUserStatus(token: string, userId: string): Observable<any> {
    const managementApiUrl = `https://dev-zae7qgvn32xmyu3g.us.auth0.com/api/v2/users/${userId}`;

    return this.http.get(managementApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      switchMap((userData: any) => {
        if (userData.blocked) {
          console.warn('User is blocked in Auth0.');
          // Commented out logout as requested:
          // this.auth.logout();  
          throw new Error('User is blocked');
        }
        return userData;  // Return userData if user is active
      }),
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          console.error('Token expired or invalid:', err);
          // Commented out logout as requested:
          // this.auth.logout();
          throw new Error('Token expired or invalid');
        } else if (err.status === 404) {
          console.error('User not found in Auth0.');
          // Commented out logout as requested:
          // this.auth.logout();
          throw new Error('User not found');
        } else {
          console.error('Error retrieving user status from Auth0:', err);
          throw new Error('Error retrieving user status');
        }
      })
    );
  }
}
