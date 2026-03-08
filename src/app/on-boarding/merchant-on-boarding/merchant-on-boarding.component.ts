import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { ClonerService } from 'src/app/core/DataServices/cloner.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { AddEditOpeningHoursDto, CustomOpeneingHourForUi, MerchantListDto, OpeninghourDto } from 'src/app/Models/merchant.model';
import { UserRoleEnum } from 'src/app/Models/user.model';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { TranslocoService } from '@ngneat/transloco';
declare let Stripe: any
// declare let elements: any;


@Component({
  selector: 'app-merchant-on-boarding',
  templateUrl: './merchant-on-boarding.component.html',
  styleUrls: ['./merchant-on-boarding.component.scss']
})
export class MerchantOnBoardingComponent implements OnInit {
  checkbox: boolean = false;
  card: any
  link: any
  onBoardingForm: FormGroup;
  location: Location;
  gettingMerchants: boolean;
  showMessage: boolean = false;
  MerchantsList: MerchantListDto[];
  @ViewChild('AlreadyModal') AlreadyModal: ModalDirective;
  merchantDto = new MerchantListDto();
  merchantId: string;
  savingData: boolean = false
  currentDate: string
  currentonboardingdate: string
  processingPayment: boolean = false
  processingPaymentSpinner: boolean = false
  hideBackButton: boolean = false
  nameOnCreditCard: string;
  MerchantHoursInfoList: OpeninghourDto[];
  savingHoursInfo: boolean;
  addEditHoursObj = new AddEditOpeningHoursDto();
  userRoleType: UserRoleEnum;
  merchantsDefaultData: CustomOpeneingHourForUi[];
  gettingMerchantDetail: boolean;
  timeArr = ['12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM',
    '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM']
  timeArry2 = [
    '12:00 AM', '12:15 AM', '12:30 AM', '12:45 AM', '01:00 AM', '01:15 AM', '01:30 AM', '01:45 AM', '02:00 AM', '02:15 AM',
    '02:30 AM', '02:45 AM', '03:00 AM', '03:15 AM', '03:30 AM', '03:45 AM', '04:00 AM', '04:15 AM', '04:30 AM', '04:45 AM',
    '05:00 AM', '05:15 AM', '05:30 AM', '05:45 AM', '06:00 AM', '06:15 AM', '06:30 AM', '06:45 AM', '07:00 AM', '07:15 AM',
    '07:30 AM', '07:45 AM', '08:00 AM', '08:15 AM', '08:30 AM', '08:45 AM', '09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM',
    '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM',
    '12:30 PM', '12:45 PM', '01:00 PM', '01:15 PM', '01:30 PM', '01:45 PM', '02:00 PM', '02:15 PM', '02:30 PM', '02:45 PM',
    '03:00 PM', '03:15 PM', '03:30 PM', '03:45 PM', '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM', '05:00 PM', '05:15 PM',
    '05:30 PM', '05:45 PM', '06:00 PM', '06:15 PM', '06:30 PM', '06:45 PM', '07:00 PM', '07:15 PM', '07:30 PM', '07:45 PM',
    '08:00 PM', '08:15 PM', '08:30 PM', '08:45 PM', '09:00 PM', '09:15 PM', '09:30 PM', '09:45 PM', '10:00 PM', '10:15 PM',
    '10:30 PM', '10:45 PM', '11:00 PM', '11:15 PM', '11:30 PM', '11:45 PM'
  ]
  constructor(private toaster: ToastrService, private translocoService: TranslocoService, private securityService: SecurityService, private merchantservice: MerchantService, private clonerService: ClonerService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder,) { }
  GetMerchantDetail() {
    this.gettingMerchantDetail = true;
    this.merchantservice.GetMerchantByIdwithoutToken(this.merchantId).subscribe((data: MerchantListDto) => {
      //this.merchantDto = data;
      Object.assign(this.merchantDto, data)
      this.gettingMerchantDetail = false;
      if (this.merchantDto.onBoardingCompleted) {
        this.AlreadyModal.show()
      }
    }, (err) => {
      this.gettingMerchantDetail = false;
      this.toaster.error(err.error.message);
    })
  }
  GetMerchantHoursInfo() {
    this.gettingMerchants = true;
    this.merchantservice.GetMerchantHoursInfo(this.securityService.securityObject.token, this.merchantId).subscribe((data: OpeninghourDto[]) => {
      this.setHoursDefaultData();
      this.MerchantHoursInfoList = data;
      this.MerchantHoursInfoList.forEach((hourInfo) => {
        const existingDay = this.merchantsDefaultData.find(x => x.day === hourInfo.day);
        if (existingDay && !existingDay.id) {
          existingDay.id = hourInfo.id;
          existingDay.openTime = hourInfo.openTime;
          existingDay.closeTime = hourInfo.closeTime;
          existingDay.seqNo = hourInfo.seqNo;
          existingDay.closeForBusinessFlag = hourInfo.closeForBusinessFlag;
          // hourInfo.main = true;
        } else if (existingDay && existingDay.id) {
          const rIndex = this.merchantsDefaultData.indexOf(existingDay);
          this.AddAnotherValue(rIndex, hourInfo);
        }
      });
      this.gettingMerchants = false;
    }, (err) => {
      this.gettingMerchants = false;
      this.toaster.error(err.error.message);
    })
  }
  ngOnInit(): void {
    if (this.activatedRoute.snapshot.paramMap.get('merchant-id')) {
      this.merchantId = this.activatedRoute.snapshot.paramMap.get('merchant-id');
      this.GetMerchantDetail()
      this.GetMerchantHoursInfo()

    }
    const currentDate = new Date();
    const currentonboardingdate = new Date();
    // Get the next day by adding 1 to the current day
    currentDate.setDate(currentDate.getDate() + 1);
    this.currentDate = currentDate.toISOString().split('T')[0];
    this.currentonboardingdate = currentonboardingdate.toISOString().split('T')[0];


    this.merchantDto.timezone = 'US/Pacific'
    this.onBoardingForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      resturantName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dobContact: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      timezone: ['', Validators.required],
      saleTax: ['', Validators.required],
      businessWebsite: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      businessPhone: ['', Validators.required],
      businessAddress: ['', Validators.required],
      legalBusinessName: ['', Validators.required],
      einNumber: [''],
      bankAccountNum: ['', [Validators.maxLength(18), Validators.minLength(9)]],
      bankRoutingNum: ['', [Validators.maxLength(10)]],

      subscriptionTrialPeriod: ['', Validators.required],
      onboardingdate: ['', Validators.required],
      subscriptionStartDate: [''],
      subscriptionAmount: ['', Validators.required],
      RevenueProcessingFeePercent: ['', Validators.required],
      RevenueProcessingThreshold: ['', Validators.required],
      minimumLifetimeRevenue: [''],
      DownTimeThreshold: [''],
      Fonda_Share: ['']
    })

    this.setHoursDefaultData();
    this.MerchantHoursInfoList = this.merchantsDefaultData

  }



  setHoursDefaultData() {
    this.merchantsDefaultData = [
      { id: '', closeForBusinessFlag: false, day: 'Monday', main: true, seqNo: 1, openTime: '', closeTime: '' },
      { id: '', closeForBusinessFlag: false, day: 'Tuesday', main: true, seqNo: 2, openTime: '', closeTime: '' },
      { id: '', closeForBusinessFlag: false, day: 'Wednesday', main: true, seqNo: 3, openTime: '', closeTime: '' },
      { id: '', closeForBusinessFlag: false, day: 'Thursday', main: true, seqNo: 4, openTime: '', closeTime: '' },
      { id: '', closeForBusinessFlag: false, day: 'Friday', main: true, seqNo: 5, openTime: '', closeTime: '' },
      { id: '', closeForBusinessFlag: false, day: 'Saturday', main: true, seqNo: 6, openTime: '', closeTime: '' },
      { id: '', closeForBusinessFlag: false, day: 'Sunday', main: true, seqNo: 7, openTime: '', closeTime: '' },
    ];
  }
  DeleteHourForMerchant(day: CustomOpeneingHourForUi) {
    day.loading = true;
    var newObj = {};
    Object.assign(newObj, day);
    delete newObj['main'];
    delete newObj['loading'];
    this.addEditHoursObj.openinghour = newObj;
  }
  AddAnotherValue(index: number, dayObj: CustomOpeneingHourForUi, isNew?: boolean) {
    let newObj = {};
    if (dayObj.id && !isNew) {
      Object.assign(newObj, dayObj);
      newObj['main'] = false;
    } else {
      newObj = { id: '', day: dayObj.day, closeForBusinessFlag: false, main: false, seqNo: index, openTime: '', closeTime: '' };
    }
    const DayArr = this.merchantsDefaultData.filter(x => x.day === dayObj.day);
    if (DayArr && DayArr.length) {
      index = index + DayArr.length;

    } else {
      index = index + 1;
    }
    this.merchantsDefaultData.splice(index, 0, newObj);
    this.merchantsDefaultData.forEach((x, indexN) => {
      x.seqNo = indexN + 1;
    })
  }
  Removealue(index: number, dayObj: CustomOpeneingHourForUi) {
    this.merchantsDefaultData.splice(index, 1);
    this.merchantsDefaultData.forEach((x, indexN) => {
      x.seqNo = indexN + 1;
    })
    if (dayObj?.id) {
      this.DeleteHourForMerchant(dayObj);
    }
  }

  EditHourForMerchant(day: CustomOpeneingHourForUi) {
    day.loading = true;
    var newObj = {};
    Object.assign(newObj, day);
    delete newObj['main'];
    delete newObj['loading'];
    this.addEditHoursObj.openinghour = newObj;
  }
  getdayTranslation(day): string {

    let dayy = ''
    this.translocoService.selectTranslate('Hours.' + day).subscribe(translation => {
      dayy = translation;
    });
    return dayy
  }
  validateEmail() {
    return (
      this.onBoardingForm.get('email')?.valid ||
      this.onBoardingForm.get('email')?.pristine
    );
  }
  validateRestuName() {
    return (
      this.onBoardingForm.get('resturantName')?.valid ||
      this.onBoardingForm.get('resturantName')?.pristine
    );
  }
  validateFirstName() {
    return (
      this.onBoardingForm.get('firstName')?.valid ||
      this.onBoardingForm.get('firstName')?.pristine
    );
  }
  validateLasttName() {
    return (
      this.onBoardingForm.get('lastName')?.valid ||
      this.onBoardingForm.get('lastName')?.pristine
    );
  }
  validateDOB() {
    return (
      this.onBoardingForm.get('dobContact')?.valid ||
      this.onBoardingForm.get('dobContact')?.pristine
    );
  }
  validateCity() {
    return (
      this.onBoardingForm.get('city')?.valid ||
      this.onBoardingForm.get('city')?.pristine
    );
  }
  validateState() {
    return (
      this.onBoardingForm.get('state')?.valid ||
      this.onBoardingForm.get('state')?.pristine
    );
  }
  validateZipCode() {
    return (
      this.onBoardingForm.get('zipCode')?.valid ||
      this.onBoardingForm.get('zipCode')?.pristine
    );
  }
  validateTimezone() {
    return (
      this.onBoardingForm.get('timezone')?.valid ||
      this.onBoardingForm.get('timezone')?.pristine
    );
  }
  validateSalesTax() {
    return (
      this.onBoardingForm.get('saleTax')?.valid ||
      this.onBoardingForm.get('saleTax')?.pristine
    );
  }
  merchantBoardingInfo() {
    if (this.onBoardingForm.valid) {

      this.savingData = true
      this.merchantDto.openinghours = this.MerchantHoursInfoList
      // if (this.merchantId.length > 0) {

      //   document.getElementById("continue-step2").click()
      // } else {
      this.clonerService.saveMerchantOnBoardingInfo(this.securityService.securityObject.token, this.merchantDto).subscribe(
        (data: any) => {
          this.savingData = false
          this.toaster.success('Data saved successfully');
          Object.assign(this.merchantDto, data)
          this.merchantId = data.id
          // this.merchantDto = new MerchantListDto();
          // const win: Window = window;
          // // win.location = "https://github.com/";
          // win.location = "https://www.mifonda.io"
          alert("you can close this window now.")
          // document.getElementById("continue-step2").click()
        }, (err) => {
          this.savingData = false;
          this.toaster.error(err.error.message);
        }
      );
      // }

    } else {
      this.toaster.warning('Please fill the required fields')
    }
  }

  stripe: any;
  // elements: any;
  submitPaymant: any
  async loadPaymentIntent() {
    this.clonerService.getCardToken().subscribe((data: any) => {
      let clientSecret = data['client_secret']
      this.stripe = Stripe(environment.stripePublicKey, {
        betas: ["link_beta_3"],
        apiVersion: "2020-08-27;link_beta=v1",
      });
      const loader = 'auto';
      const appearance = { /* ... */ };
      const elements = this.stripe.elements({ clientSecret, loader, appearance });
      const linkAuthenticationElement = elements.create("linkAuthentication");
      const paymentElement = elements.create('payment', {
        defaultValues: {
          billingDetails: {
            name: this.merchantDto.firstName,
            phone: this.merchantDto.phone,
          },
        },
      });
      linkAuthenticationElement.mount("#link-authentication-element");
      paymentElement.mount("#payment-element");
      this.submitPaymant = () => {
        this.processingPayment = true
        this.processingPaymentSpinner = true

        this.stripe.confirmPayment({
          elements,
          redirect: "if_required",
          confirmParams: {
            return_url: window.location.href,
          }
        }).then((result) => {
          if (result.error) {
            this.processingPayment = false
            this.processingPaymentSpinner = false

            var errorElement = document.getElementById('card-errors');
            errorElement.style.display = 'block';
            errorElement.textContent = result.error.message;

          } else {
            if (result.paymentIntent.status === 'succeeded') {
              this.clonerService.completePaymentStripe(result.paymentIntent.id, this.merchantId).subscribe(() => {
                this.processingPayment = true
                this.showMessage = true;
                this.processingPaymentSpinner = false
                this.card.update({ disabled: true });
                this.hideBackButton = true;

              }, (err) => {
                this.toaster.error(err.error.message);
                this.processingPayment = false;
                this.processingPaymentSpinner = false

              })
            }
          }
        })


      }

    })




    // var elements = this.stripe.elements({
    //   fonts: [
    //     {
    //       cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
    //     },
    //   ],
    //   // Stripe's examples are localized to specific languages, but if
    //   // you wish to have Elements automatically detect your user's locale,
    //   // use `locale: 'auto'` instead.
    //   // locale: window.__exampleLocale
    // });

    // this.card = elements.create('card', {
    //   iconStyle: 'solid',
    //   hidePostalCode: true,
    //   style: {
    //     base: {
    //       iconColor: '#00a79d',
    //       color: '#000',
    //       fontWeight: 500,
    //       fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
    //       fontSize: '16px',
    //       fontSmoothing: 'antialiased',

    //       ':-webkit-autofill': {
    //         color: '#000',
    //       },
    //       '::placeholder': {
    //         color: '#000',
    //       },
    //     },
    //     invalid: {
    //       iconColor: '#FF0000',
    //       color: '#FF0000',
    //     },
    //   },
    // });
    // this.link = elements.create("linkAuthentication");
    // this.card.mount('#card');
    // this.link.mount("#link-authentication-element");
    // this.card.addEventListener('change', (event) => {
    //   var displayError = document.getElementById('card-errors');
    //   if (event.error) {
    //     displayError.style.display = 'block';
    //     displayError.textContent = event.error.message;
    //     this.processingPayment = true
    //   } else {
    //     displayError.style.display = 'none';
    //     displayError.textContent = '';
    //     this.processingPayment = false
    //   }
    // });
  }
  // submitPaymant() {


  //   // this.stripe.confirmCardPayment(data['client_secret'], {
  //   //   payment_method: {
  //   //     card: this.card,
  //   //     billing_details: {
  //   //       name: this.nameOnCreditCard
  //   //     }
  //   //   }
  //   // }).then((result) => {

  //   //   if (result.error) {
  //   //     this.processingPayment = false
  //   //     this.processingPaymentSpinner = false

  //   //     var errorElement = document.getElementById('card-errors');
  //   //     errorElement.style.display = 'block';
  //   //     errorElement.textContent = result.error.message;

  //   //   } else {
  //   //     if (result.paymentIntent.status === 'succeeded') {
  //   //       this.clonerService.completePaymentStripe(result.paymentIntent.id, this.merchantId).subscribe(() => {
  //   //         this.processingPayment = true
  //   //         this.showMessage = true;
  //   //         this.processingPaymentSpinner = false
  //   //         this.card.update({ disabled: true });
  //   //         this.hideBackButton = true;

  //   //       }, (err) => {
  //   //         this.toaster.error(err.error.message);
  //   //         this.processingPayment = false;
  //   //         this.processingPaymentSpinner = false

  //   //       })
  //   //     }
  //   //   }
  //   // });

  // }
  preventNegativeInput(event: KeyboardEvent, propertyName?: string) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    if (parseFloat(inputValue) < 0 || Object.is(parseFloat(inputValue), -0)) {

      this.merchantDto[propertyName] = 0;
      inputElement.value = ''; // Clear the input value if it's negative
      event.preventDefault(); // Prevent the negative input
    }
  }
  preventNegativeAndLessThanHunderedInput(event: KeyboardEvent, propertyName?: string) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    if (parseFloat(inputValue) < 0 || parseFloat(inputValue) > 100 || Object.is(parseFloat(inputValue), -0)) {
      this.merchantDto[propertyName] = 0;
      inputElement.value = ''; // Clear the input value if it's negative
      event.preventDefault(); // Prevent the negative input
    }
  }
  onToggleChange(isToggled: boolean) {
    const fieldsToToggle = ['minimumLifetimeRevenue', 'DownTimeThreshold'];

    fieldsToToggle.forEach(fieldName => {
      const formControl = this.onBoardingForm.get(fieldName);

      if (isToggled) {
        // Set the validator (required) when the toggle is ON
        formControl.setValidators([Validators.required]);
      } else {
        // Remove the validator when the toggle is OFF
        formControl.clearValidators();
      }

      // Update the form control's validity
      formControl.updateValueAndValidity();
    });
  }

}