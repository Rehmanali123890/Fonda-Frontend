import { MySocketService } from './../../core/my-socket.service';
import { SecurityService } from './../../core/security.service';
import { LoginDto } from './../../Models/security.model';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import { ToastService } from 'ng-uikit-pro-standard';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  password: string
  processing: boolean;
  iframeUrl: SafeResourceUrl;

  constructor(private toaster: ToastrService, mySocket: MySocketService, private activatedRoute: ActivatedRoute, private securityService: SecurityService, private router: Router, private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
    // Sanitize the iframe URL
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.iframeUrl);
  }
  Reset() {
    this.processing = true;
    this.securityService.ResetPassword({
      "resetToken": this.activatedRoute.snapshot.queryParams['resetToken'],
      "password": this.password,
    }).subscribe(async (data) => {
      this.processing = false;
      this.toaster.success('Your password has been reset successfully')
      const compl = await this.router.navigateByUrl('/accounts/login');
    }, (err) => {
      this.processing = false;
      this.toaster.error(err?.error?.message || 'username/email is incorrect');
    })
  }

  isPasswordVisible = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
