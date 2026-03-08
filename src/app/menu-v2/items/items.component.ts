import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ClonerService } from './../../core/DataServices/cloner.service';
import { ItemDetailObject, AddonItemDetailDto } from './../../Models/item.model';
import { ItemService } from './../../core/item.service';
import { AppUiService } from './../../core/app-ui.service';
import { MerchantService } from './../../core/merchant.service';
import { AddCategoryDto, CategoryDto, CategoryStatusEnum, ProductListDto, ProductStatusEnum, AddEditAddonDto, AddonDto, AddonStatusEnum, AddonOptionDto, AddonOptionStatusEnum, AddEditProductDto, AddonDtoWithOptions, CategoryWithOptDto } from './../../Models/Cat_Product.model';
import { ProductsCategoriesService } from './../../core/products-categories.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/core/security.service';
import { ToastrService } from 'ngx-toastr';
import {
  ConnectedPlatformObj,
  MerchantListDto,
  MerchantPlatformsEnum,
  MerchatMenu,
  Platforms,
  virtualMerchants,
  MerchantPlatformsEnumNewMenu,
  TimeSlot,
  WeekDay,
} from 'src/app/Models/merchant.model';
import { LazyModalDto, LazyModalDtoNew } from 'src/app/Models/app.model';
import { ItemDto, ItemDtoNew } from 'src/app/Models/item.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppStateService } from 'src/app/core/app-state.service';
// import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';
import { UserRoleEnum } from "../../Models/user.model";
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { TranslocoService } from '@ngneat/transloco';
import Swal from 'sweetalert2'
import { ElementRef, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { environment } from 'src/environments/environment';






@UntilDestroy()
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})

export class ItemsComponent {
  @ViewChild('createMenuModal') createMenuModal: ModalDirective;
  @ViewChild('suggestCategoryModal') suggestCategoryModal: ModalDirective;
  @Output() triggerChangeParent = new EventEmitter<any>();
  loadingfordownload: boolean = false;
  loadingforupload: boolean = false;
  selectedPlatformWhileAdding = [];
  fileToUpload: File | null = null;
  @ViewChild('AssignPlatformModal') AssignPlatformModal: ModalDirective;
  @ViewChild('takeInput', { static: false }) InputVar: ElementRef;

  gettingProducts = true;
  productStatusEnum = ProductStatusEnum;
  CategoriesList: CategoryWithOptDto[];
  gettingCategories = true;
  ProductsList: ItemDtoNew[];
  gettingMerchants: boolean;
  MerchantsList: MerchantListDto[];
  selectedMerchantId: string;
  selectedCategoryId: string;
  categoryName: string;
  addCategoryObj = new AddCategoryDto();
  addingCategories: boolean;
  editCategoryObj = new CategoryDto();
  addingProducts: boolean;
  gettingItemByid: boolean = false;
  editProductObj = new ItemDto();
  addProductObj = new AddEditProductDto();
  addEditAddOnObj = new AddEditAddonDto();
  loading: boolean = false
  itemsDetailObj = new ItemDetailObject();
  showPlatforms: boolean = false
  errorAdding: boolean = false
  productsListPreserve: ItemDto[] = [];
  PlatformsPricingList = [];
  doordashPrice: number
  ubereatsPrice: number
  grubhubPrice: number
  platformBasedPricing: boolean = false;
  MerchantPlatformsEnum = MerchantPlatformsEnum
  originalItems: ItemDtoNew[] = [];
  searchTerm: string = '';
  workingwithremove = ''
  userRoleType: UserRoleEnum;
  MerchantPlatformsEnumNewMenu = MerchantPlatformsEnumNewMenu
  selectedPlatformWhileAddingNew = []
  dropdownSettings = {};
  platformNames = []
  emailToRemoveItemAccess: string[] = ['humayun@mifonda.io']
  showRemoveItemAccessBtn: boolean = false
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

