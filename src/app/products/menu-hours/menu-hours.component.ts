import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { merge } from 'rxjs';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { TranslocoService } from '@ngneat/transloco';
import { AddEditOpeningHoursDto, CustomOpeneingHourForUi, MerchantListDto, OpeninghourDto } from 'src/app/Models/merchant.model';

@Component({
  selector: 'app-menu-hours',
  templateUrl: './menu-hours.component.html',
  styleUrls: ['./menu-hours.component.scss']
})
export class MenuHoursComponent implements OnInit {
  @Input() merchantId: string;
  @Input() menuId: string;
  selectedMerchantId = ''
  selectedDayDropdown: number = 0
  defaultData = [];
  savingHoursInfo: boolean;
  loadingSlots: boolean = false

  timeArr = ["00:00", "00:15", "00:30", "00:45", "01:00", "01:15", "01:30", "01:45",
    "02:00", "02:15", "02:30", "02:45", "03:00", "03:15", "03:30", "03:45", "04:00",
    "04:15", "04:30", "04:45", "05:00", "05:15", "05:30", "05:45", "06:00", "06:15",
    "06:30", "06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:15", "08:30",
    "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00",
    "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15",
    "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30",
    "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45",
    "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00",
    "22:15", "22:30", "22:45", "23:00", "23:15", "23:30", "23:45", "23:59"]

  constructor(private toaster: ToastrService,private translocoService: TranslocoService, private securityService: SecurityService, private router: Router,
    private merchantservice: MerchantService, private filterDataService: FilterDataService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.setHoursDefaultData();
    this.selectedMerchantId = ''
  }
  ngOnChanges(changes: SimpleChanges) {
    this.getMenuHours()
  }


  enumDays = {
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday",
    "7": "Sunday",
  }
  DaysTranslation(day): string {
    // Assuming you have translations for each enum value in your language files
    let status=''
    this.translocoService.selectTranslate('Hours.'+this.enumDays[day]).subscribe(translation => {
      status=translation;
      });
      return status
  }
  deleteHours(index) {

    this.defaultData.splice(index, 1)

  }
  AddSlotinList() {
    let objToInsert = { day: this.enumDays[this.selectedDayDropdown], weekDay: Number(this.selectedDayDropdown), startTime: '00:00', endTime: '23:59', position: 0 }
    this.defaultData = this.defaultData.sort((a, b) => (a.position > b.position) ? 1 : -1)
    let index = this.defaultData.map(x => x.weekDay).lastIndexOf(Number(this.selectedDayDropdown))
    if (index == -1) {
 
      this.defaultData.push(objToInsert)
    } else {
      this.defaultData.splice(index + 1, 0, objToInsert);
    }
    this.defaultData.map((currElement, index) => {
      currElement['position'] = index
      return currElement; //equivalent to list[index]
    });


  }
  setHoursDefaultData() {
    this.defaultData = [
      //{ day: 'Monday', weekDay: 1, startTime: '00:00', endTime: '23:59', position: 1 },
      // { day: 'Tuesday', weekDay: 2, startTime: '00:00', endTime: '23:59' },
      // { day: 'Wednesday', weekDay: 3, startTime: '00:00', endTime: '23:59' },
      // { day: 'Thursday', weekDay: 4, startTime: '00:00', endTime: '23:59' },
      // { day: 'Friday', weekDay: 5, startTime: '00:00', endTime: '23:59' },
      // { day: 'Saturday', weekDay: 6, startTime: '00:00', endTime: '23:59' },
      // { day: 'Sunday', weekDay: 7, startTime: '00:00', endTime: '23:59' },

    ];
  }
  getMenuHours() {
    this.loadingSlots = true;
    this.merchantservice.getMenuHours(this.merchantId, this.menuId).subscribe((data: any) => {
      Object.assign(this.defaultData, data.data)
      this.defaultData.map((currElement, index) => {
        currElement['position'] = index
        return currElement; //equivalent to list[index]
      })
      this.loadingSlots = false
    }, (err) => {
      this.loadingSlots = false;
      this.toaster.error(err.error.message);
    })
  }
  saveMenuHours() {
    this.merchantservice.saveMenuHours(this.merchantId, this.menuId, this.defaultData).subscribe((data: any) => {
      this.toaster.info("hours saved successfully.")
      this.getMenuHours()
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }


}
