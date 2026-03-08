
import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ClonerService } from './../../core/DataServices/cloner.service';
import { ItemDetailObject } from './../../Models/item.model';
import { ItemService } from './../../core/item.service';
import { AppUiService } from './../../core/app-ui.service';
import { MerchantService } from './../../core/merchant.service';
import { AddCategoryDto, CategoryDto, ProductListDto, ProductStatusEnum, AddEditAddonDto, AddEditProductDto, AddonDtoWithOptions, CategoryWithOptDto } from './../../Models/Cat_Product.model';
import { ProductsCategoriesService } from './../../core/products-categories.service';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/core/security.service';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import {

  ItemTimeSlot,
  MerchantListDto,
  MerchantPlatformsEnum,
  OpeninghourDto,
  TimeSlot,
  WeekDay,

} from 'src/app/Models/merchant.model';
import { LazyModalDto, LazyModalDtoNew } from 'src/app/Models/app.model';
import { ItemDto } from 'src/app/Models/item.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppStateService } from 'src/app/core/app-state.service';
// import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';
import { UserRoleEnum } from "../../Models/user.model";
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { TranslocoService } from '@ngneat/transloco';
import Swal from 'sweetalert2'
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';





@UntilDestroy()
@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent {
  @ViewChild('suggestCategoryModal') suggestCategoryModal: ModalDirective;
  @ViewChild('suggestCategoryToItemModal') suggestCategoryToItemModal: ModalDirective;
  @ViewChild('suggestModifierToItemModal') suggestModifierToItemModal: ModalDirective;

  gettingProducts = true;
  productStatusEnum = ProductStatusEnum;
  CategoriesList: CategoryWithOptDto[];
  gettingCategories = true;
  ProductsList: ItemDto[];
  gettingMerchants: boolean;
  MerchantsList: MerchantListDto[];
  selectedMerchantId: string;
  selectedCategoryId: string;
  categoryName: string;
  addCategoryObj = new AddCategoryDto();
  addingCategories = false;
  editCategoryObj = new CategoryDto();
  addingProducts: boolean;
  gettingItemByid: boolean = false;
  addProductObj = new AddEditProductDto();
  addEditAddOnObj = new AddEditAddonDto();
  MerchantPlatformsEnum = MerchantPlatformsEnum;
  itemsDetailObj = new ItemDetailObject();
  itemsDetailObjpreserve = new ItemDetailObject();
  showPlatforms: boolean = false
  productsListPreserve: ItemDto[] = [];
  PlatformsPricingList = []
  doordashPrice: number
  ubereatsPrice: number
  grubhubPrice: number
  itemId: string
  selectedTab = 0;
  someMenu: boolean = false;
  selectAllCategory: boolean = false;
  selectAllAddon: boolean = false;
  someCategoryofItem: boolean = false;
  addingItems: boolean = false;
  addingItemsHours: boolean = false;
  someaddonfofcategory: boolean = false;
  selectedCatIds: string[] = [];
  selectedAddonIds: string[] = [];
  gettingMerchantAddOns: boolean;
  MerchantaddOnsList: AddonDtoWithOptions[] = [];
  disabled: boolean = true;
  addingModifier: boolean = false;
  platformBasedPricing: boolean = false;
  PlatformsPricingListpreserve = []
  fileToUpload: File | null = null;
  originalCategory: CategoryWithOptDto[] = [];
  searchTermCategory: string = '';
  originalModifier: AddonDtoWithOptions[] = [];
  searchTermModifier: string = '';
  workingWithRemove: string = '';
  dataToPush: any = []
  tabCount = ''
  forNoCategory: boolean
  tabMatch: any
  userRoleType: UserRoleEnum;
  crossIcon: boolean = false;
  timeslotjson = [];
  itemMappingDetails = []
  menuhoursList = []
  timeSlots: ItemTimeSlot[] = [];
  MerchantHoursInfoList: OpeninghourDto[] = []
  merchantDto = new MerchantListDto()
  itemCategoriesId = []
  availableDays: string[] = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
  availableTimes: string[] = ["00:00", "00:15", "00:30", "00:45", "01:00", "01:15", "01:30", "01:45",
    "02:00", "02:15", "02:30", "02:45", "03:00", "03:15", "03:30", "03:45", "04:00",
    "04:15", "04:30", "04:45", "05:00", "05:15", "05:30", "05:45", "06:00", "06:15",
    "06:30", "06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:15", "08:30",
    "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00",
    "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15",
    "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30",
    "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45",
    "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00",
    "22:15", "22:30", "22:45", "23:00", "23:15", "23:30", "23:45", "23:59"];

  constructor(private toaster: ToastrService, private translocoService: TranslocoService, private securityService: SecurityService, private router: Router, private itemService: ItemService,
    private merchantService: MerchantService, private catProductsService: ProductsCategoriesService, private appUi: AppUiService,
    private cloner: ClonerService, private appState: AppStateService, private route: ActivatedRoute) { }



  PlatformsListOriginal = [
    { id: 2, name: "Flipdish", selected: false, platformItemPrice: 0, platformType: 2, type: "platform" },
    { id: 3, name: "Ubereats", selected: false, platformItemPrice: 0, platformType: 3, type: "platform" },
    { id: 4, name: "Clover", selected: false, platformItemPrice: 0, platformType: 4, type: "POS" },
    { id: 11, name: "Square", selected: false, platformItemPrice: 0, platformType: 11, type: "POS" },
    { id: 50, name: "Store Front", selected: false, platformItemPrice: 0, platformType: 50, type: "platform" },
    { id: 5, name: "Grubhub", selected: false, platformItemPrice: 0, platformType: 5, type: "platform" },
    { id: 6, name: "Doordash", selected: false, platformItemPrice: 0, platformType: 6, type: "platform" },
    { id: 7, name: "GMB", selected: false, platformItemPrice: 0, platformType: 7, type: "platform" }
  ];

  ngOnInit(): void {

    this.itemId = this.route.snapshot.paramMap.get('itemid');
    this.selectedMerchantId = this.route.snapshot.queryParams['merchantid']
    this.route.queryParams.subscribe(params => {
      // Check if 'edit' query param exists and process accordingly
      if (params['edit'] !== undefined) {
        this.disabled = params['edit'] !== 'true';

      }
      if (params['tab'] !== undefined) {
        this.tabCount = params['tab'];
      }
      console.log('Edit Mode:', this.disabled);
    });
    this.userRoleType = this.securityService.securityObject.user.role;
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.tabMatch = fragment.match(/tab=(\d+)/);
        if (this.tabMatch) {
          this.tabMatch = Number(this.tabMatch[1]);
        }
      }
    });

    this.subscribeAppState()
    this.GetItemDetails(this.itemId)
    this.GetMerchantDetail()
    this.GetMerchantHoursInfo()
    this.getItemHours()
    if (this.tabMatch !== undefined && this.tabMatch !== null) {
      this.selectTab(this.tabMatch);
    } else {
      if (this.tabCount == 'category') {
        this.selectTab(3)
      } else if (this.tabCount == "modifiersGroup") {
        this.selectTab(4)
      } else {
        this.selectTab(this.selectedTab)
      }

    }
    setTimeout(() => {
      this.crossIcon = true;
    }, 3000);
  }

  GetMerchantDetail() {
    this.merchantService.GetMerchantById(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;
    }, (err) => {
      this.toaster.error(err.message);
    })
  }

  GetMerchantHoursInfo() {
    this.merchantService.GetMerchantHoursInfo(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: OpeninghourDto[]) => {
      this.MerchantHoursInfoList = data;
      console.log(data);
    }, (err) => {
      this.toaster.error(err.message);
    })
  }

  GetCategoryMenubyid() {
    if (this.itemCategoriesId.length > 0) {
      this.itemCategoriesId.forEach((ids) => {
        this.catProductsService.GetCategoryMenubyid(this.selectedMerchantId, ids, this.securityService.securityObject.token).subscribe(async (data: any) => {
          console.log(data);

          if (Array.isArray(data) && data.length > 0) {
            // this.someMenuText = "";
            data.forEach((menu) => {
              if (menu.id) {
                this.merchantService.getMenuHours(this.selectedMerchantId, menu?.id).subscribe(async (data: any) => {
                  //console.log("data of get menu hours is ", data)
                  console.log(data);
                  let hoursdata = data?.data;

                  if (hoursdata.length > 0) {
                    hoursdata.map((hr) => {
                      console.log(hr);

                      let startingTime = moment(hr?.startTime, 'HH:mm').format('HH:mm');
                      let endingTime = moment(hr?.endTime, 'HH:mm').format('HH:mm');
                      // if(this.menuhoursList.length > 0){
                      //   let filteredData = this.menuhoursList.filter((d) => d.day == hr.weekDay);
                      //   if(filteredData.length > 0){
                      //     if(filteredData[0]?.startTime > startingTime){
                      //       filteredData[0].startTime = startingTime
                      //     }
                      //     if(filteredData[0]?.endTime < endingTime){
                      //       filteredData[0].endTime = endingTime;
                      //     }
                      //     this.menuhoursList.forEach((tm) => {
                      //       if(tm.day == hr.weekDay){
                      //         tm.startTime = filteredData[0].startTime
                      //         tm.endTime = filteredData[0].endTime
                      //       }
                      //       return tm;
                      //     })
                      //   }else{
                      //     this.menuhoursList.push({day:hr.weekDay, startTime: startingTime, endTime: endingTime})
                      //   }
                      // }else{
                      this.menuhoursList.push({ day: hr.weekDay, startTime: startingTime, endTime: endingTime })
                      // }
                    })
                  }
                }, (err) => {
                  return [];
                })
              }
            })

          }
        },

          (err) => {
            this.toaster.error(err.error.message);
          })
      })
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    console.log("drag starting")
    moveItemInArray(this.itemsDetailObj.addons, event.previousIndex, event.currentIndex);
    this.dataToPush = []
    this.itemsDetailObj.addons.forEach((x, index) => {
      console.log("drag starting for each")
      this.dataToPush.push({
        "addonId": x.id,
        "sortId": index
      })

    })
    this.merchantService.sortItemAddons({ "addons": this.dataToPush }, this.selectedMerchantId, this.itemId).subscribe((data: any) => {
      this.toaster.success("Order saved successfully!");
    }, (err) => {
      this.toaster.error(err.error.message);
    })


  }
  subscribeAppState() {
    console.log("this.appstate is ", this.appState)
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      let previousID = this.selectedMerchantId
      if (previousID !== merchntId) {
        console.log("Merchant ID changed, redirecting...");
        this.selectedMerchantId = merchntId;
        this.router.navigate(['home/menus/items']);
      }
    })
  }


  filterCategories(): void {
    if (this.searchTermCategory) {
      this.CategoriesList = this.originalCategory.filter(category =>
        category.categoryName.toLowerCase().includes(this.searchTermCategory.toLowerCase())
      );
    } else {
      this.CategoriesList = [...this.originalCategory];
    }
  }

  filterModifier(): void {
    if (this.searchTermModifier) {
      this.MerchantaddOnsList = this.originalModifier.filter(item =>
        item.addonName.toLowerCase().includes(this.searchTermModifier.toLowerCase())
      );
    } else {
      this.MerchantaddOnsList = [...this.originalModifier];
    }
  }

  get underlineStyle() {
    return `translateX(${this.selectedTab * 100}%)`;
  }

  selectTab(index: number) {
    this.selectedTab = index;
    this.router.navigate([], {
      fragment: `tab=${index}`,
      queryParamsHandling: 'preserve'  // Preserve existing query params
    });
  }

  openModalForSuggestCategory() {
    this.suggestCategoryModal.show()
  }
  closeModalForSuggestCategory() {
    this.suggestCategoryModal.hide()
  }

  openModalForSuggestCategoryToItem() {
    this.suggestCategoryToItemModal.show()
    this.selectAllCategory = false
    this.selectedCatIds = []
  }
  closeModalForSuggestCategoryToItem() {
    this.suggestCategoryToItemModal.hide()
  }
  openModalForSuggestModifierToItem() {
    this.suggestModifierToItemModal.show()
  }
  closeModalForSuggestModifierToItem() {
    this.suggestModifierToItemModal.hide()
  }

  addModifier() {
    this.createAddonListForItem()


  }

  addCategory() {
    this.AddCategorytoItems()
  }

  addMenu() {
    this.someMenu = true;
    this.suggestCategoryModal.hide()
    this.suggestCategoryToItemModal.hide()

  }
  getEndTimeDisplayText(time, day): string {
      if (!day.startTime || !time) return time;
      
      const startMinutes = this.timeToMinutes(day.startTime);
      const timeMinutes = this.timeToMinutes(time);
      
      if (timeMinutes <= startMinutes - 15) {
        return `${time} (next day)`;
      }
      
      return time;
    }
    
  timeToMinutes(time: string): number {
    if (!time) return 0;

    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  getEndTimeOptions(day): string[] {

  
      const startTimeMinutes = this.timeToMinutes(day.startTime);

      const sameDayTimes: string[] = [];
      const nextDayTimes: string[] = [];
      
      this.availableTimes.forEach(time => {
        const timeMinutes = this.timeToMinutes(time);
        
        // Same day times: all times after start time
        if (timeMinutes > startTimeMinutes) {
          sameDayTimes.push(time);
        }
        // Next day times: all times that are at least 15 minutes before start time
        else if (timeMinutes <= startTimeMinutes - 15) {
        // allow only times starting from 00:15
        if (timeMinutes >= this.timeToMinutes("00:15")) {
          nextDayTimes.push(time);
        }
      }
      });
      
      // Combine same day times first, then next day times
      const combinedTimes = [...sameDayTimes, ...nextDayTimes];
      
      return combinedTimes;
    }

  saveItemHours() {
    this.addingItemsHours = true
    this.timeslotjson = this.getTimeSlotsAsJson();
    const dayList = {
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6,
      'Sunday': 7,
    }
    let merchanterrors = []
    let menuerrors = []
    if (this.MerchantHoursInfoList) {
      let times = [];
      this.MerchantHoursInfoList.map((data) => {
        let startingTime = moment(data?.openTime, 'HH:mm A').format('HH:mm');
        console.log("starting time is ", startingTime ,"for day ", data.day);
        let endingTime = moment(data?.closeTime, 'HH:mm A').format('HH:mm');
        console.log("ending time is ", endingTime, "for day ", data.day);
        times.push({ day: dayList[data.day], startTime: startingTime, endTime: endingTime, closeForBusinessFlag: data?.closeForBusinessFlag })
      })
      if (times.length > 0) {
        const dayList = {
          1: 'Monday',
          2: 'Tuesday',
          3: 'Wednesday',
          4: 'Thursday',
          5: 'Friday',
          6: 'Saturday',
          7: 'Sunday',
        }
        this.timeslotjson.map((tm) => {

          const filterData = times.filter((d) => d.day == tm.weekDay)
          let startingTime = moment(tm?.startTime, 'HH:mm').hours() * 60 + moment(tm?.startTime, 'HH:mm').minutes();
          let endingTime = moment(tm?.endTime, 'HH:mm').hours() * 60 + moment(tm?.endTime, 'HH:mm').minutes();
          if (endingTime < startingTime) {
            endingTime += 1440;
          }

          console.log("starting time in minutes ---> ", startingTime);
          console.log("ending time in minutes ---> ", endingTime);
          if (filterData.length > 0) {
            let hourCheck = false
            let starthourCheck = false
            let endhourCheck = false
            filterData.map((row) => {
              let rowStart = moment(row?.startTime, 'HH:mm').hours() * 60 + moment(row?.startTime, 'HH:mm').minutes();
              let rowEnd = moment(row?.endTime, 'HH:mm').hours() * 60 + moment(row?.endTime, 'HH:mm').minutes();
              
              if (rowEnd < rowStart) {
                rowEnd += 1440;
              }
              if (startingTime >= rowStart && endingTime <= rowEnd) {
                hourCheck = true;
                console.log("Row start time is ", row.startTime);
                console.log("Row end time is ", row.endTime);

                if (row?.closeForBusinessFlag == 0) {
                  if (startingTime < rowStart) {
                    merchanterrors.push(dayList[row?.day] + "'s Item Hours are outside Restaurant Opening Timings")
                  }
                  if (endingTime > rowEnd) {
                    merchanterrors.push(dayList[row?.day] + "'s Item Hours are outside Restaurant Closing Timings")
                  }
                } else {
                  merchanterrors.push('Restaurant is closed on ' + dayList[row?.day] + " ")
                }
              } else {
                if (!hourCheck) {
                  hourCheck = false;
                }
                if (startingTime >= rowStart && startingTime <= rowEnd) {
                  if (!starthourCheck) {
                    starthourCheck = true
                  }
                }
                if (endingTime >= rowStart && endingTime <= rowEnd) {
                  if (!endhourCheck) {
                    endhourCheck = true
                  }
                }
              }
            });
            if (!hourCheck) {
              if (!starthourCheck) {
                merchanterrors.push(dayList[tm?.weekDay] + "'s Item Hours are outside Restaurant Opening Timings")
              } else {
                if (!endhourCheck) {
                  merchanterrors.push(dayList[tm?.weekDay] + "'s Item Hours are outside Restaurant Closing Timings")
                } else {
                  merchanterrors.push(dayList[tm?.weekDay] + "'s Restaurant is closed  during a certain time within the Item hours.")
                }
              }
            }
          }

          return tm;
        })
      }
    }

    if (this.menuhoursList) {
      if (this.menuhoursList.length > 0) {
        let times = this.menuhoursList

        if (times.length > 0) {
          const dayList = {
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday',
            7: 'Sunday',
          }
          this.timeslotjson.map((tm) => {

            const filterData = times.filter((d) => d.day == tm.weekDay)
            let startingTime = moment(tm?.startTime, 'HH:mm').hours() * 60 + moment(tm?.startTime, 'HH:mm').minutes();
            let endingTime = moment(tm?.endTime, 'HH:mm').hours() * 60 + moment(tm?.endTime, 'HH:mm').minutes();
            if (endingTime < startingTime) {
              endingTime += 1440;
            }
            console.log("starting time in minutes ---> ", startingTime);
            console.log("ending time in minutes ---> ", endingTime);
            if (filterData.length > 0) {
              let hourCheck = false
              let starthourCheck = false
              let endhourCheck = false
              filterData.map((row) => {
                let rowStart = moment(row?.startTime, 'HH:mm').hours() * 60 + moment(row?.startTime, 'HH:mm').minutes();
                let rowEnd = moment(row?.endTime, 'HH:mm').hours() * 60 + moment(row?.endTime, 'HH:mm').minutes();

                if (rowEnd < rowStart) {
                  rowEnd += 1440; // handle midnight crossing for merchant timings too
                }
                if (startingTime >= rowStart && endingTime <= rowEnd) {
                  hourCheck = true;

                  if (startingTime < rowStart) {
                    menuerrors.push(dayList[row?.day] + "'s Item Hours are outside Menu Opening Timings")
                  }
                  if (endingTime > rowEnd) {
                    menuerrors.push(dayList[row?.day] + "'s Item Hours are outside Menu Closing Timings")
                  }

                } else {
                  if (!hourCheck) {
                    hourCheck = false;
                  }
                  if (startingTime >= rowStart && startingTime <= rowEnd) {
                    if (!starthourCheck) {
                      starthourCheck = true
                    }
                  }
                  if (endingTime >= rowStart && endingTime <= rowEnd) {
                    if (!endhourCheck) {
                      endhourCheck = true
                    }
                  }
                }
              });
              if (!hourCheck) {
                if (!starthourCheck) {
                  menuerrors.push(dayList[tm?.weekDay] + "'s Item Hours are outside Menu Opening Timings")
                } else {
                  if (!endhourCheck) {
                    menuerrors.push(dayList[tm?.weekDay] + "'s Item Hours are outside Menu Closing Timings")
                  } else {
                    menuerrors.push(dayList[tm?.weekDay] + "'s Menu is closed during a certain time within the Item hours.")
                  }
                }
              }

            }

            return tm;
          })
        }
      }
    }
    if (this.timeslotjson.length >= 0) {
              console.log("timeslotjson to validate ", this.timeslotjson)
              for (let slot1 of this.timeslotjson) {
              for (let slot2 of this.timeslotjson) {
                if (slot1.weekDay === slot2.weekDay) {
                  let start1 = moment(slot1?.startTime, "HH:mm").hours() * 60 + moment(slot1?.startTime, "HH:mm").minutes();
                  let end1 = moment(slot1?.endTime, "HH:mm").hours() * 60 + moment(slot1?.endTime, "HH:mm").minutes();
                  if (end1 < start1) end1 += 1440;
    
                  let start2 = moment(slot2?.startTime, "HH:mm").hours() * 60 + moment(slot2?.startTime, "HH:mm").minutes();
                  let end2 = moment(slot2?.endTime, "HH:mm").hours() * 60 + moment(slot2?.endTime, "HH:mm").minutes();
                  if (end2 < start2) end2 += 1440;
    
                  if (
                    (start1 < start2 && start2 < end1) ||
                    (start2 < start1 && start1 < end2)
                  ) {
                    this.addingItemsHours = false;
                    const dayName = Object.keys(dayList).find(
                      key => dayList[key] === slot1.weekDay
                    );
                    this.toaster.error(`Overlapping hours detected for ${dayName}`);
                    return;
                  } else if (
                    (start1 < end2 && end2 < end1) ||
                    (start2 < end1 && end1 < end2)
                  ) {
                    this.addingItemsHours = false;
                    const dayName = Object.keys(dayList).find(
                      key => dayList[key] === slot1.weekDay
                    );
                    this.toaster.error(`Overlapping hours detected for ${dayName}`);
                    return;
                  }
                }
                }
              }
        } 
    console.log(menuerrors, merchanterrors, this.MerchantHoursInfoList);

    if (menuerrors.length == 0 && merchanterrors.length == 0) {
      this.itemService.saveItemHours(this.selectedMerchantId, this.itemId, this.timeslotjson).subscribe((data: any) => {

        this.toaster.success("Item Hours Updated Successfully")
        this.getItemHours()
        this.addingItemsHours = false

      }, (err) => {
        this.toaster.error(err.error.message);
        this.addingItemsHours = false
      })
    } else {
      this.addingItemsHours = false
      if (menuerrors.length > 0) {
        menuerrors.map((er) => this.toaster.error(er))
      } else if (merchanterrors.length > 0) {
        merchanterrors.map((er) => this.toaster.error(er))
      }
    }
  }

  GetItemDetails(id: string, loadProducts: boolean = true) {
    this.gettingItemByid = loadProducts;
    //this.itemsDetailObj = new ItemDetailObject();
    this.itemService.getMerchantitem(this.selectedMerchantId, id).subscribe((data: ItemDetailObject) => {
      this.itemsDetailObj = data;
      console.log("this.itemsDetailObj", this.itemsDetailObj)
      this.GetCategoriesList()
      this.GetAddOnsByMerchantId()
      this.updatePrices(this.itemsDetailObj.itemPriceMappings);

      if (Array.isArray(this.itemsDetailObj.categories) && this.itemsDetailObj.categories.length > 0) {
        this.itemCategoriesId = this.itemsDetailObj.categories.map((cat) => cat.id)
      }

      this.GetCategoryMenubyid()
      if (this.itemsDetailObj.itemPriceMappings && this.itemsDetailObj.itemPriceMappings.length > 0) {
        this.platformBasedPricing = true
        this.PlatformsPricingList = this.itemsDetailObj.itemPriceMappings
      }
      else {
        this.PlatformsPricingList = []
        this.platformBasedPricing = false
      }
      if (this.itemsDetailObj.categories && this.itemsDetailObj.categories.length > 0) {
        this.someCategoryofItem = true
      }
      else {
        this.someCategoryofItem = false
      }
      if (this.itemsDetailObj.addons && this.itemsDetailObj.addons.length > 0) {
        this.someaddonfofcategory = true
      }
      else {
        // this.forNoCategory = true
        this.someaddonfofcategory = false
      }
      if (this.disabled == false) {
        this.edititem()
      }

    }, (err) => {
      this.gettingItemByid = false;
      this.toaster.error(err.message);
    })

  }

  // Update the function to match the actual type
  updatePrices(mappings: { platformItemPrice: number; platformType: number }[]) {
    mappings.forEach(mapping => {
      const price = mapping.platformItemPrice; // No need to parseFloat if it's already a number
      switch (mapping.platformType) {
        case 6:
          this.doordashPrice = price;
          break;
        case 3:
          this.ubereatsPrice = price;
          break;
        case 5:
          this.grubhubPrice = price;
          break;
        default:
          // Handle other cases if needed
          break;
      }
    });
  }

  //
  GetCategoriesList() {
    this.gettingCategories = true;
    this.CategoriesList = [];
    this.catProductsService.GetCategoriesWithItems(this.selectedMerchantId, this.securityService.securityObject.token).subscribe((data: CategoryWithOptDto[]) => {
      if (data) {
        this.CategoriesList = data;
        const excludedItemIds = this.itemsDetailObj.categories.map(cat => cat.id);
        console.log('Excluded Item IDs:', excludedItemIds);

        this.CategoriesList = this.CategoriesList.filter(item => {
          const isExcluded = excludedItemIds.includes(item.id);
          console.log(`Item ID ${item.id} excluded: ${isExcluded}`);
          return !isExcluded;
        });
        this.originalCategory = [...this.CategoriesList];
      }

      this.gettingCategories = false;
    }, (err) => {
      this.gettingCategories = false;
      this.toaster.error(err.message);
    })
  }

  toggleSelectAll(event: any) {
    this.selectAllCategory = event.target.checked;
    this.selectedCatIds = this.selectAllCategory ? this.CategoriesList.map(cat => cat.id) : [];
  }

  isSelected(catid: string): boolean {
    return this.selectedCatIds.includes(catid);
  }

  toggleCat(catid: string, event: any) {
    const checked = event.target.checked;
    if (checked) {
      this.selectedCatIds.push(catid);
    } else {
      this.selectedCatIds = this.selectedCatIds.filter(id => id !== catid);
    }
    this.selectAllCategory = this.CategoriesList.length === this.selectedCatIds.length;
    console.log(this.selectedCatIds)
  }


  toggleSelectAllAddon(event: any) {
    this.selectAllAddon = event.target.checked;
    this.selectedAddonIds = this.selectAllAddon ? this.MerchantaddOnsList.map(cat => cat.id) : [];
  }

  isSelectedAddon(catid: string): boolean {
    return this.selectedAddonIds.includes(catid);
  }

  toggleAddon(catid: string, event: any) {
    const checked = event.target.checked;
    if (checked) {
      this.selectedAddonIds.push(catid);
    } else {
      this.selectedAddonIds = this.selectedAddonIds.filter(id => id !== catid);
    }
    this.selectAllAddon = this.MerchantaddOnsList.length === this.selectedAddonIds.length;
    console.log(this.selectedAddonIds)
  }





  DeleteCategoryforItem(id: any) {
    let nObj = id;
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove Category";
    modalDto.Description = " By taking this action, you will remove the category from this item."
    modalDto.Text = "Would you like to remove the category from this item?";
    modalDto.acceptButtonText = "Yes, Remove Category"
    modalDto.callBack = this.DeleteCategoryforItemCallback;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModalNew(modalDto);
  }

  DeleteCategoryforItemCallback = (id: string) => {
    let data = {
      "itemId": this.itemId,
      "delete": 1
    }
    this.workingWithRemove = id
    this.itemService.UpdateCategoryItems(this.selectedMerchantId, id, data).subscribe((data: any) => {
      this.toaster.success("Item unassigned from this Category");
      this.GetItemDetails(this.itemId)
      this.workingWithRemove = ''
    }, (err) => {
      this.workingWithRemove = ''
      this.toaster.error(err.error.message);
    })

  }

  GetAddOnsByMerchantId() {
    this.gettingMerchantAddOns = true;
    this.MerchantaddOnsList = [];
    this.catProductsService.GetAddOnsWIthoutOptionsByMerchantId(this.selectedMerchantId, this.securityService.securityObject.token, 0).subscribe((data: AddonDtoWithOptions[]) => {
      this.MerchantaddOnsList = data;

      const excludedItemIds = this.itemsDetailObj.addons.map(add => add.id);
      this.MerchantaddOnsList = this.MerchantaddOnsList.filter(item => !excludedItemIds.includes(item.id));
      this.forNoCategory = this.MerchantaddOnsList.length == 0
      this.originalModifier = [...this.MerchantaddOnsList];
      this.gettingMerchantAddOns = false;
      this.gettingItemByid = false;
    }, (err) => {
      this.gettingItemByid = false;
      this.gettingMerchantAddOns = false;
      this.toaster.error(err.message);
    })
  }





  DeleteItemAddons(id: any) {
    let nObj = id;
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove Modifier Group";
    modalDto.Description = "By taking this action, you will remove the modifier group from this item."
    modalDto.Text = "Would you like to remove the modifier group from this item?";
    modalDto.acceptButtonText = "Yes, Remove Modifier Group"
    modalDto.callBack = this.DeleteItemAddonsCallback;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModalNew(modalDto);
  }

  //delete merchant addon group
  DeleteItemAddonsCallback = (id: string) => {
    let data = {
      "addonId": id,
      "delete": 1
    }
    this.workingWithRemove = id
    this.itemService.updateItemIddons(this.selectedMerchantId, this.itemId, data).subscribe((data: any) => {
      this.toaster.success("Modifier group unassigned")
      this.GetItemDetails(this.itemId, false)
      this.workingWithRemove = ''
    }, (err) => {
      this.toaster.error(err.error.message);
    })

  }

  //add merchant addon group
  createAddonListForItem() {
    let data = {
      "addonId": this.selectedAddonIds,
      "delete": 0
    }
    this.addingModifier = true
    this.itemService.updateItemIddons(this.selectedMerchantId, this.itemId, data).subscribe((data: any) => {
      this.toaster.success("Modifier group added")
      this.selectedAddonIds = []
      this.addingModifier = false
      this.suggestModifierToItemModal.hide()
      this.selectAllAddon = false
      this.GetItemDetails(this.itemId)
    }, (err) => {
      this.toaster.error(err.error.message);
    })

  }

  AddCategorytoItems() {
    let data = {
      "categoryIds": this.selectedCatIds,
      "delete": 0
    }
    this.addingCategories = true
    this.itemService.UpdateItemsCategorywithList(this.selectedMerchantId, this.itemId, data).subscribe((data: any) => {
      this.toaster.success("Item Assigned");
      this.selectedCatIds = []
      this.suggestCategoryToItemModal.hide()
      this.addingCategories = false
      this.selectAllCategory = false
      this.GetItemDetails(this.itemId)
    }, (err) => {
      this.toaster.error(err.error.message);
    })

  }


  EditItemForMerchant() {

    this.addProductObj.token = this.securityService.securityObject.token;
    const filteredPlatforms = this.PlatformsPricingList.filter((item: { platformItemPrice: any }) => {
      // Convert platformItemPrice to a number for comparison
      const price = Number(item.platformItemPrice);
      return price !== 0 && !isNaN(price); // Ensure it's not NaN
    });

    this.addingItems = true;

    this.addProductObj.item.itemPriceMappings = filteredPlatforms
    this.addProductObj.item.id = this.itemId;
    this.addProductObj.item.itemStatus = this.itemsDetailObj.itemStatus;
    this.addProductObj.item.itemName = this.itemsDetailObj.itemName;
    this.addProductObj.item.itemUnitPrice = this.itemsDetailObj.itemUnitPrice;
    this.addProductObj.item.itemDescription = this.itemsDetailObj.itemDescription;
    this.addProductObj.item.posName = this.itemsDetailObj.posName;
    this.addProductObj.item.itemSKU = this.itemsDetailObj.itemSKU;
    this.addProductObj.item.itemType = this.itemsDetailObj.itemType;
    this.addProductObj.item.shortName = this.itemsDetailObj.shortName;

    let itemstatus = this.itemsDetailObj.itemStatus;
    if (typeof this.itemsDetailObj.itemStatus == "boolean") {
      itemstatus = this.itemsDetailObj.itemStatus == true ? 1 : this.itemsDetailObj.itemStatus === false ? 0 : this.itemsDetailObj.itemStatus;
    }
    let isupdate = this.itemsDetailObjpreserve.itemStatus !== itemstatus ? true : false;

    this.itemService.updateMerchantitem(this.selectedMerchantId, this.itemId, this.addProductObj).subscribe((data: any) => {
      if (isupdate) {
        this.itemStatusToogleCallback(this.itemsDetailObj.itemStatus, this.itemId)
      }
      this.addingItems = false;
      this.toaster.success("Item Updated Successfully")
      this.disabled = true;
      this.GetItemDetails(this.itemId)

    }, (err) => {
      this.addingItems = false;
      this.toaster.error(err.message);
    })
  }

  getTimeSlotsAsJson(): any[] {
    console.log(this.timeSlots, this.merchantDto);

    return this.timeSlots
      .filter(slot => slot.startTime && slot.endTime && slot.selectedDays)  // Filter out invalid slots
      .flatMap(slot =>
        slot.selectedDays.map((day, i) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          timezone: slot.timezone || this.merchantDto?.timezone,
          weekDay: this.getWeekDay(day),
          groupDays: slot?.selectedDays.map((data) => { return this.getWeekDay(data) }),
          id: slot.ids[i]
        }))
      );
  }
  setdefault() {
    this.disabled = true
    this.getItemHours()
  }
  getItemHours() {

    this.itemService.getItemHours(this.selectedMerchantId, this.itemId).subscribe((data: any) => {
      console.log("data of get item hours is ", data)
      this.timeSlots = this.groupByTimeAndDay(data.data)
      if (this.disabled == false) {
      }
      else {
        console.log("this . timeslots ", this.timeSlots)

        this.disabled = true
      }

    }, (err) => {
      this.disabled = true
      this.toaster.error(err.error.message);
    })
  }
  groupByTimeAndDay(data: any[]): any[] {
    const groupedData: any[] = [];

    data.forEach(item => {
      const existingEntry = groupedData.find(entry =>
        entry.startTime === item.startTime && entry.endTime === item.endTime
      );

      if (existingEntry) {
        existingEntry.selectedDays.push(WeekDay[item.weekDay]);
        existingEntry.ids.push(item.id);
      } else {
        groupedData.push({
          startTime: item.startTime,
          endTime: item.endTime,
          timezone: this.merchantDto?.timezone,
          selectedDays: [WeekDay[item.weekDay]],
          ids: [item.id]
        });
      }
    });
    return groupedData;
  }
  onDayToggle(index: number, day: string): void {
    const slot = this.timeSlots[index];
    const dayIndex = slot.selectedDays.indexOf(day);
    if (dayIndex === -1) {
      slot.selectedDays.push(day);  // Add day if it's not already selected
    } else {
      slot.selectedDays.splice(dayIndex, 1);  // Remove day if it's already selected
    }
    this.isAnyDaySelectedAcrossSlots()
  }

  isAnyDaySelectedAcrossSlots(): boolean {
    if (this.timeSlots.length === 0) {
      return true;
    }

    // Check if every slot has at least one selected day, and valid startTime and endTime
    return this.timeSlots.every(slot =>
      slot.selectedDays && slot.selectedDays.length > 0 &&
      slot.startTime && slot.endTime
    );
  }

  // 
  edititem() {
    this.itemsDetailObjpreserve = this.cloner.deepClone(this.itemsDetailObj);

    if (this.PlatformsPricingList && this.PlatformsPricingList.length > 0) {
      this.fillPlatformPricingCheckboxesonedit()
    }
  }
  canceledititem() {

    this.itemsDetailObj = this.itemsDetailObjpreserve
    this.PlatformsPricingList = this.itemsDetailObj.itemPriceMappings
    if (this.PlatformsPricingList && this.PlatformsPricingList.length > 0) {
      this.platformBasedPricing = true
    }
    this.disabled = true
  }


  restrictWords(event: Event, maxWords: number): void {
    const input = event.target as HTMLInputElement;
    const words = input.value.trim().split(/\s+/).filter(word => word.length > 0);

    // Check if the number of words exceeds the maxWords
    if (words.length > maxWords) {
      // Truncate the input value to the maximum number of words
      input.value = words.slice(0, maxWords).join(' ');

      // Trigger change detection for Angular if necessary
      (event.target as HTMLInputElement).dispatchEvent(new Event('input'));
    }
  }

  fillPlatformPricingCheckboxesonedit() {
    this.PlatformsPricingList = this.itemsDetailObj.itemPriceMappings
    if (this.platformBasedPricing) {
      const filteredPlatforms: { platformType: number }[] = this.cloner.deepClone(
        this.PlatformsListOriginal.filter(x => x.type === "platform")

      );

      console.log(filteredPlatforms)
      // Append platforms that are not already in PlatformsPricingList
      filteredPlatforms.forEach(platform => {
        const exists = this.PlatformsPricingList.some(
          existingPlatform => existingPlatform.platformType === platform.platformType
        );

        // If platform is not already present, append it
        if (!exists) {
          this.PlatformsPricingList.push(platform);
        }
      });
    } else {
      this.PlatformsPricingList = [];
    }
  }
  fillPlatformPricingCheckboxes() {
    if (this.platformBasedPricing) {
      this.PlatformsPricingList = this.cloner.deepClone(this.PlatformsListOriginal.filter(x => x.type == "platform"));
      this.PlatformsPricingList.map((x) => {
        if (this.itemsDetailObj.itemUnitPrice != null && this.itemsDetailObj.itemUnitPrice != undefined && this.itemsDetailObj.itemUnitPrice > 0) {
          x.platformItemPrice = this.itemsDetailObj.itemUnitPrice;
        } else {
          x.platformItemPrice = 0;
        }
      });
    } else {
      this.PlatformsPricingList = [];
    }
  }



  RemoveProductImage() {
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove Item Image";
    modalDto.Description = " By taking this action, you will remove the image from this item."
    modalDto.Text = "Would you like to remove the image from this item?";
    modalDto.acceptButtonText = "Yes, Remove Image"
    modalDto.callBack = this.RemoveProductImageCallback;
    this.appUi.openLazyConfrimModalNew(modalDto);
  }

  //remove image
  RemoveProductImageCallback = () => {
    this.itemService.deleteMerchantitemImage(this.selectedMerchantId, this.itemId, this.securityService.securityObject.token).subscribe((data: ProductListDto[]) => {
      this.GetItemDetails(this.itemId)
      this.toaster.success("Image removed successfully.")
    }, (err) => {
      this.addingProducts = false;
      this.toaster.error(err.error.message);
    })
  }

  //add image for item

  handleFileInputForProduct(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;

    if (files && files.length > 0) {
      this.fileToUpload = files.item(0);
    }
    if (this.fileToUpload) {
      if (this.fileToUpload.size < 10240) {
        this.toaster.error("Image size must be  10240 Bytes.")
      }
      else {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            if (img.width < 250 || img.height < 250) {
              this.toaster.error('Image dimensions should be at least 250 x 250 pixels.');
              // You can display an error message or take further action here
            } else {

              console.log('Image dimensions are fine.');
              const modalDto = new LazyModalDtoNew();
              modalDto.Title = "Add Item Image";
              modalDto.Description = " By taking this action, you will add the image for this item."
              modalDto.Text = "Would you like to add the image for this item";
              modalDto.acceptButtonText = "Yes, Add Image"
              modalDto.callBack = this.handleFileInputForProductCallback;
              this.appUi.openLazyConfrimModalNew(modalDto);


            }
          };
        };
        reader.readAsDataURL(this.fileToUpload)
      }
    }
    else {
      this.toaster.error("Image not selected correclty.")
    }
  }
  handleFileInputForProductCallback = () => {
    this.itemService.updateMerchantitemImage(this.selectedMerchantId, this.itemId, this.fileToUpload, this.securityService.securityObject.token).subscribe((data: ProductListDto[]) => {
      this.toaster.success("Image added successfully.")
      this.GetItemDetails(this.itemId)
    }, (err) => {
      this.addingProducts = false;
      this.toaster.error(err.error.message);
    })
  }


  itemStatusToogleCallback(status: number, id: string) {

    this.catProductsService.DisableEnableItem(this.selectedMerchantId, id, {
      "itemStatus": status
    }).subscribe((data: any) => {
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
  isInvalidPrice(itemUnitPrice: any): boolean {
    return isNaN(Number(itemUnitPrice)) || itemUnitPrice === null || itemUnitPrice === '';
  }

  addNewTimeSlot(): void {
    let slot = new ItemTimeSlot();
    slot.timezone = this.merchantDto?.timezone
    this.timeSlots.push(slot);
  }
  removeSlot(index: number) {
    Swal.fire({
      title: 'Are you sure that you want to remove this time slot?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.timeSlots.splice(index, 1);
      } else if (result.isDismissed) {
        console.log("cancelled")
      }
    })
  }
  // Helper function to map selectedDays to weekDay
  getWeekDay(day: string): number {
    const daysMap: { [key: string]: number } = {
      'Sun': 7,
      'Mon': 1,
      'Tues': 2,
      'Wed': 3,
      'Thu': 4,
      'Fri': 5,
      'Sat': 6
    };
    return daysMap[day] || 0;
  }
}
