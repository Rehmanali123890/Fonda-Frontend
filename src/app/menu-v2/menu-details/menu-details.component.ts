import { Component, OnInit, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/core/security.service';
import { ToastrService } from 'ngx-toastr';
import { MerchantService } from './../../core/merchant.service';
import { AppStateService } from 'src/app/core/app-state.service';
import { WeekDay, TimeSlot, MerchatMenu, MerchantPlatformsEnumNewMenu, Platforms, OpeninghourDto } from 'src/app/Models/merchant.model';
import { MerchantListDto, virtualMerchants } from 'src/app/Models/merchant.model';
import { ModalDirective } from 'angular-bootstrap-md';
import { ProductsCategoriesService } from './../../core/products-categories.service';
import { ClonerService } from './../../core/DataServices/cloner.service';
import { ItemService } from './../../core/item.service';
import { ItemDto } from 'src/app/Models/item.model';
import Swal from 'sweetalert2'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AddCategoryDto, CategoryDto, CategoryStatusEnum, ProductListDto, ProductStatusEnum, AddEditAddonDto, AddonDto, AddonStatusEnum, AddonOptionDto, AddonOptionStatusEnum, AddEditProductDto, AddonDtoWithOptions, CategoryWithOptDto } from './../../Models/Cat_Product.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Platform } from '@angular/cdk/platform';
import { UserRoleEnum } from "../../Models/user.model";
import { LazyModalDto, LazyModalDtoNew } from 'src/app/Models/app.model';
import { AppUiService } from './../../core/app-ui.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as moment from 'moment';




@UntilDestroy()
@Component({
  selector: 'app-menu-details',
  templateUrl: './menu-details.component.html',
  styleUrls: ['./menu-details.component.css']
})
export class MenuDetailsComponent implements OnInit {


  @ViewChild('createMenuModal') createMenuModal: ModalDirective;
  @ViewChild('suggestCategoryModal') suggestCategoryModal: ModalDirective;
  @ViewChild('addItemsModal') addItemsModal: ModalDirective;
  @ViewChild('setTimeModal') setTimeModal: ModalDirective;
  @ViewChild('removeCategoryModal') removeCategoryModal: ModalDirective;
  @ViewChild('activeModal') activeModal: ModalDirective;
  @ViewChild('cuisineOtherOption') cuisineOtherOption: ModalDirective;



  merchantDto = new MerchantListDto();
  selectedTab = 0;
  forNoCategory: boolean = false;
  addedCategories: boolean = false;
  addedItems: boolean = false;
  CategoriesList: CategoryWithOptDto[] = []
  AllCategoriesList: CategoryWithOptDto[] = []
  gettingCategories = true;
  addedCategorieslist = false
  categoriesPreserve: CategoryWithOptDto[] = [];
  selectedCategoryId = ''
  selectedCategoryIds = []
  selectedItemId = ''
  selectedItemIds = []
  selectedFileName: string | null = null;
  selectedFiles: File[] = [];
  scaningMenuSpinner: boolean;
  menuScanCreated: boolean = false;
  createMenu: boolean = true;
  addMenu: boolean = true;
  MerchantPlatformsEnumNewMenu = MerchantPlatformsEnumNewMenu;
  addmanualmenu: boolean = true
  createMenuSecondStep: boolean = false;
  creatingMenuSpinner: boolean = false;
  menuCreated: boolean = false;
  scanMenu: boolean = false;
  selectedOption: string | null = null;
  isContinueEnabled: boolean = false;
  timeslotjson = [];
  menuId = ''
  UpdatingitemsForCategories = false
  WeekDay = WeekDay
  selectedDayDropdown: number = 0
  defaultData = [];
  savingHoursInfo: boolean;
  loadingSlots: boolean = false
  selectedMerchantId: string
  addingMenu: boolean = false
  menuobj = new MerchatMenu();
  menuobjpreserve = new MerchatMenu();
  savingAssignCategoriesToMenu: boolean = false;
  gettingProducts = true;
  workingwithremovecategory = ''
  productsListPreserve: ItemDto[] = [];
  Changecategoryitemstatus = 0
  menuPlatforms: Platforms[];
  selectedValue = ''
  disabled: boolean = true
  catupdationloader: boolean = false
  MerchantHoursInfoList: OpeninghourDto[] = []
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
  cuisineList: string[] = [
    "American",
    "Argentinian",
    "Bahamian",
    "Bakery",
    "Brazilian",
    "British",
    "Canadian",
    "Caribbean",
    "Chilean",
    "Chinese",
    "Colombian",
    "Costa Rican",
    "Cuban",
    "Dominican",
    "Ecuadorian",
    "Egyptian",
    "Ethiopian",
    "Filipino",
    "French",
    "German",
    "Greek",
    "Guatemalan",
    "Haitian",
    "Honduran",
    "Indian",
    "Indonesian",
    "Israeli",
    "Italian",
    "Jamaican",
    "Japanese",
    "Korean",
    "Lebanese",
    "Malaysian",
    "Mediterranean",
    "Mexican",
    "Moroccan",
    "Nicaraguan",
    "Nigerian",
    "Panamanian",
    "Persian",
    "Peruvian",
    "Portuguese",
    "Puerto Rican",
    "Russian",
    "Salvadorean",
    "South African",
    "Spanish",
    "Thai",
    "Turkish",
    "Vietnamese",
    "Venezuelan",
    "Other"
  ];
  availableTimezones: string[] = ['(GMT 8:00) Pacific Time', '(GMT 8:00) Pacific Time', '(GMT 8:00) Pacific Time'];
  availableDays: string[] = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
  dropdownList = [];
  selectedItems = [];
  selectedItemsprserve = [];
  dropdownSettings = {};
  gettingMenu: boolean = true;
  // List of time slots
  timeSlots: TimeSlot[] = [];
  timeSlotsprserve: TimeSlot[] = [];
  originalItems: CategoryWithOptDto[] = [];
  searchTerm: string = '';
  ProductsList: ItemDto[] = []
  ProductsListformodal: ItemDto[] = []
  originalProduct: ItemDto[] = [];
  searchTermProduct: string = '';
  areAllAccordionsOpen: boolean = true;
  dataToSort = [];
  dataToPush: any = []
  categoryid = ''
  dataToPushforcategory: any = []
  virtualMerchants: virtualMerchants[] = [];
  allConnectedPlatforms = [];
  userRoleType: UserRoleEnum;
  SelectedCuisnieList = []
  PlatformForTime = [];
  isMobileView: boolean = false;
  cuisineOther = '';

