import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppStateService } from 'src/app/core/app-state.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { MerchantListDto, MerchantSubscriptionPackege, StripeAccountStatus, SubscriptionFrequency, SubscriptionSplit, SubscriptionStatusEnum, SubscriptionType } from 'src/app/Models/merchant.model';
import * as moment from "moment";
import { SecurityService } from 'src/app/core/security.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@UntilDestroy()

@Component({
  selector: 'app-merchant-subscription-details',
  templateUrl: './merchant-subscription-details.component.html',
  styleUrls: ['./merchant-subscription-details.component.scss'],
  providers: [DatePipe],
})
export class MerchantSubscriptionDetailsComponent implements OnInit {
  @Input() merchantDto = new MerchantListDto();
  @Input() gettingMerchantDetail: boolean;
  @Input() merchantId: string;
  @Input() selectedTab: string;
  @Output() triggerChangeParent = new EventEmitter<any>();
  userSelectedSubscriptionDate: string = ""
  showDifferentDateMessage: boolean = false
  subcriptionRecordsList: SubscriptionType[] = [];
  SubscriptionSplitList: SubscriptionSplit[] = [];
  addbtn: boolean = true
  splitTotalAmount: number = 0
  splitDate: string
  splitAmount: number
  disable: boolean = true;
  showmainloader: boolean = true;
  enable: boolean = false;
  savingMerchant: boolean;
  explaination: string = "";
  waiveoffId: number;
  markPaidId: number;
  splitId: number;
  totalsubscriptionamount: number
  amountAndIdCheck = false;
  savingMerchantSubscription: boolean;
  savingWaiveOff: boolean = false
  inputFields: any[] = [];
  SubscriptionStatusEnum = SubscriptionStatusEnum;
  StripeAccountStatusEnum = StripeAccountStatus;
  SubscriptionFrequencyEnum = SubscriptionFrequency;
  MerchantSubscriptionPackege = MerchantSubscriptionPackege;
  stripeaccounturl: string = ""
  // currentYear = parseInt(moment().add(0, 'days').format("yyyy"));
  // currentDate = parseInt(moment().add(0, 'days').format("DD"));
  // currentMonth = parseInt(moment().add(0, 'days').format("MM"));
  currentDate: string



  // public myDatePickerOptions: IMyOptions = {
  //   dateFormat: 'yyyy-mm-dd',
  //   disableUntil: { year: this.currentYear, month: this.currentMonth, day: this.currentDate },
  // };
  // public myDatePickerOptionsSplit: IMyOptions = {

  //   dateFormat: 'yyyy-mm-dd',

  // };
  constructor(
    private merchantService: MerchantService,
    private activatedRoute: ActivatedRoute,
    private securityService: SecurityService,
    private toaster: ToastrService,
    private appState: AppStateService,
    private datePipe: DatePipe

  ) { }

  ngOnInit(): void {
    this.merchantId = this.appState.currentMerchant;

    if (this.merchantDto['subscriptionStatus'] != 1) {
      this.merchantDto['subscriptionStartDate'] = ''
    }

    // this.showDifferentDateMessage=false
    this.getSubcriptionRecords();

    this.GetMerchantDetail()
    this.subscribeAppState()

    const currentDate = new Date();
    const currentonboardingdate = new Date();
    // Get the next day by adding 1 to the current day
    currentDate.setDate(currentDate.getDate() + 1);
    this.currentDate = currentDate.toISOString().split('T')[0];

  }




