import { MySocketService } from './../../core/my-socket.service';
import { SecurityService } from './../../core/security.service';
import { LoginDto } from './../../Models/security.model';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import { ToastService } from 'ng-uikit-pro-standard';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  email: string
  processing: boolean;
  iframeUrl: SafeResourceUrl;

  constructor(private toaster: ToastrService, mySocket: MySocketService, private securityService: SecurityService, private router: Router, private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
    // Sanitize the iframe URL
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.iframeUrl);
  }
  Reset() {
    this.processing = true;
    this.securityService.SendForgetPasswordLink({
      "email": this.email
    }).subscribe((data) => {
      this.processing = false;
      this.toaster.success('Kindly check your email for password reset link')

    }, (err) => {
      this.processing = false;
      this.toaster.error(err?.error?.message || 'username/email is incorrect');
    })
  }

  cancel() {
    this.router.navigateByUrl('/accounts/login');
  }
}
