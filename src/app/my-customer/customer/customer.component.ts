import { Component } from '@angular/core';
import { AppUiService } from './../../core/app-ui.service';
import { CustomerDto, CustomerNewDto } from './../../Models/customer.model';
import { CustomerService } from './../../core/customer.service';
import { Router } from '@angular/router';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { MerchantListDto } from 'src/app/Models/merchant.model';
import { LazyModalDto } from 'src/app/Models/app.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppStateService } from 'src/app/core/app-state.service';
import { UserRoleEnum } from 'src/app/Models/user.model';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@ngneat/transloco';
import { DateTime } from 'luxon'; // Import Luxon



@UntilDestroy()
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
  merchantDto = new MerchantListDto();

  userRoleType: UserRoleEnum;
  gettingMerchants: boolean;
  MerchantsList: MerchantListDto[];
  selectedMerchantId: string;
  searchItemtoAssignoptionRef = '';
  gettingCustomers = true;
  CustomersList: CustomerNewDto[];
  addEditCustomerDto = new CustomerNewDto();
  savingCustomer: boolean;
  deletingCustomer: boolean;

  constructor(private toaster: ToastrService, private securityService: SecurityService, private router: Router, private appUi: AppUiService,
    private merchantservice: MerchantService, private appState: AppStateService, private filterDataService: FilterDataService,
    private customerService: CustomerService, private translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.userRoleType = this.securityService.securityObject.user.role;
    this.subscribeAppState();
    //this.GetMerchantsList();
    this.GetMerchantDetail()
    this.GetCustomersList()

  }
  subscribeAppState() {
    this.selectedMerchantId = this.appState.currentMerchant;
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.selectedMerchantId = merchntId;
      // this.toaster.success('Merchant changed');
      this.GetCustomersList();
      this.GetMerchantDetail()
    })
  }


  rfc2822ToIso(rfc2822Date: string): string {
    const date = new Date(rfc2822Date);
    return date.toISOString();
  }

  convertToPacificTime(dateString: string): string {
    const isoDateString = this.rfc2822ToIso(dateString);
    const dateTime = DateTime.fromISO(isoDateString, { zone: 'UTC' });
    if (!DateTime.local().setZone(this.merchantDto.timezone).isValid) {
      console.error('Invalid timezone:', this.merchantDto.timezone);
      return 'Invalid Timezone';
    }
    const pacificTime = dateTime.setZone(this.merchantDto.timezone);
    if (this.merchantDto.timezone !== undefined) {

      return pacificTime.toFormat('MM-dd-yyyy') + ` (${this.merchantDto.timezone})`;
    }
    else {
      return ""
    }
  }




  GetCustomersList(loadboolen: boolean = true) {
    this.gettingCustomers = loadboolen;
    this.customerService.GetCustomers(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: any[]) => {

      this.CustomersList = data.map((customer: any) => {
        const mappedCustomer: CustomerNewDto = {
          id: customer.id,
          merchantID: customer.merchantid,
          firstName: customer.firstname, // Map 'firstname' to 'firstName'
          lastName: customer.lastname,   // Map 'lastname' to 'lastName'
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          createdBy: customer.created_by,
          createdDatetime: customer.created_datetime,
          updatedBy: customer.updated_by,
          updatedDatetime: customer.updated_datetime,

          order_ratings: customer.order_ratings,
          service_ratings: customer.service_ratings,
          comments: customer.comments,
          utm_source: customer.utm_source
        };

        // Return the mapped customer
        return mappedCustomer;
      });
      // if (this.CustomersList && this.CustomersList.length) {
      //   this.selectedOrderId = this.CustomersList[0].id;
      //   this.GetOrderDetail();
      // }
      this.gettingCustomers = false;
    }, (err) => {
      this.gettingCustomers = false;
      this.toaster.error(err.message);
    })
  }
  openEditCustomerModal(modal: ModalDirective, item: CustomerNewDto) {
    Object.assign(this.addEditCustomerDto, item);
    modal.show();
  }
  resetObj() {
    this.addEditCustomerDto = new CustomerNewDto();
  }
  SaveCustomerData(modal: ModalDirective) {
    this.savingCustomer = true;
    // this.addEditCustomerDto.CustomerStatus = CustomerStatusEnum.Active;
    this.addEditCustomerDto.merchantID = this.selectedMerchantId;
    this.customerService.AddCustomer(this.securityService.securityObject.token, this.addEditCustomerDto).subscribe((data: any) => {
      // this.CustomersList = data;
      modal.hide();
      this.toaster.success('Data saved successfully');
      this.GetCustomersList();
      this.savingCustomer = false;
    }, (err) => {
      this.savingCustomer = false;
      this.toaster.error(err.message);
    })
  }
  UpdateCustomerData(modal: ModalDirective) {
    this.savingCustomer = true;
    // this.addEditCustomerDto.CustomerStatus = CustomerStatusEnum.Active;
    this.addEditCustomerDto.merchantID = this.selectedMerchantId;
    this.customerService.UpdateCustomer(this.securityService.securityObject.token, this.addEditCustomerDto).subscribe((data: any) => {
      // this.CustomersList = data;
      modal.hide();
      this.toaster.success('Data updated successfully');
      this.GetCustomersList();
      this.savingCustomer = false;
    }, (err) => {
      this.savingCustomer = false;
      this.toaster.error(err.message);
    })
  }
  ConfirmDelete(item: CustomerDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Delete Customer";
    modalDto.Text = "Are you sure that you want to permanently delete Customer.";
    modalDto.callBack = this.callBack;
    modalDto.data = item;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    // this.deleteDefaultCPTCharge(data);
    this.deletingCustomer = true;
    // this.addEditCustomerDto.CustomerStatus = CustomerStatusEnum.Active;
    this.customerService.DeleteCustomer(data.id, this.securityService.securityObject.token).subscribe((data: any) => {
      // this.CustomersList = data;
      this.toaster.success('Record deleted successfully');
      this.GetCustomersList(false);
      this.deletingCustomer = false;
    }, (err) => {
      this.deletingCustomer = false;
      this.toaster.error(err.message);
    })
  };

  GetMerchantDetail() {
    this.merchantservice.GetMerchantById(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;
      console.log(this.merchantDto.timezone)
      // Check if the language is already set from localStorage
      if (localStorage.getItem('lang')) {
        return; // Ignore API language
      }
      this.translocoService.setActiveLang(this.merchantDto.language);

    }, (err) => {
      this.toaster.error(err.message);
    })
  }

}
