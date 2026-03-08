import { UserDto, UserRoleEnum, UserStatusEnum } from 'src/app/Models/user.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { UserService } from 'src/app/core/user.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  UserDtoObj = new UserDto();
  userRoleEnum = UserRoleEnum;
  userRoleType: UserRoleEnum;
  userRoleEnumArr = this.filterData.getEnumAsList(UserRoleEnum);
  gettingUser: boolean;
  changePassword: boolean = false;
  savingUser: boolean;
  constructor(private translocoService: TranslocoService, private toaster: ToastrService, private securityService: SecurityService, private filterData: FilterDataService,
    private router: Router, private userService: UserService, private merchantService: MerchantService, private appUi: AppUiService) { }

  ngOnInit(): void {
    this.userRoleType = this.securityService.securityObject.user.role;
    this.GetUser();
  }
  GetUser = () => {
    // this.deleteDefaultCPTCharge(data);
    this.gettingUser = true;
    // this.UserDtoObj.userStatus = UserStatusEnum.Active;
    this.userService.GetUser(this.securityService.securityObject.user.id, this.securityService.securityObject.token).subscribe((data: any) => {
      // this.UsersList = data;
      this.UserDtoObj = data;
      this.gettingUser = false;
    }, (err) => {
      this.gettingUser = false;
      this.toaster.error(err.message);
    })
  };
  UpdateUserData() {
    this.savingUser = true;
    this.UserDtoObj.userStatus = UserStatusEnum.Active;
    this.userService.UpdateUser(this.securityService.securityObject.token, this.UserDtoObj).subscribe((data: any) => {
      // this.UsersList = data;
      this.changePassword = false;
      this.toaster.success('Data updated successfully');
      this.savingUser = false;
    }, (err) => {
      this.savingUser = false;
      // this.toaster.error(err.message);
      this.toaster.error('Error while updating user');
    })
  }
  getStatusTranslation(rolename): string {
    // Assuming you have translations for each enum value in your language files
    let name = ''
    this.translocoService.selectTranslate('Roles.' + rolename).subscribe(translation => {
      name = translation;
    });
    return name
  }
}