  constructor(private renderer: Renderer2, private itemService: ItemService, private toaster: ToastrService, private securityService: SecurityService, private router: Router,
    private merchantService: MerchantService, private appState: AppStateService, private route: ActivatedRoute, private catProductsService: ProductsCategoriesService
    , private cloner: ClonerService, private appUi: AppUiService, private cdr: ChangeDetectorRef, private breakpointObserver: BreakpointObserver) { }


  ngOnInit(): void {

    this.dropdownsetting()
    this.menuId = this.route.snapshot.paramMap.get('menuid');
    this.selectedMerchantId = this.route.snapshot.queryParams['merchantid']
    this.userRoleType = this.securityService.securityObject.user.role;
    this.route.queryParams.subscribe(params => {
      // Check if 'edit' query param exists and process accordingly
      if (params['edit'] !== undefined) {
        this.disabled = params['edit'] !== 'true';
      }
      console.log('Edit Mode:', this.disabled);
    });

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const tabMatch = fragment.match(/tab=(\d+)/);
        if (tabMatch) {
          this.selectedTab = Number(tabMatch[1]);
        }
      }
    });
    this.subscribeAppState()
    this.GetMerchantDetail()
    this.GetMerchantHoursInfo()
    this.GetMenubyId()
    this.GetCategoriesList()
    this.getAllVirtualRestaurants()
    this.getAllConfigOptions()
    this.selectTab(this.selectedTab)

    // disable section sort for categories for mobile
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobileView = result.matches;
    });

  }
  disableScrolling() {
    document.body.style.overflow = 'hidden'; // Prevents scrolling when dragging
  }

  enableScrolling() {
    document.body.style.overflow = 'auto'; // Restores scrolling
  }

  getAllConfigOptions() {
    this.itemService.getCuisineTypeList('cuisine').subscribe((data: any) => {
      let configList = [...this.cuisineList];

      if (data?.data) {
        data?.data.map((val) => {
          if (val?.config_value) {
            if (!configList.includes(val?.config_value)) {
              configList.push(val?.config_value);
            }
          }
          return val;
        })
      }
      this.cuisineList = configList;
    }, (err) => {
      console.log(err.error);
      this.toaster.error(err.error.message);
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

  
  formatCurrency(value: number | string): string {
    if (value === null || value === undefined || value === '') {
      return '$0.00';
    }

    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      return '$0.00';
    }
    const formattedValue = numericValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `$${formattedValue}`;
  }
  onDragStarted(obj: any) {
    console.log("drag starting")
    this.dataToSort = obj.items
    this.categoryid = obj.id
    console.log("categorylist obj in on drga", this.CategoriesList)
  }
  drop(event: CdkDragDrop<string[]>) {
    console.log("drag starting")
    moveItemInArray(this.dataToSort, event.previousIndex, event.currentIndex);
    this.dataToPush = []
    this.dataToSort.forEach((x, index) => {
      console.log("drag starting for each")
      this.dataToPush.push({
        "itemId": x.id,
        "sortId": index
      })

    })
    this.merchantService.sortCategoryItems({ "items": this.dataToPush }, this.selectedMerchantId, this.categoryid).subscribe((data: any) => {

      this.toaster.success("Sorting saved successfully!");
    }, (err) => {
      this.toaster.error(err.error.message);
    })

  }
  dropcategory(event: CdkDragDrop<string[]>) {
    console.log("drag starting")
    moveItemInArray(this.CategoriesList, event.previousIndex, event.currentIndex);
    this.dataToPushforcategory = []
    this.CategoriesList.forEach((x, index) => {
      console.log("drag starting for each")
      this.dataToPushforcategory.push({
        "categoryId": x.id,
        "sortId": index
      })

    })
    this.merchantService.sortMenuCategories({ "categories": this.dataToPushforcategory }, this.selectedMerchantId, this.menuId).subscribe((data: any) => {

      // this.toaster.success("Order saved successfully!");
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
        this.router.navigate(['home/menus/menu']);
      }
    })
  }
  filterCategories(): void {
    if (this.searchTerm) {
      this.AllCategoriesList = this.originalItems.filter(category =>
        category.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.AllCategoriesList = [...this.originalItems];
    }
  }

  filterProducts(): void {
    if (this.searchTermProduct) {
      this.ProductsListformodal = this.originalProduct.filter(category =>
        category.itemName.toLowerCase().includes(this.searchTermProduct.toLowerCase())
      );
    } else {
      this.ProductsListformodal = [...this.originalProduct];
    }
  }

  getAllConnectedPlatforms() {
    this.loadingSlots = true;
    this.merchantService.getAllConnectedPlatforms(this.selectedMerchantId).subscribe((data: any) => {
      this.allConnectedPlatforms = data.data
      console.log("this.allConnectedPlatforms", this.allConnectedPlatforms)
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }

  onItemDeSelect(itemtobeRemove: any) {
    let itemtobeRemoveCap = itemtobeRemove.charAt(0).toUpperCase() + itemtobeRemove.slice(1).toLowerCase();
    let message = `Confirm removal of "${itemtobeRemoveCap}" from this menu?`;
    this.allConnectedPlatforms = this.allConnectedPlatforms.filter(connectedPlatform => {
      // Compare 'platformtype' in allConnectedPlatforms with 'platformType' in menuPlatforms
      return !this.menuPlatforms.some(menuPlatform => menuPlatform.platformType === connectedPlatform.platformtype);
    });
    Swal.fire({
      title: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085D6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Okay',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("confirm this")
        this.menuobj.menuPlatforms = this.menuobj.menuPlatforms.filter(item => item !== itemtobeRemove);

        let type: number = MerchantPlatformsEnumNewMenu[itemtobeRemove as keyof typeof MerchantPlatformsEnumNewMenu];
        this.PlatformForTime = this.PlatformForTime.filter(platformType => platformType !== type);
        this.checkUbereatsConnected()

      } else if (result.isDismissed) {
        console.log("cancel this")
        this.selectedItems = this.menuobj.menuPlatforms
      }
    });

  }


  onItemSelect(event: any) {

    if (Object.keys(MerchantPlatformsEnumNewMenu).includes(event)) {
      let message = `The platform "${event}" is already attached to another menu. Please remove it from the other menu.`;
      let type: number = MerchantPlatformsEnumNewMenu[event as keyof typeof MerchantPlatformsEnumNewMenu];

      this.allConnectedPlatforms = this.allConnectedPlatforms.filter(connectedPlatform => {
        // Compare 'platformtype' in allConnectedPlatforms with 'platformType' in menuPlatforms
        return !this.menuPlatforms.some(menuPlatform => menuPlatform.platformType === connectedPlatform.platformtype);
      });


      console.log("event handler is", event)
      if (type === 2 || type === 11 || type === 4 || type === 7 || type === 8 || type === 50) {

        let typeStr: string = type.toString();

        const hasMatchingPlatform = this.allConnectedPlatforms.some(platform => {
          let platformTypeStr: string = platform.platformtype.toString(); // Convert platformtype to string
          return platformTypeStr === typeStr; // Compare with the provided typeStr
        });

        if (hasMatchingPlatform) {
          this.selectedItems = [...this.menuobj.menuPlatforms]
          Swal.fire({
            title: message,
            icon: 'question',
            showCancelButton: false,
            confirmButtonColor: '#3085D6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Okay',
            cancelButtonText: 'Cancel'
          }).then((result) => {
            if (result.isConfirmed) {

            }
          });

        } else {
          this.menuobj.menuPlatforms.push(event)
          if (!this.PlatformForTime.includes(type)) {
            this.PlatformForTime.push(type);
          }
        }
      }
      else {
        this.menuobj.menuPlatforms.push(event)
        if (!this.PlatformForTime.includes(type)) {
          this.PlatformForTime.push(type);
        }
      }
    }
  }
  toggleAllAccordions() {
    this.areAllAccordionsOpen = !this.areAllAccordionsOpen;
    const accordions = document.querySelectorAll('.accordion-collapse');
    const buttons = document.querySelectorAll('.accordion-button');

    accordions.forEach((accordion: Element) => {
      if (this.areAllAccordionsOpen) {
        this.renderer.addClass(accordion, 'show');
      } else {
        this.renderer.removeClass(accordion, 'show');
      }
    });
    buttons.forEach((button: Element) => {
      if (this.areAllAccordionsOpen) {
        this.renderer.removeClass(button, 'collapsed');
      } else {
        this.renderer.addClass(button, 'collapsed');
      }
    });
  }
  get underlineStyle() {
    return `translateX(${this.selectedTab * 100}%)`;
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
  selectTab(index: number) {
    this.selectedTab = index;
    this.router.navigate([], {
      fragment: `tab=${index}`,
      queryParamsHandling: 'preserve'  // Preserve existing query params
    });
  }
  getMenuHours() {

    this.merchantService.getMenuHours(this.selectedMerchantId, this.menuId).subscribe((data: any) => {
      console.log("data of get menu hours is ", data)
      this.timeSlots = this.groupByTimeAndDay(data.data)
      if (this.disabled == false) {
        this.editmenu()
      }
      else {
        console.log("this . timeslots ", this.timeSlots)
        this.loadingSlots = false

        this.disabled = true
      }

    }, (err) => {
      this.disabled = true
      this.loadingSlots = false;
      this.toaster.error(err.error.message);
    })
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


  GetMenubyId() {
    this.merchantService.GetMerchantsMenuById(this.securityService.securityObject.token, this.selectedMerchantId, this.menuId).subscribe((data: any) => {
      this.menuobj = data.data
      this.menuPlatforms = this.menuobj.menuPlatforms
      console.log("this.menuobj  ", this.menuobj)
      if (this.menuobj.cusines && this.menuobj.cusines.trim() !== '') {
        this.SelectedCuisnieList = this.menuobj.cusines.split(',').map(cuisine => cuisine.trim());
      } else {
        this.SelectedCuisnieList = []; // Set an empty array if no cuisines exist
      }
      console.log(this.SelectedCuisnieList)
      this.selectedItems = this.menuobj.menuPlatforms.map(item => MerchantPlatformsEnumNewMenu[item.platformType]);
      this.PlatformForTime = this.menuobj.menuPlatforms.map(item => item.platformType)
      this.menuobj.menuPlatforms = this.selectedItems
      this.getAllConnectedPlatforms()
      if (!this.cuisineList.includes(this.menuobj.cusines)) {
        this.cuisineList.push(this.menuobj.cusines);
      }
      if (this.menuobj.virtualMerchants.length > 0) {
        this.menuobj.vmerchantId = this.menuobj.virtualMerchants[0].id
      }
      this.getMenuHours()
      console.log("this.menu obj is", this.menuobj)
    }, (err) => {
      this.gettingMenu = false
      this.toaster.error(err.error.message);
    })
  }


  removeCuisine(cuisine: any): void {
    const index = this.SelectedCuisnieList.indexOf(cuisine);
    if (index !== -1) {
      this.SelectedCuisnieList.splice(index, 1);  // Remove the deselected item
    }
    console.log(this.SelectedCuisnieList)
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




  GetCategoriesList(loadProducts?: boolean) {
    this.areAllAccordionsOpen = true
    this.CategoriesList = [];
    this.catProductsService.GetCategoriesWithItems(this.selectedMerchantId, this.securityService.securityObject.token, this.menuId).subscribe((data: CategoryWithOptDto[]) => {
      this.CategoriesList = data;
      if (data) {
        this.categoriesPreserve = this.cloner.deepClone(data);
      }
      if (this.CategoriesList.length > 0) {

        this.addedCategorieslist = true
        this.addedCategories = true
      }

      this.gettingCategories = false;
      this.GetAllCategoriesList()
      this.GetProductsList()
    }, (err) => {
      this.gettingCategories = false;
      this.toaster.error(err.message);
    })
  }


  GetAllCategoriesList(loadProducts?: boolean) {
    this.AllCategoriesList = [];
    this.catProductsService.GetCategoriesWithItems(this.selectedMerchantId, this.securityService.securityObject.token).subscribe((data: CategoryWithOptDto[]) => {
      this.AllCategoriesList = data;

      this.removeInstances();

    }, (err) => {
      this.toaster.error(err.message);
    })
  }



  unAssignCategory(id: any) {
    let nObj = id;
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove Category";
    modalDto.Description = `This category has items related to it in this menu. By taking this action, you will remove the category and all items within the category.`
    modalDto.acceptButtonText = "Yes, Remove Category";
    modalDto.Text = "Would you like to remove the category and all related items from this menu?";
    modalDto.callBack = this.unAssignCategoryCallback;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModalNew(modalDto);
  }


  unAssignCategoryCallback = (categoryid: any) => {
    let data = {}
    this.workingwithremovecategory = categoryid
    this.catupdationloader = false
    data = {
      "categoryId": categoryid,
      "delete": 1
    }
    this.merchantService.updateMenuCategories(this.selectedMerchantId, this.menuId, data).subscribe((data: any) => {
      this.savingAssignCategoriesToMenu = false;
      this.suggestCategoryModal.hide()
      this.workingwithremovecategory = ""
      this.catupdationloader = false
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
        this.toaster.success("Category removed from Menu successfully")
        this.removeCategoryById(categoryid)
        this.GetAllCategoriesList()
      }

      // Check if 'platformtype' exists and is not null

      // this.GetCategoriesList()
    }, (err) => {
      this.workingwithremovecategory = ""
      this.savingAssignCategoriesToMenu = false;
      this.catupdationloader = false
      this.suggestCategoryModal.hide()
      this.toaster.error(err);
    })
  }



  UpdateMenuCategories(categoryid?: any) {
    let data = {}
    this.addedCategories = false;
    this.addedItems = false;
    this.gettingMenu = true
    this.savingAssignCategoriesToMenu = true;
    data = {
      "categoryId": this.selectedCategoryIds,
      "delete": 0
    }
    this.merchantService.updateMenuCategories(this.selectedMerchantId, this.menuId, data).subscribe((data: any) => {
      this.savingAssignCategoriesToMenu = false;
      this.toaster.success("Category added to Menu successfully")
      this.suggestCategoryModal.hide()
      this.GetCategoriesList()
    }, (err) => {
      this.savingAssignCategoriesToMenu = false;
      this.suggestCategoryModal.hide()
      this.toaster.error("This category already assigned to this menu.");
    })

  }

  GetProductsList() {
    this.ProductsList = [];
    this.itemService.getMerchantitems(this.selectedMerchantId, this.securityService.securityObject.token).subscribe((data: ItemDto[]) => {
      this.ProductsList = data;
      this.ProductsList = this.ProductsList.filter(item => item.itemType !== 2);

      if (data) {
        this.productsListPreserve = this.cloner.deepClone(data);
      }
      this.gettingMenu = false;
      this.catupdationloader = false
    }, (err) => {
      this.gettingMenu = false;
      this.catupdationloader = false
      this.toaster.error(err.message);
    })
  }

  UpdateitemsForCategoriesAndAddonOptions(obj?: any) {
    let deleted = 0
    let data = {}
    if (obj) {
      this.selectedCategoryId = obj.categoryid
      data = {
        "itemId": obj.itemid,
        "delete": 1
      }
      deleted = 1
    }
    else {

      this.addedCategories = false;
      this.addedItems = false;
      this.gettingMenu = true
      this.UpdatingitemsForCategories = true;
      data = {
        "itemId": this.selectedItemIds,
        "delete": 0
      }
    }
    this.itemService.UpdateCategoryItems(this.selectedMerchantId, this.selectedCategoryId, data).subscribe((data: any) => {
      this.UpdatingitemsForCategories = false;
      this.addItemsModal.hide()
      if (deleted) {

        this.toaster.success("Item removed from menu successfully");
      } else {
        this.toaster.success("Item added to menu successfully");
      }
      if (obj) {
        this.removeItemById(obj.itemid)
        this.catupdationloader = false
      }
      else {
        this.GetCategoriesList()
      }

    }, (err) => {
      this.UpdatingitemsForCategories = false;
      this.addItemsModal.hide()
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
      } else {
        groupedData.push({
          startTime: item.startTime,
          endTime: item.endTime,
          timezone: "(GMT 8:00) Pacific Time",
          selectedDays: [WeekDay[item.weekDay]]
        });
      }
    });
    return groupedData;
  }


  getAllVirtualRestaurants() {

    this.merchantService.GetVirtualRestaurants(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: any) => {
      this.virtualMerchants = data.data;

      this.gettingMenu = false
    }, (err) => {
      this.toaster.error(err.message);
    })
  }
  dropdownsetting() {
    this.dropdownList = ['grubhub', 'square', 'GMB', 'clover', 'ubereats', 'flipdish', 'storefront', 'Stream'];

    this.dropdownSettings = {
      singleSelection: false,
      itemsShowLimit: 8,
      allowSearchFilter: true,
      enableCheckAll: false
    };
  }

  addCuisine(cuisine: string) {
    if (cuisine === 'Other') {
      this.SelectedCuisnieList = this.SelectedCuisnieList.filter((data) => data !== 'Other');
      this.cuisineOtherOption.show();
    } else {
      if (!this.SelectedCuisnieList.includes(cuisine)) {
        let listData = [...this.SelectedCuisnieList];
        listData.push(cuisine);
        this.SelectedCuisnieList = listData;
      }
    }
  }

  addCuisineOther = async () => {
    if (this.cuisineOther.trim()) {
      if (this.cuisineList.filter((data) => data == this.cuisineOther).length > 0) {
        this.toaster.error("'" + this.cuisineOther + "' value for Cuisine Type is already registered.")
        this.cuisineOther = '';
        this.cuisineOtherOption.hide();
      } else {
        await this.itemService.createCuisineOption(this.cuisineOther, 'cuisine').subscribe(async (data: any) => {
          this.toaster.success("Cuisine Type added successfully!");
          await this.getAllConfigOptions()

          if (!this.SelectedCuisnieList.includes(this.cuisineOther)) {
            let listData = [...this.SelectedCuisnieList];
            listData.push(this.cuisineOther);
            this.SelectedCuisnieList = listData;
          }
          this.cuisineOther = '';
          this.cuisineOtherOption.hide();

        }, (err) => {
          this.cuisineOther = '';
          this.toaster.error(err.error.message);
          this.cuisineOtherOption.hide();
        })
      }
    }
  }

  resetObj() {
    this.cuisineOther = ''
  }
  checkUbereatsConnected() {

    if (this.menuobj.menuPlatforms.length > 0) {
      let check = this.PlatformForTime.filter(x => x == 3 || x == 7 || x == 8)
      if (check.length > 0) {
        return true
      }
    }

    return false
  }

  updatemenu() {
    console.log("timeSlots  ", this.timeSlots)
    console.log("menuobj  ", this.menuobj)
    this.addingMenu = true;

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
    let errors = []
    if(this.MerchantHoursInfoList){
      let times = [];
      this.MerchantHoursInfoList.map((data)=>{
        let startingTime = moment(data?.openTime, 'HH:mm A').format('HH:mm');
        console.log("starting time is ", startingTime ,"for day ", data.day);
        let endingTime = moment(data?.closeTime, 'HH:mm A').format('HH:mm');
        console.log("ending time is ", endingTime, "for day ", data.day);
          times.push({day:dayList[data.day], startTime: startingTime, endTime: endingTime, closeForBusinessFlag: data?.closeForBusinessFlag})
      })
      if(times.length > 0){        
        const dayList = {
          1 : 'Monday',
          2 : 'Tuesday',
          3 : 'Wednesday',
          4 : 'Thursday',
          5 : 'Friday',
          6 : 'Saturday',
          7 : 'Sunday',
        }
        this.timeslotjson.map((tm) => {         

          const filterData = times.filter((d) => d.day == tm.weekDay)
          let startingTime = moment(tm?.startTime, 'HH:mm').hours() * 60 + moment(tm?.startTime, 'HH:mm').minutes();
          let endingTime = moment(tm?.endTime, 'HH:mm').hours() * 60 + moment(tm?.endTime, 'HH:mm').minutes();
          if (endingTime < startingTime) {
            endingTime += 1440;
          }
          if(filterData.length> 0){
            let hourCheck = false
            let starthourCheck = false
            let endhourCheck = false
            filterData.map((row) =>{     
              let rowStart = moment(row?.startTime, 'HH:mm').hours() * 60 + moment(row?.startTime, 'HH:mm').minutes();
              let rowEnd = moment(row?.endTime, 'HH:mm').hours() * 60 + moment(row?.endTime, 'HH:mm').minutes();
              
              if (rowEnd < rowStart) {
                rowEnd += 1440;
              } 
              if (startingTime >= rowStart && endingTime <= rowEnd){
                hourCheck = true;
                
                if(row?.closeForBusinessFlag == 0){
                  if(startingTime < rowStart){
                    errors.push(dayList[row?.day] +"'s Menu Hours are outside Restaurant Opening Timings")
                  }
                  if(endingTime > rowEnd){
                    errors.push(dayList[row?.day] +"'s Menu Hours are outside Restaurant Closing Timings")
                  }
                }else{
                  errors.push('Restaurant is closed on '+ dayList[row?.day] +" ")
                }
              }else{
                if(!hourCheck){
                  hourCheck = false;
                }
                if(startingTime >= rowStart && startingTime <= rowEnd){                  
                  if(!starthourCheck){
                    starthourCheck = true
                  }
                }
                if(endingTime >= rowStart && endingTime <= rowEnd){
                  if(!endhourCheck){
                    endhourCheck = true
                  }
                }
              }
            })
            if(!hourCheck){
              if(!starthourCheck){
                errors.push(dayList[tm?.weekDay] +"'s Menu Hours are outside Restaurant Opening Timings")
              }else{
                if(!endhourCheck){
                  errors.push(dayList[tm?.weekDay] +"'s Menu Hours are outside Restaurant Closing Timings")
                }else{
                  errors.push(dayList[tm?.weekDay] +"'s Restaurant is closed  during a certain time within the Menu hours.")
                }
              }
            }
          }
        
        return tm;
        })
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
                this.addingMenu = false;
                const dayName = Object.keys(dayList).find(
                  key => dayList[key] === slot1.weekDay
                );
                this.toaster.error(`Overlapping hours detected for ${dayName}`);
                return;
              } else if (
                (start1 < end2 && end2 < end1) ||
                (start2 < end1 && end1 < end2)
              ) {
                this.addingMenu = false;
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

    if(errors.length == 0){
      //console.log("timeslotjson  json ", this.timeslotjson)
      this.menuobj['new_menu'] = true
      //console.log("this.SelectedCuisnieList", this.SelectedCuisnieList)
      this.menuobj.cusines = this.SelectedCuisnieList.join(', ');
      //console.log("updated obj ", this.menuobj)
      this.merchantService.updateMerchantMenu(this.securityService.securityObject.token, this.menuobj, this.selectedMerchantId, this.menuId).subscribe((data: any) => {
        this.menuobj = data.data
        //console.log("cretae new merchant menu ", this.menuobj)
        if (this.timeslotjson.length >= 0) {
          this.saveMenuHours(this.menuobj.id, this.timeslotjson)
        }
        else {
          this.setdefault()
        }
      }, (err) => {
        this.disabled = true
        this.addingMenu = false;
        this.toaster.error(err.error.message);
      })
    }else{
      this.addingMenu = false;
      errors.map((er) => this.toaster.error(er))
    }
  }

  saveMenuHours(menuId, timeslotjson) {
    console.log("timeslotjson to save ", timeslotjson)
    this.merchantService.saveMenuHours(this.selectedMerchantId, menuId, timeslotjson).subscribe((data: any) => {
      this.setdefault()
    }, (err) => {
      this.setdefault()
      this.addingMenu = false;
      this.toaster.error(err.error.message);
    })
  }

  addNewTimeSlot(): void {
    this.timeSlots.push(new TimeSlot());

  }
  setdefault() {
    this.addingMenu = false;
    this.disabled = true
    this.toaster.success("Menu Updated successfully.")
    this.GetMenubyId()
    this.getMenuHours()
  }
  // Function to handle the toggling of days
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
  onOptionChange(option: string): void {

    this.selectedOption = option;
    this.isContinueEnabled = true;
  }
  resetMenuObj() {
    this.menuobj = new MerchatMenu();
    this.timeSlots = [];
  }
  getTimeSlotsAsJson(): any[] {
    return this.timeSlots
      .filter(slot => slot.startTime && slot.endTime && slot.selectedDays)  // Filter out invalid slots
      .flatMap(slot =>
        slot.selectedDays.map(day => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          timezone: slot.timezone,
          weekDay: this.getWeekDay(day),
        }))
      );
  }


  editMenu: boolean = false;

  goForAddCategory() {
    this.addedCategories = false
  }
  addCategory() {
    this.addedCategories = true;
    this.suggestCategoryModal.hide()

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
  openModalForSuggestCategory() {
    this.selectedCategoryIds = []
    this.suggestCategoryModal.show()
  }
  closeModalForSuggestCategory() {
    this.suggestCategoryModal.hide()
  }


  async openModalForAddItems() {
    this.ProductsListformodal = this.ProductsList;
    await this.removeitemsinstances(); // Waits for the filtering to complete
    this.addItemsModal.show();
  }


  closeModalForAddItems() {
    this.addItemsModal.hide()
  }


  addItems() {
    this.addedItems = true;
    this.addItemsModal.hide()
  }
  onCategoryChange(event: any, categoryId: number) {
    console.log("categories list is ", this.selectedCategoryIds)
    if (event.target.checked) {
      // Add the category ID to the selected list if it is checked
      this.selectedCategoryIds.push(categoryId);
    } else {
      // Remove the category ID from the selected list if it is unchecked
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
    }
  }
  toggleAllCategories(event: any) {
    if (event.target.checked) {
      // If "Select All" is checked, select all category IDs
      this.selectedCategoryIds = this.AllCategoriesList.map(cat => cat.id);
    } else {
      // If "Select All" is unchecked, clear the selected category IDs
      this.selectedCategoryIds = [];
    }
  }
  onItemChange(event: any, itemId: number) {
    console.log("categories list is ", this.selectedItemIds)
    if (event.target.checked) {
      // Add the category ID to the selected list if it is checked
      this.selectedItemIds.push(itemId);
    } else {
      // Remove the category ID from the selected list if it is unchecked
      this.selectedItemIds = this.selectedItemIds.filter(id => id !== itemId);
    }
  }
  toggleAllItems(event: any) {
    if (event.target.checked) {
      // If "Select All" is checked, select all category IDs
      this.selectedItemIds = this.ProductsList.map(item => item.id);
    } else {
      // If "Select All" is unchecked, clear the selected category IDs
      this.selectedItemIds = [];
    }
  }
  removeInstances() {
    const categoryIdsToRemove = new Set(this.CategoriesList.map(category => category.id));
    // Filter firstList to remove categories with IDs present in secondList
    this.AllCategoriesList = this.AllCategoriesList.filter(category => !categoryIdsToRemove.has(category.id));
    if (this.AllCategoriesList.length > 0) {
      this.forNoCategory = false
    } else {
      this.forNoCategory = true
    }
    this.originalItems = [...this.AllCategoriesList];
  }



  removeitemsinstances(): Promise<void> {
    return new Promise((resolve) => {
      const category = this.CategoriesList.find(category => category.id === this.selectedCategoryId);

      // Make sure category exists and has items
      if (category && category.items && category.items.length > 0) {
        const ItemsIdsToRemove = new Set(category.items.map(item => item.id)); // Collect IDs to remove

        // Ensure correct filtering of items
        this.ProductsListformodal = this.ProductsListformodal.filter(item => {
          return !ItemsIdsToRemove.has(item.id); // Filter out items with matching IDs
        });
      }
      this.originalProduct = [...this.ProductsListformodal];
      // Resolve the promise after filtering is complete
      resolve();
    });
  }




  onItemStatusChange(item: any, cat: any) {

    if (item.itemStatus == 3) {

      let nObj =
      {
        "itemid": item.id,
        "categoryid": cat.id
      }
        ;
      const modalDto = new LazyModalDtoNew();
      modalDto.Title = "Remove Item";
      modalDto.Description = " By taking this action, you will remove the item from this category."
      modalDto.Text = "Would you like to remove the item from this category?";
      modalDto.acceptButtonText = "Yes, Remove Item"
      modalDto.callBack = () => {
        // Ensure the correct context and parameters when calling the method
        this.UpdateitemsForCategoriesAndAddonOptions(nObj);
      };
      modalDto.rejectCallBack = () => {
        item.itemStatus = this.getItemStatusById(item.id)
      };
      modalDto.data = nObj;
      this.appUi.openLazyConfrimModalNew(modalDto);


    }
    else {

      item.itemUnitPrice = item.itemPrice

      this.catupdationloader = true
      let data = {
        "token": this.securityService.securityObject.token,
        "item": item
      }
      this.itemService.updateMerchantitem(this.selectedMerchantId, item.id, data).subscribe((data: any) => {
        this.itemStatusToogleCallback(item?.itemStatus, item.id)

        this.catupdationloader = false
        this.toaster.success("Item status updated");
      }, (err) => {
        this.catupdationloader = false
        item.itemStatus = this.getItemStatusById(item.id)
        this.toaster.error(err.message);
      })
    }
  }

  itemStatusToogleCallback(status: number, id: string) {

    this.catProductsService.DisableEnableItem(this.selectedMerchantId, id, {
      "itemStatus": status
    }).subscribe((data: any) => {
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
  getItemStatusById(itemId: string): number | null {
    for (const category of this.categoriesPreserve) {
      for (const item of category.items) {
        if (item.id === itemId) {
          return item.itemStatus;
        }
      }
    }
    return null; // Return null if itemId is not found
  }
  removeItemById(itemId: string): void {
    this.CategoriesList.forEach(category =>
      category.items = category.items.filter(item => item.id !== itemId)
    );
  }
  removeCategoryById(categoryId: string): void {
    this.CategoriesList = this.CategoriesList.filter(category => category.id !== categoryId);

  }
  openModalForSetCategoryTime() {
    this.setTimeModal.show()
  }
  closeModalForSetCategoryTime() {
    this.setTimeModal.hide()
  }

  openModalForRemoveCategory() {
    this.removeCategoryModal.show()
  }
  closeModalForRemoveCategory() {
    this.removeCategoryModal.hide()
  }

  openModalForActive() {
    this.activeModal.show()
  }
  closeModalForActive() {
    this.activeModal.hide()
  }
  editMenuDetails() {
    this.editMenu = true
  }
  cancelEditMode() {
    this.editMenu = false;

  }
  areAllItemsSelected(): boolean {
    return this.ProductsList.length > 0 && this.selectedItemIds.length === this.ProductsList.length;
  }
  areAllCatsSelected(): boolean {
    return this.AllCategoriesList.length > 0 && this.selectedCategoryIds.length === this.AllCategoriesList.length;
  }
  editmenu() {
    this.timeSlotsprserve = this.cloner.deepClone(this.timeSlots);
    this.menuobjpreserve = this.cloner.deepClone(this.menuobj);
    this.selectedItemsprserve = this.cloner.deepClone(this.selectedItems);

  }
  canceleditmenu() {

    if (this.menuobj.cusines && this.menuobj.cusines.trim() !== '') {
      this.SelectedCuisnieList = this.menuobj.cusines.split(',').map(cuisine => cuisine.trim());
    } else {
      this.SelectedCuisnieList = []; // Set an empty array if no cuisines exist
    }
    this.menuobj = this.menuobjpreserve
    this.timeSlots = this.timeSlotsprserve
    this.selectedItems = this.selectedItemsprserve
    this.disabled = true

    const isvalue = this.checkUbereatsConnected()
    console.log("isvalue", isvalue)
  }
}

