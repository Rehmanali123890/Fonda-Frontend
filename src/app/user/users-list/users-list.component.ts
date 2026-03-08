import { AppUiService } from './../../core/app-ui.service';
import { MerchantService } from './../../core/merchant.service';
import { FilterDataService } from './../../core/filter-data.service';
import { UserDto, UserRoleEnum, UserStatusEnum } from './../../Models/user.model';
import { UserService } from './../../core/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from 'src/app/core/security.service';
import { AssignMerchantUserDto, MerchantListDto } from 'src/app/Models/merchant.model';
import { LazyModalDto } from 'src/app/Models/app.model';
import { AppStateService } from 'src/app/core/app-state.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslocoService } from '@ngneat/transloco';
@UntilDestroy()
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  gettingUsers = true;
  selecetedTab: number = 1
  usersList: UserDto[];
  userRoleType: UserRoleEnum;
  UserDtoObj = new UserDto();
  userStatusEnum = UserStatusEnum;
  userRoleEnum = UserRoleEnum;
  userRoleEnumArr = this.filterData.getEnumAsList(UserRoleEnum);
  savingUser: boolean;
  currentUserId = this.securityService.securityObject.user.id
  assignMUDto = new AssignMerchantUserDto();
  gettingMerchants: boolean;
  MerchantsList: MerchantListDto[] = [];
  selectedMerchantId: string;
  deletingUser: boolean;
  changePassword: boolean;
  password: string;
  fieldTextType: boolean;
  busyLoadingData: boolean = false;
  filteredUserRoleEnumArr = [];
  isallowed: boolean = false
  constructor(private translocoService: TranslocoService, private toaster: ToastrService, private securityService: SecurityService, private filterData: FilterDataService,
    private router: Router, private merchantservice: MerchantService, private userService: UserService, private appState: AppStateService, private merchantService: MerchantService, private appUi: AppUiService) { }

  ngOnInit(): void {
    this.selectedMerchantId = this.appState.currentMerchant;
    this.setUserRoleOptions()

    this.GetUsersList();
    this.subscribeAppState();


  }
  setUserRoleOptions() {
    console.log("this.userRoleEnumArr ", this.userRoleEnumArr)
    const userEmail = this.securityService.securityObject.user.email;
    if (userEmail === 'prem@mifonda.io' || userEmail === 'daniel@mifonda.io') {
      this.isallowed = true
      this.filteredUserRoleEnumArr = this.userRoleEnumArr; // Show all options
    }
    else {
      // Show only two options
      this.filteredUserRoleEnumArr = this.userRoleEnumArr.filter(
        item => item.value === 3 || item.value === 4
      );
    }
    this.userRoleType = this.securityService.securityObject.user.role;
    if (this.userRoleType == 3 || this.userRoleType == 4) {
      this.filteredUserRoleEnumArr = this.filteredUserRoleEnumArr.filter(x => x.value == 4)
    }
  }
  onScroll(): void {
    if (this.busyLoadingData) return;
    this.busyLoadingData = true
    this.gettingUsers = true;

    this.userService.GetUsers(this.securityService.securityObject.token, this.userRoleType, this.selectedMerchantId, this.usersList.length, 100).subscribe((data: UserDto[]) => {
      this.usersList.push(...data)
      if (data.length == 0) {
        this.toaster.warning('No more results.');
      }
      // this.usersList = this.usersList.filter(x => x.userStatus === UserStatusEnum.Active);
      this.gettingUsers = false;
      this.busyLoadingData = false;
    }, (err) => {
      console.log(err)
      this.gettingUsers = false;
      this.toaster.error(err.message);
      this.busyLoadingData = false;


    })
  }
  subscribeAppState() {
    this.selectedMerchantId = this.appState.currentMerchant;
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.selectedMerchantId = merchntId;
      this.GetUsersList();
    })
  }
  expandtable: { expandtable: boolean, idx: number }[] = [];
  onChangeExpandtable(idx) {
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }
  GetUsersList() {

    this.gettingUsers = true;
    this.userService.GetUsers(this.securityService.securityObject.token, this.userRoleType, this.selectedMerchantId, 0, 100).subscribe((data: UserDto[]) => {
      this.usersList = data;
      // this.usersList = this.usersList.filter(x => x.userStatus === UserStatusEnum.Active);
      this.gettingUsers = false;
      // for mobile view
      this.expandtable = new Array(this.usersList.length).fill({ expandtable: false, idx: 0 });
      this.expandtable = this.expandtable.map((item, idx) => {
        return {
          ...item,
          idx: idx
        }
      })

    }, (err) => {
      console.log(err)
      this.gettingUsers = false;
      this.toaster.error(err.message);

    })
  }
  openEditUserModal(modal: ModalDirective, item: UserDto) {
    Object.assign(this.UserDtoObj, item);
    this.changePassword = false;
    modal.show();
  }
  resetObj() {
    this.UserDtoObj = new UserDto();
  }
  SaveUserData(modal: ModalDirective) {
    this.savingUser = true;
    // this.UserDtoObj.userStatus = UserStatusEnum.Active;
    this.userService.AddUser(this.securityService.securityObject.token, this.UserDtoObj).subscribe((data: any) => {
      // this.UsersList = data;
      if (this.userRoleType == 3 || this.userRoleType == 4) {
        this.assignUserToMerchant(data.id)
      }
      modal.hide();
      this.toaster.success('Data saved successfully');
      this.GetUsersList();
      this.savingUser = false;
    }, (err) => {
      this.savingUser = false;
      this.toaster.error(err.error.message);
      //this.toaster.error('Error while adding user');
    })
  }
  assignUserToMerchant(userId) {
    this.assignMUDto.userid = userId
    this.assignMUDto.token = this.securityService.securityObject.token;
    this.merchantservice.AssignMerchantUSer(this.selectedMerchantId, this.assignMUDto).subscribe((data: any) => {
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
  UpdateUserData(modal: ModalDirective) {
    this.savingUser = true;
    // this.UserDtoObj.userStatus = UserStatusEnum.Active;
    this.userService.UpdateUser(this.securityService.securityObject.token, this.UserDtoObj).subscribe((data: any) => {
      // this.UsersList = data;
      modal.hide();
      this.toaster.success('Data updated successfully');
      this.GetUsersList();
      this.savingUser = false;
    }, (err) => {
      this.savingUser = false;
      // this.toaster.error(err.message);
      this.toaster.error('Error while updating user');
    })
  }
  ConfirmDelete(item: UserDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Delete User";
    modalDto.Text = "Are you sure you want to delete the user permanently";
    modalDto.callBack = this.callBack;
    modalDto.data = item;
    this.appUi.openLazyConfrimModal(modalDto);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  callBack = (data: any) => {
    // this.deleteDefaultCPTCharge(data);
    this.deletingUser = true;
    // this.UserDtoObj.userStatus = UserStatusEnum.Active;
    this.userService.DeleteUser(data.id, this.securityService.securityObject.token).subscribe((data: any) => {
      // this.UsersList = data;
      this.toaster.success('Record deleted successfully');
      this.GetUsersList();
      this.deletingUser = false;
    }, (err) => {
      this.deletingUser = false;
      this.toaster.error(err.message);
    })
  };
  getStatusTranslation(rolename): string {
    // Assuming you have translations for each enum value in your language files
    let name = ''
    this.translocoService.selectTranslate('Roles.' + rolename).subscribe(translation => {
      name = translation;
    });
    return name
  }

}
