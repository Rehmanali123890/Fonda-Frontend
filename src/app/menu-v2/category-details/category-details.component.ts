import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ClonerService } from './../../core/DataServices/cloner.service';
import { ItemDetailObject, AddonItemDetailDto } from './../../Models/item.model';
import { ItemService } from './../../core/item.service';
import { AppUiService } from './../../core/app-ui.service';
import { MerchantService } from './../../core/merchant.service';
import { AddCategoryDto, CategoryDto, CatMenu, CategoryStatusEnum, ProductListDto, ProductStatusEnum, AddEditAddonDto, AddonDto, AddonStatusEnum, AddonOptionDto, AddonOptionStatusEnum, AddEditProductDto, AddonDtoWithOptions, CategoryWithOptDto } from './../../Models/Cat_Product.model';
import { ProductsCategoriesService } from './../../core/products-categories.service';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/core/security.service';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import {
  ConnectedPlatformObj,
  ItemTimeSlot,
  MerchantListDto,
  MerchantPlatformsEnum,
  MerchatMenu,
  OpeninghourDto,
  Platforms,
  virtualMerchants,
  WeekDay
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
import { data } from 'jquery';
import * as moment from 'moment';
import { MenuHoursComponent } from 'src/app/products/menu-hours/menu-hours.component';

