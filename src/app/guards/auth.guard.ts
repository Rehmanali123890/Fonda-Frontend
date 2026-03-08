import { SecurityService } from './../core/security.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginDto } from '../Models/security.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private securityService: SecurityService, private router: Router, private toaster: ToastrService, private route: ActivatedRoute) {
  }
  Login(loginObj) {
    this.securityService.Login(loginObj).subscribe((data) => {
      this.router.navigateByUrl('/home/dashboard');
      return true
    }, (err) => {
      this.toaster.error(err?.error?.error || 'username or password is incorrect');
    })
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const claimType: string = next.data['claimType'];


    if (this.securityService.isLoggedIn()) {
      console.log("if");
      console.log("this.securityService.isLoggedIn")
      if (this.route.snapshot.queryParams['email'] && this.route.snapshot.queryParams['password']) {
        console.log("if if");
        // this.securityService.LogOut();
        let email = decodeURIComponent(this.route.snapshot.queryParams['email']);
        let password = decodeURIComponent(this.route.snapshot.queryParams['password']);
        this.Login({ email: email, password: password });
        return true;
      } else {
        console.log("if");
        return true;
      }
    } else {
      let params = new URL(document.location.toString()).searchParams;
      let email = params.get("email");
      let password = params.get("password");
      if (email && password) {
        this.Login({ email: email, password: password });
        return true;
      } else {
        this.router.navigate(['accounts'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    }
  }
}
