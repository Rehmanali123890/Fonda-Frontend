import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { AddEditOpeningHoursDto, CustomOpeneingHourForUi, MerchantListDto, OpeninghourDto } from 'src/app/Models/merchant.model';
import { UserRoleEnum } from 'src/app/Models/user.model';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-merchant-time-management',
  templateUrl: './merchant-time-management.component.html',
  styleUrls: ['./merchant-time-management.component.scss']
})
export class MerchantTimeManagementComponent implements OnInit {
  gettingMerchants: boolean;
  MerchantsList: MerchantListDto[];
  @Input() merchantId: string;
  @Input() merchantDto = new MerchantListDto();
  MerchantHoursInfoList: OpeninghourDto[];
  @Input() selectedTab: string;
  savingHoursInfo: boolean;
  addEditHoursObj = new AddEditOpeningHoursDto();
  userRoleType: UserRoleEnum;
  merchantsDefaultData: CustomOpeneingHourForUi[];
  
  timeArr = ['12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM',
    '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'];

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
    '10:30 PM', '10:45 PM', '11:00 PM', '11:15 PM', '11:30 PM', '11:45 PM', '11:59 PM'
  ];

  constructor(private toaster: ToastrService, private securityService: SecurityService, private router: Router,
    private merchantservice: MerchantService, private filterDataService: FilterDataService, private activatedRoute: ActivatedRoute, private translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.userRoleType = this.securityService.securityObject.user.role;
    this.setHoursDefaultData();
    this.GetMerchantHoursInfo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setHoursDefaultData();
    this.GetMerchantHoursInfo();
  }

  timeToMinutes(time: string): number {
    if (!time) return 0;
    
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    
    let totalMinutes = minutes;
    if (period === 'AM') {
      totalMinutes += hours === 12 ? 0 : hours * 60;
    } else {
      totalMinutes += hours === 12 ? 12 * 60 : (hours + 12) * 60;
    }
    
    return totalMinutes;
  }


  getEndTimeOptions(day: CustomOpeneingHourForUi): string[] {
    if (!day.openTime) {
      return this.timeArry2;
    }

    const startTimeMinutes = this.timeToMinutes(day.openTime);
    
    const sameDayTimes: string[] = [];
    const nextDayTimes: string[] = [];
    
    this.timeArry2.forEach(time => {
      const timeMinutes = this.timeToMinutes(time);
      
      if (timeMinutes > startTimeMinutes) {
        sameDayTimes.push(time);
      }
      // Next day times: all times that are at least 15 minutes before start time
      else if (timeMinutes <= startTimeMinutes - 15) {
        // allow only times starting from 00:15
        if (timeMinutes >= this.timeToMinutes("12:15 AM")) {
          nextDayTimes.push(time);
        }
      }
    });
    
    if (startTimeMinutes === 0) { 
      return this.timeArry2.slice(1); 
    }
    
    const combinedTimes = [...sameDayTimes, ...nextDayTimes];
    
    return combinedTimes;
  }

  getEndTimeDisplayText(time: string, day: CustomOpeneingHourForUi): string {
    if (!day.openTime || !time) return time;
    
    const startMinutes = this.timeToMinutes(day.openTime);
    const timeMinutes = this.timeToMinutes(time);
    
    if (timeMinutes <= startMinutes - 15) {
        return `${time} (next day)`;
    }
    
    return time;
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

  getdayTranslation(day): string {
    let dayy = ''
    this.translocoService.selectTranslate('Hours.' + day).subscribe(translation => {
      dayy = translation;
    });
    return dayy
  }

  GetMerchantsList() {
    this.gettingMerchants = true;
    this.merchantservice.GetMerchants(this.securityService.securityObject.token).subscribe((data: MerchantListDto[]) => {
      this.MerchantsList = data;
      if (this.MerchantsList && this.MerchantsList.length) {
        this.merchantId = this.MerchantsList[0].id;
        this.GetMerchantHoursInfo();
      }
      this.gettingMerchants = false;
    }, (err) => {
      this.gettingMerchants = false;
      this.toaster.error(err.message);
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
        } else if (existingDay && existingDay.id) {
          const rIndex = this.merchantsDefaultData.indexOf(existingDay);
          this.AddAnotherValue(rIndex, hourInfo);
        }
      });
      this.gettingMerchants = false;
    }, (err) => {
      this.gettingMerchants = false;
      this.toaster.error(err.message);
    })
  }

  AddHourForMerchant(day: CustomOpeneingHourForUi) {

    day.loading = true;
    this.addEditHoursObj.token = this.securityService.securityObject.token;
    var newObj = {};
    Object.assign(newObj, day);
    delete newObj['main'];
    delete newObj['loading'];
    this.addEditHoursObj.openinghour = newObj;
    console.log('Add hour object -->', this.addEditHoursObj);
    this.merchantservice.AddMerchantHourInfo(this.merchantId, this.addEditHoursObj).subscribe((data: any) => {
      this.addEditHoursObj = new AddEditOpeningHoursDto();
      this.toaster.success('Data saved successfully');
      this.GetMerchantHoursInfo();
      day.loading = false;
    }, (err) => {
      day.loading = false;
      const errorMsg = err?.error?.message || err.message || 'Something went wrong';
      this.toaster.error(errorMsg);
    })
  }

  EditHourForMerchant(day: CustomOpeneingHourForUi) {

    day.loading = true;
    this.addEditHoursObj.token = this.securityService.securityObject.token;
    var newObj = {};
    Object.assign(newObj, day);
    delete newObj['main'];
    delete newObj['loading'];
    this.addEditHoursObj.openinghour = newObj;
    console.log('Edit hour object -->', this.addEditHoursObj);
    this.merchantservice.EditMerchantHourInfo(this.merchantId, this.addEditHoursObj).subscribe((data: any) => {
      this.GetMerchantHoursInfo();
      this.toaster.success('Data saved successfully');
      day.loading = false;
    }, (err) => {
      day.loading = false;
      const errorMsg = err?.error?.message || err.message || 'Something went wrong';
      this.toaster.error(errorMsg);
    })
  }

  DeleteHourForMerchant(day: CustomOpeneingHourForUi) {
    day.loading = true;
    this.addEditHoursObj.token = this.securityService.securityObject.token;
    var newObj = {};
    Object.assign(newObj, day);
    delete newObj['main'];
    delete newObj['loading'];
    this.addEditHoursObj.openinghour = newObj;
    this.merchantservice.DeleteMerchantHourInfo(this.merchantId, this.addEditHoursObj).subscribe((data: any) => {
      this.toaster.success('Data saved successfully');
      this.GetMerchantHoursInfo();
      day.loading = false;
    }, (err) => {
      day.loading = false;
      this.toaster.error(err.message);
    })
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
}