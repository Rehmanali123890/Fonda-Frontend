

import { MerchatNewMenu, MerchatMenu, TimeSlot, MerchantPlatformsEnumNewMenu, WeekDay } from 'src/app/Models/merchant.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { SecurityService } from 'src/app/core/security.service';
import { ToastrService } from 'ngx-toastr';
import { MerchantService } from './../../core/merchant.service';
import { AppStateService } from 'src/app/core/app-state.service';
import { ItemService } from './../../core/item.service';
import Swal from 'sweetalert2'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MerchantListDto, newvirtualMerchants } from 'src/app/Models/merchant.model';
import { UserRoleEnum } from "../../Models/user.model";
import { AppUiService } from './../../core/app-ui.service';
import { LazyModalDto, LazyModalDtoNew } from 'src/app/Models/app.model';
import { environment } from 'src/environments/environment';


@UntilDestroy()
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @ViewChild('createMenuModal') createMenuModal: ModalDirective;
  @ViewChild('cuisineOtherOption') cuisineOtherOption: ModalDirective;
  selectedFileName: string | null = null;
  selectedFiles: File[] = [];
  scaningMenuSpinner: boolean;
  menuScanCreated: boolean = false;
  WeekDay = WeekDay
  createMenu: boolean = false;
  addMenu: boolean = true;
  loadingSlots: boolean = false
  addmanualmenu: boolean = false
  createMenuSecondStep: boolean = false;
  creatingMenuSpinner: boolean = false;
  menuCreated: boolean = false;
  scanMenu: boolean = false;
  selectedOption: string | null = null;
  isContinueEnabled: boolean = true;
  merchantDto = new MerchantListDto();
  allMenusList: MerchatMenu[] = [];
  gettingMenu: boolean = true;
  workingWithdropdown: string | null = null;
  selectedMerchantId = ''
  addingMenu: boolean = false
  LengthofMenu: boolean = true
  addMenuObj = new MerchatMenu();
  platformSelected: boolean = false
  originalItems: MerchatMenu[] = [];
  searchTerm: string = '';
  workingwithDownload: string = '';
  PlatformForTime = []
  selectedValue = ''
  cuisineOther = '';
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
  dropdownListforVR = []
  selectedItems = [];
  selectedItemsforVR = [];
  allConnectedPlatforms = [];
  dropdownSettings = {};
  dropdownSettingsforVR = {}

  // List of time slots
  timeSlots: TimeSlot[] = [];
  menuId = ''
  timeslotjson = [];
  MerchantPlatformsEnumNewMenu = MerchantPlatformsEnumNewMenu;
  gettingPdf: boolean
  gettingCsv: boolean
  updatingmenu: boolean = false
  virtualMerchants: newvirtualMerchants[] = [];
  isChecked: boolean = true;
  userRoleType: UserRoleEnum;
  SelectedCuisnieList = []
  emailToRemoveMenuAccess: string[] = ['humayun@mifonda.io']
  showRemoveMenuAccessBtn: boolean = false


  constructor(private toaster: ToastrService, private itemService: ItemService, private securityService: SecurityService, private router: Router,
    private merchantService: MerchantService, private appState: AppStateService, private appUi: AppUiService,) { }

  ngOnInit(): void {
    this.subscribeAppState();
    this.dropdownsetting()
    this.userRoleType = this.securityService.securityObject.user.role;
    if (environment.production == false) {
      this.emailToRemoveMenuAccess = ['humayun@mifonda.io', 'saim@email.com', 'sowmya@paalam.co.uk', 'saimabdullah+32@paalam.co.uk']
    }
    if (this.emailToRemoveMenuAccess.includes(this.securityService.securityObject.user.email)) {
      this.showRemoveMenuAccessBtn = true;
    }
    this.GetMerchantDetail()
    this.getAllVirtualRestaurants()
    this.getAllMenus();
    this.getAllConnectedPlatforms()
    this.getAllConfigOptions()
    this.isContinueEnabled = true
    this.selectedOption = "manualBuild"
  }

  filterCategories(): void {
    if (this.searchTerm) {
      this.allMenusList = this.originalItems.filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.allMenusList = [...this.originalItems];
    }
  }
  subscribeAppState() {
    this.selectedMerchantId = this.appState.currentMerchant;
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.selectedMerchantId = merchntId;
      this.dropdownsetting()
      this.GetMerchantDetail()
      this.getAllVirtualRestaurants()
      this.getAllMenus();
    })
  }
  GetMerchantDetail() {

    this.merchantService.GetMerchantById(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;
    }, (err) => {
      this.toaster.error(err.message);
    })
  }


  getAllMenus() {
    this.gettingMenu = true;
    this.merchantService.GetMerchantsMenus(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: any) => {
      this.allMenusList = data.data

      if (this.allMenusList.length === 0) {
        this.LengthofMenu = false
      } else {
        this.LengthofMenu = true
      }

      this.originalItems = [...this.allMenusList];
      this.filterCategories()
      //console.log("this.allMenusList", this.allMenusList)
      this.getAllConnectedPlatforms()
      this.gettingMenu = false
    }, (err) => {
      this.gettingMenu = false;
      this.toaster.error(err.message);
    })
  }
  removeSlot(index: number) {
    this.timeSlots.splice(index, 1);
  }
  addmenu() {
    this.addingMenu = true;
    if (this.checkUbereatsConnected) {

      this.timeslotjson = this.getTimeSlotsAsJson();
    }
    this.addMenuObj['new_menu'] = true
    this.addMenuObj.status = false
    this.addMenuObj.cusines = this.SelectedCuisnieList.join(', ');
    this.merchantService.CreateMerchantMenu(this.securityService.securityObject.token, this.addMenuObj, this.selectedMerchantId).subscribe((data: any) => {
      this.addMenuObj = data.data
      this.SelectedCuisnieList = [];
      this.toaster.success("Menu Created Successfully.")
      if (this.timeslotjson.length > 0) {
        this.saveMenuHours(this.addMenuObj.id, this.timeslotjson)

      }
      else {
        this.setdefault()
      }
      this.addingMenu = false
      this.getAllMenus()
    }, (err) => {
      this.addingMenu = false;
      this.toaster.error(err.error.message);
    })


  }
  getAllVirtualRestaurants() {

    this.merchantService.GetVirtualRestaurants(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: any) => {
      this.virtualMerchants = data.data;
      // this.dropdownsettingforVR()
      this.gettingMenu = false
    }, (err) => {
      this.toaster.error(err.message);
    })
  }
  saveMenuHours(menuId, timeslotjson) {
    this.merchantService.saveMenuHours(this.selectedMerchantId, menuId, timeslotjson).subscribe((data: any) => {
      this.setdefault()

    }, (err) => {
      this.addingMenu = false;
      this.toaster.error(err.error.message);
    })
  }
  addNewTimeSlot(): void {
    this.timeSlots.push(new TimeSlot());

  }
  setdefault() {
    this.getAllMenus()
    this.addingMenu = false;
    this.createMenuModal.hide()

    this.createMenu = false;
    this.addMenu = true;
    this.addmanualmenu = false
    this.scanMenu = false
    this.selectedValue = ''
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

  isAnyDaySelectedAcrossSlots(): boolean {
    if (this.checkUbereatsConnected()) {
      if (this.timeSlots.length === 0) {
        return true;
      }
      return this.timeSlots.every(slot =>
        slot.selectedDays && slot.selectedDays.length > 0 &&
        slot.startTime && slot.endTime
      );
    } else {

      return true
    }

  }

  onOptionChange(event: Event, option: string): void {
    this.selectedOption = option;
    const input = event.target as HTMLInputElement;
    if (input) {
      this.isChecked = input.checked;
      this.isContinueEnabled = this.isChecked;
    }
  }

  resetMenuObj() {
    this.addMenuObj = new MerchatMenu();
    this.selectedItems = []
    this.selectedItemsforVR = []
    this.timeSlots = [];
  }
  continue(): void {
    this.updatingmenu = false
    this.createMenu = false;
    this.addMenu = false;
    this.addmanualmenu = false
    this.scanMenu = false
    this.resetMenuObj()
    this.addNewTimeSlot();
    if (this.selectedOption === 'answerQuestions') {
      this.createMenu = true;
    } else if (this.selectedOption === 'existingTemplate') {
      this.closeModal();
      this.router.navigate(['/home/menus/menu-templates']);
    } else if (this.selectedOption === 'uploadMenu') {
      this.scanMenu = true;
    } else if (this.selectedOption === 'manualBuild') {
      this.createMenu = true;
      this.addmanualmenu = true;
    }
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

  menuSecondStep() {
    this.createMenuSecondStep = true;
    this.createMenu = false;
    this.addMenu = false;
  }
  creatingMenu() {
    this.creatingMenuSpinner = true;
    this.createMenuSecondStep = false;
    this.createMenu = false;
    this.addMenu = false;
  }
  created() {
    this.creatingMenuSpinner = false;
    this.createMenuSecondStep = false;
    this.createMenu = false;
    this.addMenu = false;
    this.menuCreated = true;
  }

  // scan menu modal open
  scanAndUploadContent() {
    this.scanMenu = true;
    this.addMenu = false;
  }
  moveToScaningMenu() {
    this.scanMenu = false;
    this.addMenu = false;
    this.scaningMenuSpinner = true;
  }
  createdScaningMenu() {
    this.menuScanCreated = true;
    this.scaningMenuSpinner = false;

  }

  openModal() {
    this.addMenuObj = new MerchatMenu()
    this.createMenuModal.show()
    this.PlatformForTime = []
    this.isChecked = true
  }

  closeModal() {
    this.addMenu = true;
    this.createMenu = false;
    this.createMenuSecondStep = false;
    this.creatingMenuSpinner = false;
    this.menuCreated = false;
    this.scanMenu = false;
    this.scaningMenuSpinner = false;
    this.menuScanCreated = false;
    this.selectedFiles = [];

    this.createMenuModal.hide();
  }


  moveToMenuTemplate() {
    this.closeModal()
    this.router.navigate(['/home/menus/menu-templates'])
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        this.selectedFiles.push(input.files[i]);
      }
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        this.selectedFiles.push(event.dataTransfer.files[i]);
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
  truncateFileName(fileName: string): string {
    const maxLength = 10;
    return fileName.length > maxLength ? `${fileName.slice(0, maxLength)}...` : fileName;
  }
  dropdownsetting() {
    this.dropdownList = ['grubhub', 'square', 'GMB', 'clover', 'ubereats', 'flipdish', 'storefront', 'Stream'];

    this.dropdownSettings = {
      singleSelection: false,
      itemsShowLimit: 7,
      allowSearchFilter: true,
      enableCheckAll: false

    };
  }
  // dropdownsettingforVR() {
  //   this.dropdownListforVR = this.virtualMerchants.map(vmerchant => ({ id: vmerchant.id, virtualName: vmerchant.virtualName }));
  //   console.log("this. dropdownListforVR ", this.dropdownListforVR)
  //   this.dropdownSettingsforVR = {
  //     singleSelection: false,
  //     itemsShowLimit: 20,
  //     idField: 'id',
  //     textField: 'virtualName',
  //     allowSearchFilter: false

  //   };
  // }
  EditMenu(id: string) {
    this.menuId = id
    this.addmanualmenu = false
    this.addMenu = false
    this.updatingmenu = true
    this.createMenu = true
    this.addMenuObj = new MerchatMenu()
    this.openModal()
    this.mapmenubyId(id)
    this.getMenuHours(id)



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

  resetCuisineObj() {
    this.cuisineOther = ''
  }

  OpenConfirmDelete(id: any) {
    let nObj = id;
    const modalDto = new LazyModalDtoNew();


    modalDto.callBack = this.ConfirmMenuDeleteCallback;
    modalDto.data = nObj;
    modalDto.Title = "Remove Menu";
    modalDto.Description = "By taking this action, you will remove the menu.Would you like to remove the menu?"
    modalDto.acceptButtonText = "Yes, Remove Menu";
    modalDto.Text = "Are you sure that you want to remove this menu?";
    this.appUi.openLazyConfrimModalNew(modalDto);


  }




  ConfirmMenuDeleteCallback = (id: string) => {
    this.workingwithDownload = id
    this.merchantService.deleteMerchantMenu(this.securityService.securityObject.token, this.selectedMerchantId, id).subscribe((data: any) => {
      // this.getAllMenus();

      this.allMenusList = this.allMenusList.filter(menu => menu.id !== id)
      this.originalItems = [...this.allMenusList];
      if (this.allMenusList.length === 0) {
        this.LengthofMenu = false
      }
      this.workingwithDownload = ''
      this.toaster.success('Menu Deleted Successfully');
    }, (err) => {
      this.workingwithDownload = ''
      this.toaster.error(err.error.message);
    })
  };

  onItemDeSelect(itemtobeRemove: any) {
    this.addMenuObj.menuPlatforms = this.addMenuObj.menuPlatforms.filter(item => item !== itemtobeRemove);

    let type: number = MerchantPlatformsEnumNewMenu[itemtobeRemove as keyof typeof MerchantPlatformsEnumNewMenu];
    this.PlatformForTime = this.PlatformForTime.filter(platformType => platformType !== type);
    this.checkUbereatsConnected()
  }

  checkUbereatsConnected() {

    if (this.addMenuObj.menuPlatforms.length > 0) {
      let check = this.PlatformForTime.filter(x => x == 3 || x == 7 || x == 8)
      if (check.length > 0) {
        return true
      }
    }

    return false
  }




  onItemSelect(event: any) {
    if (Object.keys(MerchantPlatformsEnumNewMenu).includes(event)) {
      let message = `The platform "${event}" is already attached to another menu. Please remove it from the other menu..`;
      let type: number = MerchantPlatformsEnumNewMenu[event as keyof typeof MerchantPlatformsEnumNewMenu];


      let typeStr: string = type.toString();

      const hasMatchingPlatform = this.allConnectedPlatforms.some(platform => {
        let platformTypeStr: string = platform.platformtype.toString(); // Convert platformtype to string
        return platformTypeStr === typeStr; // Compare with the provided typeStr
      });

      if (type === 2 || type === 11 || type === 4 || type === 7 || type === 8 || type === 50) {


        if (hasMatchingPlatform) {
          console.log("already having")
          this.selectedItems = [...this.addMenuObj.menuPlatforms]
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
          this.addMenuObj.menuPlatforms.push(event)
          if (!this.PlatformForTime.includes(type)) {
            this.PlatformForTime.push(type);
          }
        }
      }
      else {
        console.log("comming in there")
        this.addMenuObj.menuPlatforms.push(event)
        if (!this.PlatformForTime.includes(type)) {
          this.PlatformForTime.push(type);
        }
      }

      const isUbereatsConnected = this.checkUbereatsConnected();
      console.log("Is Ubereats Connected:", isUbereatsConnected);

    }
  }

  mapmenubyId(id: string) {
    this.addMenuObj = this.allMenusList.find(menu => menu.id === id);
    console.log("filtered menu is ", this.addMenuObj)
    this.selectedItems = this.addMenuObj.menuPlatforms.map(item => MerchantPlatformsEnumNewMenu[item.platformType]);
    this.addMenuObj.menuPlatforms = this.selectedItems
    if (this.addMenuObj.virtualMerchants.length > 0) {
      this.addMenuObj.vmerchantId = this.addMenuObj.virtualMerchants[0].id
    }
    if (!this.cuisineList.includes(this.addMenuObj.cusines)) {
      this.cuisineList.push(this.addMenuObj.cusines);
    }

  }

  removeCuisine(cuisine: any): void {
    const index = this.SelectedCuisnieList.indexOf(cuisine);
    if (index !== -1) {
      this.SelectedCuisnieList.splice(index, 1);  // Remove the deselected item
    }
    console.log(this.SelectedCuisnieList)
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

  updatemenu() {

    this.addingMenu = true;
    this.timeslotjson = this.getTimeSlotsAsJson();

    this.addMenuObj['new_menu'] = true
    console.log("this.addmenuObj on updation ", this.addMenuObj)
    this.merchantService.updateMerchantMenu(this.securityService.securityObject.token, this.addMenuObj, this.selectedMerchantId, this.menuId).subscribe((data: any) => {
      this.addMenuObj = data.data
      this.toaster.success("Menu Updated Successfully.")
      if (this.timeslotjson.length > 0) {
        this.saveMenuHours(this.addMenuObj.id, this.timeslotjson)
      }
      else {
        this.setdefault()

      }
    }, (err) => {
      this.addingMenu = false;
      this.toaster.error(err.error.message);
    })


  }
  getMenuHours(id: string) {
    this.loadingSlots = true;
    this.merchantService.getMenuHours(this.selectedMerchantId, id).subscribe((data: any) => {
      this.timeSlots = this.groupByTimeAndDay(data.data)
      this.loadingSlots = false
    }, (err) => {
      this.loadingSlots = false;
      this.toaster.error(err.error.message);
    })
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

  blob: any = null
  DownloadPdf(id: string, name: string) {
    this.gettingPdf = true;
    this.workingwithDownload = id
    this.merchantService.GetPdfDetial(id).subscribe(
      (data: any) => {
        // Check if the response is a Blob
        if (data.type === 'application/pdf') {
          this.blob = new Blob([data], { type: 'application/pdf' });
          var downloadURL = window.URL.createObjectURL(this.blob);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = `${this.merchantDto.merchantName}-${name}.pdf`;
          link.click();
        } else {
          // Handle non-PDF response
          const reader = new FileReader();
          reader.onload = (event: any) => {
            const errorData = JSON.parse(event.target.result);
            this.workingwithDownload = ''
            this.toaster.error(errorData.message || 'An error occurred while downloading the PDF.');
          };
          reader.readAsText(data);
        }

        this.gettingPdf = false;
        this.workingwithDownload = ''
      },
      (err) => {
        // Extract the error message correctly when the error is a Blob
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const errorData = JSON.parse(event.target.result);
          this.toaster.error(errorData.message || 'An error occurred while downloading the PDF.');
        };

        // Check if the error is a Blob and read it as text
        if (err.error instanceof Blob && err.error.type === 'application/json') {
          reader.readAsText(err.error);
        } else {

          //this.toaster.error(err.error.message);
        }
        this.workingwithDownload = ''
        this.gettingPdf = false;

      }

    );
  }

  DownloadCsv(id: string, name: string) {
    this.gettingCsv = true;
    this.workingwithDownload = id;

    this.merchantService.GetCsvDetails(this.selectedMerchantId, id).subscribe(
      (data: any) => {
        fetch(data.data.download_url)
          .then(response => response.blob())
          .then(blob => {
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            link.href = url;

            link.download = `${this.merchantDto.merchantName}-${name}.zip`;;  // Replace with your desired file name

            link.click();
            window.URL.revokeObjectURL(url);
            this.gettingCsv = false;
            this.workingwithDownload = '';
          })
          .catch(err => {
            this.gettingCsv = false;
            this.workingwithDownload = '';
          });
      },
      (err) => {
        this.gettingCsv = false;
        this.workingwithDownload = '';
        this.toaster.error(err.error.message);
      }
    );
  }





  plateformOption() {
    this.platformSelected = true;
  }
  onFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value === '2') { // '2' corresponds to the 'Platform' option
      this.plateformOption();
    } else {
      this.platformSelected = false;
    }
  }



  OpenConfirmToggle(menu: any, event: Event) {
    const originalStatus = menu.status;

    // Prevent default checkbox behavior until confirmed
    event.preventDefault();

    const title = menu.status === 1
      ? "Inactivate"
      : "Activate";

    const message = menu.status === 1
      ? "Are you sure that you want to inactivate this menu?"
      : "Are you sure that you want to activate this menu?";

    const modalDto = new LazyModalDtoNew();
    modalDto.Title = `${title} Menu `;
    modalDto.Text = message;


    modalDto.acceptButtonText = `Yes, ${title} menu`
    modalDto.Description = `This will make your menu ${menu.status === 1
      ? "inactive"
      : "activate"} across all of your platforms.
    You will need to ${menu.status === 1
        ? "enable"
        : "disable"}
       this menu in order to turn it on for your platforms?`

    modalDto.callBack = () => {
      menu.status = menu.status === 1 ? 0 : 1;
      this.MenuStatusToogleCallback(menu.status, menu.id);
    };

    modalDto.rejectCallBack = () => {
      (event.target as HTMLInputElement).checked = originalStatus === 1;
    };

    this.appUi.openLazyConfrimModalNew(modalDto);
  }




  MenuStatusToogleCallback(status: number, id: string) {
    this.merchantService.ActiveInactiveMenu(this.selectedMerchantId, id, {
      "menuStatus": status
    }).subscribe((data: any) => {
      this.toaster.success('Menu status changed.');
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }

}