@UntilDestroy()
@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {
  @ViewChild('suggestCategoryModal') suggestCategoryModal: ModalDirective;

  @ViewChild('createMenuModal') createMenuModal: ModalDirective;
  constructor(private toaster: ToastrService, private translocoService: TranslocoService, private securityService: SecurityService, private router: Router, private itemService: ItemService,
    private merchantService: MerchantService, private catProductsService: ProductsCategoriesService, private appUi: AppUiService,
    private cloner: ClonerService, private appState: AppStateService, private route: ActivatedRoute) { }

  @ViewChild('addItemsModal') addItemsModal: ModalDirective;

  selectedTab = 0;
  someMenu: boolean = false;
  someItems: boolean = false;
  addingItems: boolean = false;
  addingMenus: boolean = false;
  disabled: boolean = true;;
  gettingCategories = true;
  gettingCategoriesbyId = true;
  userRoleType: UserRoleEnum;
  gettingProducts = true;
  productStatusEnum = ProductStatusEnum;
  ProductsList: ItemDto[];
  gettingMerchants: boolean;
  MerchantsList: MerchantListDto[];
  selectedMerchantId = ''
  selectedCategoryId: string;
  addCategoryObj = new AddCategoryDto();
  addingCategories: boolean;
  addingCategoriesHours: boolean = false;
  editCategoryObj = new CategoryDto();
  catMenu: CatMenu[] = [];
  allMenusList: MerchatMenu[] = [];
  select_menu_id: boolean = false
  deletingCategories: boolean;
  category_id = ''
  categoryDescription: string;
  categoryName: string;
  posName: string;
  categoryStatus: number;
  category_idpreserve = ''
  category_pos = ''
  categoryDescriptionpreserve: string;
  categoryNamepreserve: string;
  categoryStatuspreserve: number;
  categoriesPreserve: CategoryDto[] = [];
  savingAssignCategories: boolean;
  CategoriesList: CategoryWithOptDto[];
  ItemsList: CategoryWithOptDto[];
  selectedMenuIds: string[] = [];
  selectAllMenu: boolean = false;
  selectAllItems: boolean = false;
  gettingMenus: boolean = true;
  gettingItemsById: boolean = true;
  tabCount = ''
  itemsListAll: ItemDto[];
  selectedItems: string[] = [];
  originalItems: MerchatMenu[] = [];
  searchTermMenu: string = '';
  searchTermItem: string = '';
  workingWithRemove: string = '';
  itemsListAllSearch: ItemDto[];
  dataToPush: any = []
  forNoCategory: boolean
  tabMatch: any
  gettingSuggestItems: boolean = false
  addsuggestItems = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  timeslotjson = [];
  menuhoursList = []
  timeSlots: ItemTimeSlot[] = [];
  merchantDto = new MerchantListDto()
  MerchantHoursInfoList: OpeninghourDto[] = []
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

  ngOnInit(): void {
    this.subscribeAppState()
    this.category_id = this.route.snapshot.paramMap.get('catid');
    this.selectedMerchantId = this.route.snapshot.queryParams['merchantid']
    this.userRoleType = this.securityService.securityObject.user.role;
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.tabMatch = fragment.match(/tab=(\d+)/);
        if (this.tabMatch) {
          this.tabMatch = Number(this.tabMatch[1]);
        }
      }
    });

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


    this.GetCategorybyid()
    this.GetCategoryMenubyid()
    this.getAllMenus()
    this.GetMerchantDetail();
    this.GetMerchantHoursInfo();
    this.getCategoryHours()
    this.GetMerchantitems();
    this.GetItemsListById();
    if (this.tabMatch !== undefined && this.tabMatch !== null) {
      this.selectTab(this.tabMatch);
    } else {
      if (this.tabCount === 'items') {
        this.selectTab(2);  // Select tab 2 if tabCount is 'items'
      } else if (this.tabCount === 'menus') {
        this.selectTab(1);  // Select tab 1 if tabCount is 'menus'
      } else {
        this.selectTab(this.selectedTab);  // Default case, select based on selectedTab
      }
    }


  }
  drop(event: CdkDragDrop<string[]>) {
    console.log("drag starting")
    moveItemInArray(this.ItemsList[0].items, event.previousIndex, event.currentIndex);
    this.dataToPush = []
    this.ItemsList[0].items.forEach((x, index) => {
      console.log("drag starting for each")
      this.dataToPush.push({
        "itemId": x.id,
        "sortId": index
      })

    })
    this.merchantService.sortCategoryItems({ "items": this.dataToPush }, this.selectedMerchantId, this.category_id).subscribe((data: any) => {

      this.toaster.success("Sorting saved successfully!");
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
        this.router.navigate(['home/menus/categories']);
      }
    })
  }
  filterMenus(): void {
    if (this.searchTermMenu) {
      this.allMenusList = this.originalItems.filter(item =>
        item.name.toLowerCase().includes(this.searchTermMenu.toLowerCase())
      );
    } else {
      this.allMenusList = [...this.originalItems];
    }
  }

  filterItem(): void {
    if (this.searchTermItem) {
      this.itemsListAll = this.itemsListAllSearch.filter(item =>
        item.itemName.toLowerCase().includes(this.searchTermItem.toLowerCase())
      );
    } else {
      this.itemsListAll = [...this.itemsListAllSearch];
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
    this.getAllMenus()
  }
  closeModalForSuggestCategory() {
    this.suggestCategoryModal.hide()
  }

  addMenu() {
    this.UpdateMenuCategoriesMapping()
    if (this.select_menu_id) {

      this.suggestCategoryModal.hide()
    }

  }

  GetCategorybyid() {
    this.gettingCategoriesbyId = true
    this.gettingMenus = false
    this.gettingItemsById = false
    this.catProductsService.GetCategorybyid(this.selectedMerchantId, this.category_id, this.securityService.securityObject.token).subscribe((data: any) => {
      data
      const { categoryDescription, categoryName, categoryStatus, id, posName } = data;
      this.categoryDescription = categoryDescription;
      this.categoryName = categoryName;
      this.categoryStatus = categoryStatus;
      this.posName = posName;
      this.category_id = id;
      this.gettingCategoriesbyId = false
      if (this.disabled == false) {
        this.edititem()
      }

    },
      (err) => {
        this.toaster.error(err.error.message);
      })


  }

  edititem() {
    this.categoryDescriptionpreserve = this.cloner.deepClone(this.categoryDescription);
    this.categoryNamepreserve = this.cloner.deepClone(this.categoryName);
    this.categoryStatuspreserve = this.cloner.deepClone(this.categoryStatus);
    this.category_idpreserve = this.cloner.deepClone(this.category_id);
    this.category_pos = this.cloner.deepClone(this.posName);

  }
  canceledititem() {

    this.categoryDescription = this.categoryDescriptionpreserve;
    this.categoryName = this.categoryNamepreserve;
    this.categoryStatus = this.categoryStatuspreserve;
    this.category_id = this.category_idpreserve;
    this.posName = this.category_pos;

    this.disabled = true
  }

  async GetCategoryMenubyid(loadProducts: boolean = true) {
    this.gettingMenus = loadProducts
    this.gettingItemsById = false
    this.catProductsService.GetCategoryMenubyid(this.selectedMerchantId, this.category_id, this.securityService.securityObject.token).subscribe(async (data: any) => {
      if (Array.isArray(data) && data.length > 0) {
        this.catMenu = data;
        // this.someMenuText = "";
        this.catMenu.forEach((menu) => {
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

      } else {
        this.catMenu = [];
        this.someMenu = false;
      }
      this.gettingMenus = false
    },

      (err) => {
        this.toaster.error(err.error.message);
      })
  }

  //get the remaining menus
  getAllMenus() {
    this.merchantService.GetMerchantsMenus(this.securityService.securityObject.token, this.selectedMerchantId)
      .subscribe((data: any) => {
        if (Array.isArray(data.data) && data.data.length > 0) {
          // Filter out menus that contain the category_id
          const filteredMenus = data.data.filter(menu =>
            !menu.categories.some(category => category.id === this.category_id)
          );

          this.allMenusList = filteredMenus;
          this.originalItems = [...this.allMenusList];
        } else {
          this.allMenusList = [];
        }
      }, (err) => {
        this.toaster.error(err.message);
        this.allMenusList = [];
      });
  }


  toggleSelectAll(event: any) {
    this.selectAllMenu = event.target.checked;
    this.selectedMenuIds = this.selectAllMenu ? this.allMenusList.map(menu => menu.id) : [];
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

  saveCategoryHours() {
    this.addingCategoriesHours = true;
    this.timeslotjson = this.getTimeSlotsAsJson();
    console.log(this.timeslotjson, this.catMenu);
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
        console.log("data is ", data);
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
        console.log("times are ", times);
        this.timeslotjson.map((tm) => {

          const filterData = times.filter((d) => d.day == tm.weekDay)
          let startingTime = moment(tm?.startTime, 'HH:mm').hours() * 60 + moment(tm?.startTime, 'HH:mm').minutes();
          let endingTime = moment(tm?.endTime, 'HH:mm').hours() * 60 + moment(tm?.endTime, 'HH:mm').minutes();

          // if endTime is smaller than startTime => crosses midnight, add 24h (1440 minutes)
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
                    merchanterrors.push(dayList[row?.day] + "'s category Hours are outside Restaurant Opening Timings")
                  }
                  if (endingTime > rowEnd) {
                    merchanterrors.push(dayList[row?.day] + "'s category Hours are outside Restaurant Closing Timings")
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
                merchanterrors.push(dayList[tm?.weekDay] + "'s category Hours are outside Restaurant Opening Timings")
              } else {
                if (!endhourCheck) {
                  merchanterrors.push(dayList[tm?.weekDay] + "'s category Hours are outside Restaurant Closing Timings")
                } else {
                  merchanterrors.push(dayList[tm?.weekDay] + "'s Restaurant is closed  during a certain time within the category hours.")
                }
              }
            }
            // if(filterData.length> 0){
            //   let startdate = ''
            //   let enddate = ''
            //   filterData.map((row) =>{            
            //     if(startdate){
            //       if(startdate > row.startTime){
            //         startdate = row.startTime
            //       }
            //     }else{
            //       startdate = row.startTime
            //     }
            //     if(enddate){
            //       if(enddate < row.endTime){
            //         enddate = row.endTime
            //       }
            //     }else{
            //       enddate = row.endTime
            //     }
            //   })
            //   if(tm?.closeForBusinessFlag == 0){
            //     if(startingTime > startdate){
            //       merchanterrors.push(dayList[tm?.day] +"'s category Hours are outside Restaurant Opening Timings")
            //     }
            //     if(endingTime < enddate){
            //       merchanterrors.push(dayList[tm?.day] +"'s category Hours are outside Restaurant Closing Timings")
            //     }
            //   }else{
            //     merchanterrors.push('Restaurant is closed on '+ dayList[tm?.day] +" ")
            //   }
          }

          return tm;
        })
      }
    }
    console.log(this.menuhoursList);

    if (this.catMenu) {
      if (this.catMenu.length > 0) {
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
            // if endTime is smaller than startTime => crosses midnight, add 24h (1440 minutes)
            if (endingTime < startingTime) {
              endingTime += 1440;
            }
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
                    menuerrors.push(dayList[row?.day] + "'s category Hours are outside Menu Opening Timings")
                  }
                  if (endingTime > rowEnd) {
                    menuerrors.push(dayList[row?.day] + "'s category Hours are outside Menu Closing Timings")
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
                  menuerrors.push(dayList[tm?.weekDay] + "'s category Hours are outside Menu Opening Timings")
                } else {
                  if (!endhourCheck) {
                    menuerrors.push(dayList[tm?.weekDay] + "'s category Hours are outside Menu Closing Timings")
                  } else {
                    menuerrors.push(dayList[tm?.weekDay] + "'s Menu is closed during a certain time within the category hours.")
                  }
                }
              }
              // if(filterData.length> 0){
              //   let startdate = ''
              //   let enddate = ''
              //   filterData.map((row) =>{            
              //     if(startdate){
              //       if(startdate > row.startTime){
              //         startdate = row.startTime
              //       }
              //     }else{
              //       startdate = row.startTime
              //     }
              //     if(enddate){
              //       if(enddate < row.endTime){
              //         enddate = row.endTime
              //       }
              //     }else{
              //       enddate = row.endTime
              //     }
              //   })
              //   if(startingTime > startdate){
              //     menuerrors.push(dayList[tm?.day] +"'s category Hours are outside Menu Opening Timings")
              //   }
              //   if(endingTime < enddate){
              //     menuerrors.push(dayList[tm?.day] +"'s category Hours are outside Menu Closing Timings")
              //   }
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
                        this.addingCategoriesHours = false;
                        const dayName = Object.keys(dayList).find(
                          key => dayList[key] === slot1.weekDay
                        );
                        this.toaster.error(`Overlapping hours detected for ${dayName}`);
                        return;
                      } else if (
                        (start1 < end2 && end2 < end1) ||
                        (start2 < end1 && end1 < end2)
                      ) {
                        this.addingCategoriesHours = false;
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
    console.log(menuerrors);

    if (menuerrors.length == 0 && merchanterrors.length == 0) {
      this.catProductsService.saveCategoryHours(this.selectedMerchantId, this.category_id, this.timeslotjson).subscribe((data: any) => {

        this.addingCategoriesHours = false;
        this.toaster.success("Category Hours Updated Successfully")
        this.getCategoryHours()

      }, (err) => {
        this.addingCategoriesHours = false;
        this.toaster.error(err.error.message);
      })
    } else {
      this.addingCategoriesHours = false;
      if (menuerrors.length > 0) {
        menuerrors.map((er) => this.toaster.error(er))
      } else if (merchanterrors.length > 0) {
        merchanterrors.map((er) => this.toaster.error(er))
      }
    }
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
  getCategoryHours() {

    this.catProductsService.getCategoryHours(this.selectedMerchantId, this.category_id).subscribe((data: any) => {
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
  isSelected(menuId: string): boolean {
    return this.selectedMenuIds.includes(menuId);
  }

  isSelectedItem(menuId: string): boolean {
    return this.selectedItems.includes(menuId);
  }

  toggleMenu(menuId: string, event: any) {
    const checked = event.target.checked;
    if (checked) {
      this.selectedMenuIds.push(menuId);
    } else {
      this.selectedMenuIds = this.selectedMenuIds.filter(id => id !== menuId);
    }
    this.selectAllMenu = this.allMenusList.length === this.selectedMenuIds.length;
  }

  onItemChange(itemId: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedItems.push(itemId);
    } else {
      this.selectedItems = this.selectedItems.filter(id => id !== itemId);
    }
    this.selectAllItems = this.itemsListAll.length === this.selectedItems.length;
  }

  toggleSelectAllItems(event: any) {
    this.selectAllItems = event.target.checked;
    this.selectedItems = this.selectAllItems ? this.itemsListAll.map(menu => menu.id) : [];
  }



  DeleteMenuCategories(id: any) {
    let nObj = id;
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove Category";
    modalDto.Description = " By taking this action, you will remove the category from this menu."
    modalDto.Text = "Would you like to remove the category from this menu?";
    modalDto.acceptButtonText = "Yes, Remove Category"
    modalDto.callBack = this.DeleteMenuCategoriesMapping;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModalNew(modalDto);
  }



  DeleteMenuCategoriesMapping = (menuId) => {
    let data = {
      "categoryId": this.category_id,
      "delete": 1
    }
    this.workingWithRemove = menuId
    this.merchantService.updateMenuCategories(this.selectedMerchantId, menuId, data).subscribe((data: any) => {
      var isunassign = true
      if (data?.data?.platformtype !== undefined && data?.data?.platformtype !== null) {
        const platformtype = data.data.platformtype;

        // Show message only if platformtype is 4 or 6
        if (platformtype === 4) {
          isunassign = false
          this.toaster.info("The menu is downloaded from Clover. Unlinking categories isn't allowed. Please do this in Clover.");
        }
        else if (platformtype === 11) {
          isunassign = false
          this.toaster.info("The menu is downloaded from Square. Unlinking categories isn't allowed. Please do this in Square.");
        }
      }
      if (isunassign == true) {
        this.GetCategoryMenubyid(false)
        this.getAllMenus()
        this.toaster.success("Categories updated")
      }

      this.workingWithRemove = ''
    }, (err) => {
      this.savingAssignCategories = false;
      this.toaster.error(err.error.message);
    })

  }

  UpdateMenuCategoriesMapping() {
    let data = {
      "menuid": this.selectedMenuIds,
      "delete": 0
    }
    this.addingMenus = true;
    this.merchantService.updateMenuCategoriesMappings(this.selectedMerchantId, this.category_id, data, this.securityService.securityObject.token).subscribe((data: any) => {
      this.GetCategoryMenubyid()
      this.getAllMenus()
      this.selectedMenuIds = []
      this.addingMenus = false;
      this.toaster.success("Menu mapping updated!")
      this.select_menu_id = true
      this.closeModalForSuggestCategory()
    }, (err) => {
      this.toaster.error(err.error.message);
    })


  }




  DeleteItemForCategory(id: any) {
    let nObj = id;
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove Item";
    modalDto.Description = " By taking this action, you will remove the item from this category."
    modalDto.Text = "Would you like to remove the item from this category?";
    modalDto.acceptButtonText = "Yes, Remove Item"
    modalDto.callBack = this.DeleteItemForCategoryCallback;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModalNew(modalDto);
  }

  DeleteItemForCategoryCallback = (id: string) => {
    let data = {
      "itemId": id,
      "delete": 1
    }
    this.workingWithRemove = id
    this.itemService.UpdateCategoryItems(this.selectedMerchantId, this.category_id, data).subscribe((data: any) => {
      this.toaster.success("Item Removed from Category");
      this.GetItemsListById(false)
      this.GetMerchantitems()
      this.workingWithRemove = ''
    }, (err) => {
      this.toaster.error(err.error.message);
    })

  }

  openModalForAddItems() {
    this.selectedItems = []
    this.addItemsModal.show()
  }
  closeModalForAddItems() {
    this.addItemsModal.hide()
  }

  addItems() {
    this.addItemsModal.hide()
  }

  //get the items which are attached with category
  GetItemsListById(loadProducts: boolean = true) {
    this.gettingItemsById = loadProducts
    this.catProductsService.GetCategoriesWithItems(this.selectedMerchantId, this.securityService.securityObject.token)
      .subscribe((data: CategoryWithOptDto[]) => {
        if (data) {
          this.ItemsList = data.filter(category => category.id === this.category_id);

          this.someItems = this.ItemsList.length > 0 && this.ItemsList[0].items.length > 0;
          // this.forNoCategory = !this.someItems
          this.categoriesPreserve = this.cloner.deepClone(this.CategoriesList);
          this.GetMerchantitems()
          this.gettingItemsById = false
        }
      }, (err) => {
        this.toaster.error(err.message);
      });
  }
  //get all merchant items
  GetMerchantitems(merchantId?: string) {
    let mMerchant = this.selectedMerchantId;
    if (merchantId) {
      mMerchant = merchantId;
    }
    this.itemsListAll = [];
    this.itemService.getMerchantitems(mMerchant, this.securityService.securityObject.token).subscribe((data: ItemDto[]) => {
      this.itemsListAll = data
      this.itemsListAll = this.itemsListAll.filter(item => item.itemType !== 2);
      const excludedItemIds = this.ItemsList[0].items.map(item => item.id)
      this.itemsListAll = this.itemsListAll.filter(item => !excludedItemIds.includes(item.id));
      this.forNoCategory = this.itemsListAll.length == 0

      this.itemsListAllSearch = [...this.itemsListAll];

    }, (err) => {
      this.toaster.error(err.message);
    })
  }




  EditCategoryForMerchant() {

    this.addingCategories = true;
    this.addCategoryObj.token = this.securityService.securityObject.token;
    this.addCategoryObj.category.categoryStatus = this.categoryStatus;
    this.addCategoryObj.category.categoryName = this.categoryName;
    this.addCategoryObj.category.posName = this.posName;
    this.addCategoryObj.category.categoryDescription = this.categoryDescription;
    this.addCategoryObj.category.id = this.category_id;
    this.catProductsService.EditCategoryForMerchant(this.selectedMerchantId, this.addCategoryObj).subscribe((data: ProductListDto[]) => {
      this.categoryStatusToogleCallback()
      this.toaster.success("Category Updated!")
      this.disabled = true
      this.addingCategories = false;
    }, (err) => {
      this.toaster.error(err.message);
      this.disabled = false
    })
  }


  categoryStatusToogleCallback() {

    if (this.categoryStatuspreserve != this.categoryStatus) {
      this.catProductsService.DisableEnableCategory(this.selectedMerchantId, this.category_id, {
        "categoryStatus": this.categoryStatus
      }).subscribe((data: any) => {
        //this.toaster.success('Category status changed.');
        console.log("category status changed, items status changes")

      }, (err) => {
        this.toaster.error(err.error.message);
      })
    } else {
      console.log("category status is same already")
    }


  }


  UpdateitemsForCategoriesAndAddonOptions() {
    this.addingItems = true
    let data = {}
    data = {
      "itemId": this.selectedItems,
      "delete": 0
    }

    this.itemService.UpdateCategoryItems(this.selectedMerchantId, this.category_id, data).subscribe((data: any) => {
      this.addingItems = false;

      this.toaster.success("Item Added to Category");
      this.addItemsModal.hide()
      this.closeModalForAddItems()
      this.GetItemsListById()

      this.selectedItems = []
    }, (err) => {
      this.addItemsModal.hide()
      this.toaster.error("Some of items are already assigned.");
    })


  }



}