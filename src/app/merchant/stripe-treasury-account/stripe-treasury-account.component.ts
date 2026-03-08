import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { MerchantListDto } from 'src/app/Models/merchant.model';
import { RecipientsList } from 'src/app/Models/recipients.model';
import { AccountDetails, TransactionHistory } from 'src/app/Models/treasury.model';
import { MerchantTreasuryService } from './../../core/merchant-treasury.service'
import * as moment from "moment";
import { UserRoleEnum } from 'src/app/Models/user.model';
import { SecurityService } from 'src/app/core/security.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'
// import { isInteger, toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { MerchantService } from 'src/app/core/merchant.service';
import { AppStateService } from 'src/app/core/app-state.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from 'src/environments/environment';

@UntilDestroy()

@Component({
  selector: 'app-stripe-treasury-account',
  templateUrl: './stripe-treasury-account.component.html',
  styleUrls: ['./stripe-treasury-account.component.scss']
})
export class StripeTreasuryAccountComponent implements OnInit {
  @Input() merchantDto = new MerchantListDto();
  @Input() gettingMerchantDetail: boolean;
  @Input() merchantId: string;
  @Input() selectedTab: string;
  firstTimePin: boolean = true
  userRoleType: UserRoleEnum;
  @Output() triggerChangeParent = new EventEmitter<any>();
  @ViewChild('registerNumber') registerNumber: ModalDirective;
  @ViewChild('sendMoney') sendMoney: ModalDirective;
  @ViewChild('Addrecipients') Addrecipients: ModalDirective;
  @ViewChild('Managerecipients') Managerecipients: ModalDirective;
  allTransactions: TransactionHistory[] = []
  accountDetails = new AccountDetails()
  cardDetails: any = []
  showFinance: boolean = false
  gettingTransactions = false
  gettingrecipients = false
  enterPin: boolean = false
  smsPin: string = ""
  smsPin2: string = ""
  otpPhone1: string = ""
  otpPhone2: string = ""
  phoneNumber: string = ""
  changePhoneNumber: boolean = false;
  showmainloader: boolean = true
  amount!: number
  routingNumber: string = ""
  accountNumber: string = ""
  accountName: string = ""
  externalAccountId: string = ''
  sendingMoney: boolean = false;
  Addingrecipients: boolean = true;
  note: string = ""
  name: string = ''
  recipients: RecipientsList[] = []
  selected_recipients: string = ''
  recipient_id: string = ''
  default_for_currency: boolean = true
  has_treasury_edit_access: number = 0
  constructor(private merchantService: MerchantService, private toaster: ToastrService, private activatedRoute: ActivatedRoute, private securityService: SecurityService, private merchantTreasuryService: MerchantTreasuryService, private appState: AppStateService,) { }
  ngOnInit(): void {
    this.merchantId = this.appState.currentMerchant;
    this.userRoleType = this.securityService.securityObject.user.role;
    this.subscribeAppState()
    this.GetMerchantDetail()
    this.getTransactionHistory()
    this.getAccountDetails()


  }
  GetMerchantDetail() {
    this.merchantService.GetMerchantById(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;



    }, (err) => {
      this.toaster.error(err.message);
    })
  }
  subscribeAppState() {

    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.showmainloader = true
      console.log("wallet subscribeAppState")
      this.merchantId = merchntId;
      this.GetMerchantDetail()
      this.getTransactionHistory()
      this.getAccountDetails()

    })

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedTab == "treasury" && this.merchantDto.stripeAccountId) {
      // this.showmainloader = true
      console.log("wallet ngOnChanges")
      this.getAccountDetails()

    }
  }
  select_recipient_for_sending_money(value: any) {


    this.accountNumber = value.last4
    this.routingNumber = value.routing_number
    this.externalAccountId = value.id

  }

  verifyingPhone: boolean = false
  sendMoney_btn() {
    this.get_recipients();
    this.sendMoney.show();

  }
  sendMoneyApi() {
    this.merchantTreasuryService.sendMoneyApi(this.merchantId, {
      "amount": this.amount,
      "routingNumber": this.routingNumber,
      "accountNumber": this.accountNumber,
      "name": this.accountName,
      "note": this.note,
      "otp": this.smsPin
    }).subscribe((data: any) => {
      this.toaster.success(data.message);

      this.sendMoney.hide()
      this.getTransactionHistory()
      this.getAccountDetails()
    }, (err) => {
      this.verifyingPhone = false;
      this.toaster.error(err.error.message);
    })
  }
  sendMoneyApi_torecipient() {
    this.merchantTreasuryService.sendMoneyApi_ToRecipient(this.merchantId, {
      "externalAccountId": this.externalAccountId,
      "amount": this.amount,
      "otp": this.smsPin,
      "note": this.note
    }).subscribe((data: any) => {
      this.toaster.success(data.message);

      this.sendMoney.hide()
      this.getTransactionHistory()
      this.getAccountDetails()
    }, (err) => {
      this.verifyingPhone = false;
      this.toaster.error(err.error.message);
    })
  }
  AddrecipientsApi() {


    this.merchantTreasuryService.AddRecipientsApi(this.merchantId, {
      "accountHolderName": this.name,
      "routingNumber": this.routingNumber,
      "accountNumber": this.accountNumber,
      "otp": this.smsPin,
      "default": this.default_for_currency

    }).subscribe((data: any) => {

      this.toaster.success(data.message);
      this.Addrecipients.hide()

    }, (err) => {
      this.verifyingPhone = false;
      this.toaster.error(err.error.message);
    })
  }
  ManagerecipientsApi() {


    this.get_recipients();
    this.Managerecipients.show()


  }

  get_recipients() {
    this.gettingrecipients = true
    this.merchantTreasuryService.ManageRecipientsApi(this.merchantId).subscribe((data: any) => {

      this.recipients = data

      this.gettingrecipients = false
      // return Promise.resolve('yes');


    }, (err) => {
      this.verifyingPhone = false;
      this.toaster.error(err.error.message);
    })
  }
  del_recipients(id) {


    Swal.fire({
      title: 'Are you sure that you want to delete this recipient?',
      text: "OTP",
      icon: 'warning',
      input: "text",
      inputPlaceholder: "Enter OTP here",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete'
    }).then((result) => {
      if (result.isConfirmed) {



        this.merchantTreasuryService.remove_RecipientsApi(this.merchantId, {
          "externalAccountId": id,
          "otp": result.value

        }).subscribe((data: any) => {

          this.toaster.success(data.message);
          // this.Addrecipients.hide()

        }, (err) => {
          this.verifyingPhone = false;
          this.toaster.error(err.error.message);
        })


      }
    })



  }



  sendPin() {
    this.enterPin = true;
    this.verifyingPhone = true
    if (!this.changePhoneNumber) {
      this.merchantTreasuryService.addTrasuaryAuthPhone(this.merchantId, { "phone": this.phoneNumber }).subscribe((data: any) => {
        this.resendPin()
      }, (err) => {
        this.verifyingPhone = false;
        this.toaster.error(err.error.message);
      })
    }
    else {
      this.requestforPhoneUpdate()
    }
  }
  requestforPhoneUpdate() {
    this.merchantTreasuryService.requestforPhoneUpdate(this.merchantId, { "newPhone": this.phoneNumber }).subscribe((data: any) => {

      this.enterPin = true
      this.verifyingPhone = false;
      this.otpPhone1 = data.data.otpPhone1
      this.otpPhone2 = data.data.otpPhone2
    }, (err) => {
      this.verifyingPhone = false;
      this.toaster.error(err.error.message);
    })
  }
  resendPin() {

    if (!this.changePhoneNumber) {
      this.verifyingPhone = true
      this.merchantTreasuryService.sendTrasuaryAuthOtp(this.merchantId).subscribe((data: any) => {
        this.verifyingPhone = false
        this.toaster.success("SMS has been sent on your phone number")
      }, (err) => {
        this.verifyingPhone = false;
        this.toaster.error(err.error.message);
      })
    } else {
      this.requestforPhoneUpdate()
    }

  }
  validatePin() {
    if (!this.changePhoneNumber) {
      this.verifyingPhone = true
      this.merchantTreasuryService.validteTrasuaryAuthPhone(this.merchantId, { "otp": this.smsPin }).subscribe((data: any) => {
        this.verifyingPhone = false
        this.toaster.success("Phone Number added successfully")
        this.triggerChangeParent.emit()
        this.registerNumber.hide()
        this.smsPin = ""
        this.enterPin = false
      }, (err) => {
        this.verifyingPhone = false;
        this.toaster.error(err.error.message);
      })
    } else {

      this.verifyingPhone = true

      this.merchantTreasuryService.updateTrasuaryuAthPhone(this.merchantId, { "otpOld": this.smsPin, "otpNew": this.smsPin2, }).subscribe((data: any) => {

        this.verifyingPhone = false
        this.toaster.success("Phone updated added successfully")
        this.registerNumber.hide()
        this.triggerChangeParent.emit()
        this.smsPin = ""
        this.smsPin2 = ""

        this.enterPin = false
      }, (err) => {
        this.verifyingPhone = false;
        this.toaster.error(err.error.message);
      })

    }


  }

  expandtable: { expandtable: boolean, idx: number }[] = [];
  onChangeExpandtable(idx) {
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }

  getTransactionHistory() {
    if (this.accountDetails.restricted_features && this.accountDetails.restricted_features.length == 0) {

      this.gettingTransactions = true

      this.merchantTreasuryService.getAllTransactions(this.merchantId).subscribe((data: any) => {
        this.gettingTransactions = false

        this.allTransactions = data.data
        // for mobile view
        this.expandtable = new Array(this.allTransactions.length).fill({ expandtable: false, idx: 0 });
        this.expandtable = this.expandtable.map((item, idx) => {
          return {
            ...item,
            idx: idx
          }
        })


      }, (err) => {
        this.gettingTransactions = false;
        this.toaster.error(err.error.message);
      })
    }

  }
  gettingAccountDetails: boolean = false
  getAccountDetails() {
    this.gettingAccountDetails = true
    this.merchantTreasuryService.getAccountDetails(this.merchantId).subscribe((data: any) => {
      this.gettingAccountDetails = false
      this.accountDetails = data
      this.has_treasury_edit_access = this.accountDetails.has_treasury_edit_access
      this.showmainloader = false


      this.getTransactionHistory()
      //this.getIssuedCards()



    }, (err) => {

      this.gettingAccountDetails = false;
      this.showmainloader = false
      this.toaster.error(err.error.message);
    })

  }
  addTreasuryCapability() {
    this.gettingAccountDetails = true
    this.merchantTreasuryService.addTreasuryFeatures(this.merchantId).subscribe((data: any) => {
      this.merchantTreasuryService.createFinancialAccount(this.merchantId).subscribe((data: any) => {
        this.getAccountDetails()
      }, (err) => {
        this.gettingAccountDetails = false;
        this.toaster.error(err.error.message);
      })
    }, (err) => {
      this.gettingAccountDetails = false;
      this.toaster.error(err.error.message);
    })

  }
  getIssuedCards() {
    this.gettingAccountDetails = true
    this.merchantTreasuryService.getIssuedCards(this.merchantId).subscribe((data: any) => {
      this.gettingAccountDetails = false
      this.cardDetails = data.data



    }, (err) => {
      this.gettingAccountDetails = false;
      this.toaster.error(err.error.message);
    })

  }
  getTime(value) {
    return moment.unix(value).format('dddd, MMMM Do, YYYY h:mm:ss A')
  }
  get stripeDashboardUrl(): string {
    return `${environment.stripeurl}${this.merchantDto.stripeAccountId}`;
  }

}