  PlatformsListOriginal = [
    { "id": 2, "name": "Flipdish", "selected": false, "platformItemPrice": 0, "platformType": 2, "type": "platform" },
    { "id": 3, "name": "Ubereats", "selected": false, "platformItemPrice": 0, "platformType": 3, "type": "platform" },
    { "id": 4, "name": "Clover", "selected": false, "platformItemPrice": 0, "platformType": 4, "type": "POS" },
    { "id": 11, "name": "Square", "selected": false, "platformItemPrice": 0, "platformType": 11, "type": "POS" },
    { "id": 50, "name": "Store Front", "selected": false, "platformItemPrice": 0, "platformType": 50, "type": "platform" },
    { "id": 5, "name": "Grubhub", "selected": false, "platformItemPrice": 0, "platformType": 5, "type": "platform" },
    { "id": 6, "name": "Doordash", "selected": false, "platformItemPrice": 0, "platformType": 6, "type": "platform" },
    { "id": 7, "name": "GMB", "selected": false, "platformItemPrice": 0, "platformType": 7, "type": "platform" }
  ]

  constructor(private toaster: ToastrService, private translocoService: TranslocoService, private securityService: SecurityService, private router: Router, private itemService: ItemService,
    private merchantService: MerchantService, private catProductsService: ProductsCategoriesService, private appUi: AppUiService,
    private cloner: ClonerService, private appState: AppStateService, private merchantservice: MerchantService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.subscribeAppState();
    this.GetProductsList();

    this.userRoleType = this.securityService.securityObject.user.role;
    if (environment.production == false) {
      this.emailToRemoveItemAccess = ['humayun@mifonda.io', 'saim@email.com', 'sowmya@paalam.co.uk', 'saimabdullah+32@paalam.co.uk']
    }
    if (this.emailToRemoveItemAccess.includes(this.securityService.securityObject.user.email)) {
      this.showRemoveItemAccessBtn = true;
    }
  }
  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      // Check if 'edit' query param exists and process accordingly
      if (params['add'] !== undefined) {
        console.log("find add param")
        this.createMenuModal.show()
      }
    });
  }
  filterCategories(): void {
    if (this.searchTerm) {
      this.ProductsList = this.originalItems.filter(item =>
        item.itemName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.ProductsList = [...this.originalItems];
    }
  }


  subscribeAppState() {
    this.selectedMerchantId = this.appState.currentMerchant;
    console.log("this.appstate is ", this.appState)
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.selectedMerchantId = merchntId;
      this.GetProductsList();

    })
  }

  someItems: boolean = false;
  openModal() {


    this.addProductObj = new AddEditProductDto()
    this.addProductObj.item.itemType = 1
    this.platformBasedPricing = false
    this.fillPlatformPricingCheckboxes()
    this.createMenuModal.show()
    console.log('Initial itemType:', this.addProductObj.item.itemType); // Debugging

  }

  closeModal() {
    this.createMenuModal.hide()
  }
  openModalForSuggestCategory() {
    this.suggestCategoryModal.show()
  }
  closeModalForSuggestCategory() {
    this.suggestCategoryModal.hide()
  }
  addItems() {

    this.someItems = true
    this.errorAdding = false
    this.AddProductForMerchant()
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

  togglePlatforms(event: any) {
    this.showPlatforms = event.target.checked;
    console.log("showPlatforms:", this.showPlatforms); // To check the value change
  }

  GetProductsList() {
    this.gettingProducts = true;
    this.ProductsList = [];
    this.itemService.getMerchantitems(this.selectedMerchantId, this.securityService.securityObject.token).subscribe((data: ItemDtoNew[]) => {
      this.ProductsList = data;
      this.ProductsList = this.ProductsList.filter(item => item.itemType !== 2);
      this.originalItems = [...this.ProductsList];
      this.filterCategories()
      if (this.ProductsList && this.ProductsList.length > 0) {
        this.someItems = true;
      } else {
        this.someItems = false;
      }
      //if (data) {
      //  this.productsListPreserve = this.cloner.deepClone(data);
      //}

      this.gettingProducts = false;
    }, (err) => {
      this.gettingProducts = false;
      this.toaster.error(err.message);
    })
  }




  deleteProduct(id: any) {
    let nObj = id;
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove Item";
    modalDto.Description = "By taking this action, you will remove the item.Would you like to remove the item?"
    modalDto.acceptButtonText = "Yes, Remove Item";
    modalDto.Text = "Are you sure that you want to remove this item?";
    modalDto.callBack = this.DeleteProductCallBack;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModalNew(modalDto);
  }


  DeleteProductCallBack = (id: string) => {
    this.workingwithremove = id
    this.itemService.deleteMerchantitem(this.selectedMerchantId, id).subscribe((data: any) => {
      this.ProductsList = this.ProductsList.filter(menu => menu.id !== id);
      this.originalItems = [...this.ProductsList];
      this.workingwithremove = ''
      this.toaster.success('Item deleted successfully');
    }, (err) => {
      this.workingwithremove = ''
      this.toaster.error(err.message);
    })
  };




  AddProductForMerchant() {
    this.addingProducts = true;
    this.addProductObj.token = this.securityService.securityObject.token;
    const filteredPlatforms = this.PlatformsPricingList.filter((item: { platformItemPrice: any }) => {
      // Convert platformItemPrice to a number for comparison
      const price = Number(item.platformItemPrice);
      return price !== 0 && !isNaN(price); // Ensure it's not NaN
    });
    this.addProductObj.item.itemPriceMappings = filteredPlatforms
    //console.log(this.addProductObj.item.itemPriceMappings);
    console.log("this.addProductObj.item,", this.addProductObj.item)
    console.log(this.addProductObj)
    this.itemService.createMerchantItem(this.selectedMerchantId, this.addProductObj).subscribe((data: ItemDto) => {
      this.createMenuModal.hide()
      this.toaster.success("Item added")
      this.GetProductsList();
      this.addingProducts = false;
    }, (err) => {
      this.addingProducts = false;
      this.toaster.error(err.message);
    })

  }

  fillPlatformPricingCheckboxes() {
    if (this.platformBasedPricing) {
      this.PlatformsPricingList = this.cloner.deepClone(this.PlatformsListOriginal.filter(x => x.type == "platform"));
      this.PlatformsPricingList.map((x) => {
        if (this.addProductObj.item.itemUnitPrice != null && this.addProductObj.item.itemUnitPrice != undefined && this.addProductObj.item.itemUnitPrice > 0) {
          x.platformItemPrice = this.addProductObj.item.itemUnitPrice;
        } else {
          x.platformItemPrice = 0;
        }
      });
    } else {
      this.PlatformsPricingList = [];
    }
  }

  // fillPlatformPricingCheckboxest() {
  //   if (this.platformBasedPricing) {
  //     this.PlatformsPricingList = this.cloner.deepClone(this.PlatformsListOriginal.filter(x => x.type == "platform"));
  //     this.PlatformsPricingList.map((x) => {
  //       if (this.editProductObj.itemUnitPrice != null && this.editProductObj.itemUnitPrice != undefined && this.editProductObj.itemUnitPrice > 0) {
  //         x.platformItemPrice =
  //       } else {
  //         x.platformItemPrice = 0;
  //       }
  //     });
  //   } else {
  //     this.PlatformsPricingList = [];
  //   }
  // }
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


  itemStatusToggle(item: any, event: Event) {
    const originalStatus = item.itemStatus;

    // Prevent default checkbox behavior until confirmed
    event.preventDefault();
    const title = item.itemStatus === 1
      ? "Inactivate"
      : "Activate";

    const message = item.itemStatus === 1
      ? "Are you sure that you want to inactivate this item?"
      : "Are you sure that you want to activate this item?";

    const modalDto = new LazyModalDtoNew();

    modalDto.Title = `${title} item`;
    modalDto.Text = message;
    modalDto.acceptButtonText = `Yes, ${title} item`

    modalDto.Description = `This will make your item ${title}.
    Would you like to ${title} the item ?`

    modalDto.callBack = () => {
      item.itemStatus = item.itemStatus === 1 ? 0 : 1;
      this.itemStatusToogleCallback(item.itemStatus, item.id);
    };

    modalDto.rejectCallBack = () => {
      (event.target as HTMLInputElement).checked = originalStatus === 1;
    };

    this.appUi.openLazyConfrimModalNew(modalDto);
  }


  itemStatusToogleCallback(status: number, id: string) {

    this.catProductsService.DisableEnableItem(this.selectedMerchantId, id, {
      "itemStatus": status
    }).subscribe((data: any) => {
      this.toaster.success('Item status changed');
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }

  downloadTemplate() {
    this.loadingfordownload = true;
    this.merchantService.getMenuTemplateURL(this.selectedMerchantId, 1).subscribe((data: any) => {

      const a = document.createElement('a');
      a.href = data.data.download_url;
      a.click();
      this.loadingfordownload = false
    }, (err) => {
      this.loadingfordownload = false;
      this.toaster.error(err.error.message);
    })
  }

  dropdownsetting() {

    this.dropdownSettings = {
      singleSelection: false,
      itemsShowLimit: 7,
      allowSearchFilter: true,
      enableCheckAll: false

    };
  }
  onitemSelect(event: any) {
    console.log(event)
    let type: number = MerchantPlatformsEnumNewMenu[event as keyof typeof MerchantPlatformsEnumNewMenu];

    if (!this.selectedPlatformWhileAdding.includes(type)) {
      this.selectedPlatformWhileAdding.push(type);
    }
    console.log(this.selectedPlatformWhileAdding)
  }

  onitedDeselect(event: any) {

  }

  onItemDeselect(event: any) {
    console.log(event);
    let type: number = MerchantPlatformsEnumNewMenu[event as keyof typeof MerchantPlatformsEnumNewMenu];

    // Remove the type from the selectedPlatformWhileAdding list
    this.selectedPlatformWhileAdding = this.selectedPlatformWhileAdding.filter(
      (platformType) => platformType !== type
    );

    console.log(this.selectedPlatformWhileAdding);
  }
  onSelectAll(event: any) {
    console.log('All Selected:', event);
    this.selectedPlatformWhileAdding = [1, 5, 11, 7, 4, 3, 2, 50, 6]
    console.log(this.selectedPlatformWhileAdding);
  }
  onDeSelectAll(event: any) {
    console.log("Deselect all ", event);
    this.selectedPlatformWhileAdding = [];
    console.log(this.selectedPlatformWhileAdding);
  }
  handleFileInput(event: Event): void {
    this.platformNames = ['Standard Price', 'grubhub', 'square', 'GMB', 'clover', 'ubereats', 'flipdish', 'storefront', 'doordash'];
    this.selectedPlatformWhileAddingNew = []

    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;

    if (files && files.length > 0) {
      this.fileToUpload = files.item(0);
      this.updateFileToServer()
    }
  }

  fillPlatformSelection() {
    this.selectedPlatformWhileAdding = [];
  }

  updateFileToServer() {
    this.selectedPlatformWhileAdding = [1, 5, 11, 7, 4, 3, 2, 50, 6]
    this.loadingforupload = true;
    this.merchantservice.uploadItemsCSV(this.selectedMerchantId, this.fileToUpload, this.selectedPlatformWhileAdding.join(',')).subscribe((data: any) => {
      this.toaster.success("File uploaded successfully.")
      this.clearSelection()
      this.loadingforupload = false;
      this.triggerChangeParent.emit();
      this.GetProductsList()
    }, (err) => {
      this.loadingforupload = false;
      this.toaster.error(err.error.message);
    })
  }
  clearSelection() {

    this.fileToUpload = null;
    this.InputVar.nativeElement.value = "";

  }


  isInvalidPrice(itemUnitPrice: any): boolean {
    return isNaN(Number(itemUnitPrice)) || itemUnitPrice === null || itemUnitPrice === '';
  }


}
