import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { StorefrontService } from 'src/app/core/storefront.service';
@Component({
  selector: 'app-onboarding-form',
  templateUrl: './onboarding-form.component.html',
  styleUrls: ['./onboarding-form.component.scss']
})
export class OnboardingFormComponent implements OnInit {

  social: boolean = false
  personal: boolean = true;
  account: boolean = false
  personalBar: boolean = true;
  socialBar: boolean = false;
  message: boolean = false;
  businessInfo: boolean = false;
  hours: boolean = false;
  profile: boolean = false;
  setting: boolean = false;
  step1Check: boolean = true
  merchantDto = new MerchantListDto();
  savingData: boolean = false
  MerchantHoursInfoList: OpeninghourDto[];
  savingHoursInfo: boolean;
  addEditHoursObj = new AddEditOpeningHoursDto();
  userRoleType: UserRoleEnum;
  merchantsDefaultData: CustomOpeneingHourForUi[];

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
  constructor(private storeFrontService: StorefrontService,private merchantServices:MerchantService, private router: Router, private toaster: ToastrService,) { }

  ngOnInit(): void {
    this.setHoursDefaultData();
    this.MerchantHoursInfoList = this.merchantsDefaultData
  }
  next() {
    this.social = true;
    this.personal = false;
  }
  next2() {
    this.account = true;
    this.social = false;
  }
  next3() {
    this.account = false;
    this.message = true;
  }
  next4() {
    this.message = false;
    this.businessInfo = true;
  }
  previous1() {
    this.personal = true;
    this.social = false;
  }
  previous2() {
    this.account = false;
    this.social = true;
  }
  previous3() {
    this.account = true;
    this.message = false;
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
  fileToUploadLogo: File | null = null;
  uploadingBanner: boolean = false;
  uploadingLogo: boolean = false;

  handleFileInputForLogo(files: FileList) {
    this.uploadingLogo = true;
    this.fileToUploadLogo = files.item(0);

    this.storeFrontService.uploadMediaOnBoard(this.fileToUploadLogo).subscribe((data: any) => {

      this.uploadingLogo = false;
      this.merchantDto.logo = data.data

    }, (err) => {
      this.uploadingLogo = false;
    })
  }
  showBanner = true
  terms: boolean = false
  fileToUploadBanner: File | null = null;
  handleFileInputForBanner(files: FileList) {
    this.fileToUploadBanner = files.item(0);
    // this.showBanner = false
    this.merchantDto.banner = null

    this.uploadingBanner = true
    this.storeFrontService.uploadBannerBanner(this.merchantDto.merchantName, this.fileToUploadBanner, "1").subscribe((data: any) => {
      this.storeFrontService.uploadFilesToAWS(data.data.presignedUrl.url, data.data.presignedUrl.fields, this.fileToUploadBanner).subscribe((data1: any) => {
        this.merchantDto.banner = data.data.presignedUrl.url + data.data.presignedUrl.fields.key
        this.uploadingBanner = false
      })

    }, (err) => {
      this.uploadingBanner = false
    })


    // this.storeFrontService.uploadMediaOnBoard(this.fileToUploadLogo).subscribe((data: any) => {

    //   this.uploadingBanner = false;
    //   this.merchantDto.banner = data.data
    // }, (err) => {
    //   this.uploadingBanner = false;
    // })
  }
  @ViewChild('takeInput') myInputVariable: ElementRef;
  @ViewChild('takeInput2') myInputVariable2: ElementRef;
  deleteMediaLogo(){
    this.merchantDto.logo = null;

    this.myInputVariable.nativeElement.value = "";

    }
    deleteMediaBanner(){
      this.merchantDto.banner = null;

      this.myInputVariable2.nativeElement.value = "";
      
     }
  validate(id, text, type = "") {
    if (text.length == 0) {
      document.getElementById(id).style.display = 'block';
    } else {
      document.getElementById(id).style.display = 'none';
    }

    if (type == 'email' && text.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) == null && text.length > 0) {
      document.getElementById(id).innerHTML = 'Email is not valid';
      this.step1Check = false
      document.getElementById(id).style.display = 'block';
    }
    if (type == "password") {
      if (this.merchantDto.password !== this.merchantDto.confirmPassword) {
        document.getElementById("confirmPassError").style.display = 'block';
      } else {
        document.getElementById("confirmPassError").style.display = 'none';
      }
    }
  }
  savingMerchant: boolean = false
  signup() {
    this.savingMerchant = true;
    this.merchantDto.openinghours = this.MerchantHoursInfoList
    this.storeFrontService.onboardNewMerchant(this.merchantDto).subscribe((data: any) => {
      this.savingMerchant = false;
      this.router.navigateByUrl('/onBoarding/thanks');
    }, (err) => {
      this.savingMerchant = false;
      console.log(err.error)
      // this.toaster.error('There is an error in processing your request.');
      this.toaster.error(err.error.message);
    })
  }
}
