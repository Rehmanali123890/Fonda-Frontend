import { AppUiService } from './../../core/app-ui.service';
import { UserStatusEnum } from './../../Models/user.model';
import { UserService } from 'src/app/core/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { AssignMerchantUserDto, MerchantListDto, MerchantStatusEnum, MerchantUserListDto } from 'src/app/Models/merchant.model';
import { UserDto, UserRoleEnum } from 'src/app/Models/user.model';
import { LazyModalDto } from 'src/app/Models/app.model';

@Component({
  selector: 'app-merchant-users',
  templateUrl: './merchant-users.component.html',
  styleUrls: ['./merchant-users.component.scss']
})
export class MerchantUsersComponent implements OnInit {
  gettingMerchants: boolean;
  MerchantsList: MerchantListDto[];
  merchantStatusEnum = MerchantStatusEnum;
  userStatusEnum = UserStatusEnum;
  userRoleEnum = UserRoleEnum;
  merchantId: string;
  gettingMerchantUsers = true;
  MerchantUsersList: MerchantUserListDto[];
  assignMUDto = new AssignMerchantUserDto();
  assigningUsers: boolean;
  gettingUsers: boolean;
  usersList: UserDto[];
  unAssigningUser: boolean;
  userRoleType: UserRoleEnum;
  userRoleEnumVal = UserRoleEnum;
  canAssignUsers: boolean;

  constructor(private toaster: ToastrService, private securityService: SecurityService, private activatedRoute: ActivatedRoute,
    private router: Router, private merchantservice: MerchantService, private userService: UserService, private appUi: AppUiService) { }

  ngOnInit(): void {
    this.merchantId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userRoleType = this.securityService.securityObject.user.role;
    if (this.userRoleType === UserRoleEnum['Dashboard Admin']) {
      this.canAssignUsers = true;
    } else {
      this.canAssignUsers = false;
    }
    this.GetMerchantUsersList();
    this.GetUsersList();
  }
  GetMerchantsList() {
    this.gettingMerchants = true;
    this.merchantservice.GetMerchants(this.securityService.securityObject.token).subscribe((data: MerchantListDto[]) => {
      this.MerchantsList = data;

      this.gettingMerchants = false;
    }, (err) => {
      this.gettingMerchants = false;
      this.toaster.error(err.message);
    })
  }
  expandtable: { expandtable: boolean, idx: number }[] = [];
  onChangeExpandtable(idx) {
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }
  GetMerchantUsersList() {
    this.gettingMerchantUsers = true;
    this.merchantservice.GetMerchantUsers(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantUserListDto[]) => {
      this.MerchantUsersList = data;
      this.gettingMerchantUsers = false;
      // for mobile view
      this.expandtable = new Array(this.MerchantUsersList.length).fill({ expandtable: false, idx: 0 });
      this.expandtable = this.expandtable.map((item, idx) => {
        return {
          ...item,
          idx: idx
        }
      })
    }, (err) => {
      this.gettingMerchantUsers = false;
      this.toaster.error(err.message);
    })
  }
  resetObj() {
    this.assignMUDto = new AssignMerchantUserDto();

  }
  GetUsersList() {
    this.gettingUsers = true;
    this.userService.GetUsers(this.securityService.securityObject.token).subscribe((data: UserDto[]) => {
      this.usersList = data;
      this.gettingUsers = false;
    }, (err) => {
      this.gettingUsers = false;
      this.toaster.error(err.message);
    })
  }
  AssignMerchantUser(modal: ModalDirective) {
    this.assigningUsers = true;
    this.assignMUDto.token = this.securityService.securityObject.token;
    this.merchantservice.AssignMerchantUSer(this.merchantId, this.assignMUDto).subscribe((data: any) => {
      modal.hide();
      this.GetMerchantUsersList();
      this.assigningUsers = false;
    }, (err) => {
      this.assigningUsers = false;
      this.toaster.error(err.error.message);
    })
  }
  ConfirmUnassign(item: MerchantUserListDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Un Assign";
    modalDto.Text = "Are you sure that you want to permanently un assign this user from merchant.";
    modalDto.callBack = this.callBack;
    modalDto.data = item;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    // this.deleteDefaultCPTCharge(data);
    this.unAssigningUser = true;
    // this.addEditCustomerDto.CustomerStatus = CustomerStatusEnum.Active;
    this.merchantservice.UnAssignMerchantUSer(this.merchantId, data).subscribe((data: any) => {
      // this.CustomersList = data;
      this.toaster.success('User unassigned successfully');
      this.GetMerchantUsersList();
      this.unAssigningUser = false;
    }, (err) => {
      this.unAssigningUser = false;
      this.toaster.error(err.message);
    })
  };
}