  GetMerchantDetail() {

    this.merchantService.GetMerchantById(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;
      this.stripeaccounturl = `${environment.stripeurl}${this.merchantDto.stripeAccountId}/activity`
      this.showmainloader = false

    }, (err) => {
      this.toaster.error(err.message);
      this.showmainloader = false
    })
  }
  subscribeAppState() {
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.showmainloader = true
      this.merchantId = merchntId;
      this.GetMerchantDetail()
      this.getSubcriptionRecords();


    })

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedTab == "subscriptions") {

      if (this.merchantDto.nextSubscriptionChargeDate == null) {
        this.merchantDto.nextSubscriptionChargeDate = this.merchantDto.subscriptionStartDate
      }
      if (this.merchantDto.subscriptionTrialPeriod == null) {
        this.merchantDto.subscriptionTrialPeriod = 0
      }
      if (this.merchantDto.subscriptionStatus == 0) {
        this.merchantDto.subscriptionTrialPeriod = 1
      }
      if (this.merchantDto.subscriptionFrequency == null) {
        this.merchantDto.subscriptionFrequency = 1
      }
      this.getSubcriptionRecords();
    }
    this.showDifferentDateMessage = false
    if (this.userSelectedSubscriptionDate != "" && this.userSelectedSubscriptionDate !== this.merchantDto.subscriptionStartDate && this.merchantDto.subscriptionStatus == 1) {
      this.showDifferentDateMessage = true;
      // this.userSelectedSubscriptionDate="";
    }
  }
  processSaveMerchantData = () => {
    this.savingMerchant = true;
    this.merchantService.UpdateMerchantBusinessInfo(this.securityService.securityObject.token, this.merchantId, this.merchantDto).subscribe((data: any) => {
      this.toaster.success('Data saved successfully');
      this.savingMerchant = false;
      this.triggerChangeParent.emit();
    }, (err) => {
      this.savingMerchant = false;
      this.toaster.error(err.error.message);
    })
  }
  expandtable: { expandtable: boolean, idx: number }[] = [];
  onChangeExpandtable(idx) {
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }
  getSubcriptionRecords() {
    this.merchantService.getSubscriptionData(this.merchantId).subscribe({
      next: (data) => {
        this.subcriptionRecordsList = data['data'];
        // for mobile view
        this.showmainloader = false
        this.expandtable = new Array(this.subcriptionRecordsList.length).fill({ expandtable: false, idx: 0 });
        this.expandtable = this.expandtable.map((item, idx) => {
          return {
            ...item,
            idx: idx
          }
        })

      },
      error: (err) => {
        console.log('error', err);
        this.showmainloader = false
      },
    });
  }
  showWaiveOffModal(modal?: ModalDirective, id?: any) {
    this.explaination = "";
    this.waiveoffId = id;
    modal.show()
  }
  processWaiveOff(modal?: ModalDirective) {
    this.savingWaiveOff = true;
    this.merchantService.WaiveOffSubscritption(this.merchantId, this.waiveoffId, this.explaination).subscribe((data: any) => {
      this.toaster.success('Waived Off successfully');
      this.getSubcriptionRecords();
      this.savingWaiveOff = false
      this.triggerChangeParent.emit();
      modal.hide()
    }, (err) => {
      this.savingWaiveOff = false
      this.toaster.error(err.error.message);
    })
  }
  showMarkPaidModal(modal?: ModalDirective, id?: any) {
    this.explaination = "";
    this.markPaidId = id;
    modal.show()
  }
  showSplitModal(modal?: ModalDirective, item?: any) {
    this.splitId = item.id
    this.totalsubscriptionamount = item.amount
    modal.show()
  }
  addInput() {
    this.SubscriptionSplitList.push({ splitDate: '', splitAmount: 0, disable: false });
    this.addbtn = false
  }

  removeInput(input: any) {
    const index = this.SubscriptionSplitList.indexOf(input);
    if (index !== -1) {
      this.SubscriptionSplitList.splice(index, 1);
      this.splitTotalAmount = this.splitTotalAmount - input.splitAmount
      this.addbtn = true

    }
  }
  addsingleInput(input: any) {
    const index = this.SubscriptionSplitList.indexOf(input);

    this.splitTotalAmount = this.splitTotalAmount + input.splitAmount
    this.SubscriptionSplitList[index].disable = true
    this.addbtn = true


  }
  saveInputs() {

    this.merchantService.SaveSplitSubscription(this.merchantId, this.splitId, this.SubscriptionSplitList).subscribe((data: any) => {
      this.toaster.success('Subscription amount split  successfully');

      this.getSubcriptionRecords()
    }, (err) => {

      this.toaster.error(err.error.message);
    })
    // Here you can do any further processing with the input values, such as sending them to the server or processing them in some other way.
  }
  processMarkPaid(modal?: ModalDirective) {
    this.savingWaiveOff = true;
    this.merchantService.MarkPaySubscritption(this.merchantId, this.markPaidId, this.explaination).subscribe((data: any) => {
      this.toaster.success('Mark as Paid  successfully');
      this.getSubcriptionRecords();
      this.savingWaiveOff = false
      this.triggerChangeParent.emit();
      modal.hide()
    }, (err) => {
      this.savingWaiveOff = false
      this.toaster.error(err.error.message);
    })
  }
  changeSubscriptionStatus(status) {
    const mData = {
      "subscriptionStatus": status,
      "subscriptionTrialPeriod": this.merchantDto.subscriptionTrialPeriod,
      "subscriptionStartDate": this.merchantDto.subscriptionStartDate,
      "subscriptionFrequency": this.merchantDto.subscriptionFrequency
    };
    this.userSelectedSubscriptionDate = this.merchantDto.subscriptionStartDate;
    this.savingMerchantSubscription = true;
    this.merchantService.UpdateMerchantSubscription(this.merchantId, mData).subscribe((data: any) => {
      this.toaster.success('Data saved successfully');
      this.triggerChangeParent.emit();
      this.GetMerchantDetail()
      this.savingMerchantSubscription = false;
    }, (err) => {
      this.savingMerchantSubscription = false;
      this.toaster.error(err.error.message);
    })
  }
  preventNegativeInput(event: KeyboardEvent, propertyName?: string) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    if (parseFloat(inputValue) < 0 || Object.is(parseFloat(inputValue), -0)) {

      this.merchantDto[propertyName] = 0;
      inputElement.value = ''; // Clear the input value if it's negative
      event.preventDefault(); // Prevent the negative input
    }
  }


}
