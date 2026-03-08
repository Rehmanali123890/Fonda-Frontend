import { SecurityService } from './../../core/security.service';
import { Component, OnInit } from '@angular/core';
import { UserRoleEnum } from 'src/app/Models/user.model';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  userRoleType: UserRoleEnum;
  UserRoleEnum = UserRoleEnum;

  constructor(private securityService: SecurityService) {
    this.userRoleType = securityService.securityObject.user.role;
   }

  ngOnInit(): void {
  }

}
