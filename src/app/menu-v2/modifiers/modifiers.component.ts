import { ClonerService } from './../../core/DataServices/cloner.service';
import { ItemService } from './../../core/item.service';
import { AppUiService } from './../../core/app-ui.service';
import { MerchantService } from './../../core/merchant.service';
import { ProductsCategoriesService } from './../../core/products-categories.service';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';

import { ModalDirective } from 'angular-bootstrap-md';
import { SecurityService } from 'src/app/core/security.service';
import { ToastrService } from 'ngx-toastr';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppStateService } from 'src/app/core/app-state.service';
import { TranslocoService } from '@ngneat/transloco';
import Swal from 'sweetalert2'
import { AddonOption, ItemDto } from 'src/app/Models/item.model';
import {
  ConnectedPlatformObj,
  MerchantListDto,
  MerchantPlatformsEnum,
  MerchatMenu,
  Platforms,
  virtualMerchants,
  MerchantPlatformsEnumNewMenu
} from 'src/app/Models/merchant.model';
import { AddEditAddonDto, AddEditProductDto, AddonDtoWithoutOptions, AddonDtoWithOptions, AddonOptionDto } from './../../Models/Cat_Product.model';
import { ElementRef, EventEmitter, Input, Output, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserRoleEnum } from "../../Models/user.model";
import { LazyModalDto, LazyModalDtoNew } from 'src/app/Models/app.model';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'app-modifiers',
  templateUrl: './modifiers.component.html',
  styleUrls: ['./modifiers.component.css']
})
export class ModifiersComponent implements OnInit {
  @ViewChild('createModifierModal') createModifierModal: ModalDirective;
  @ViewChild('suggestCategoryModal') suggestCategoryModal: ModalDirective;
  @ViewChild('addModifierModal') addModifierModal: ModalDirective;
  @ViewChild('suggestModifierModal') suggestModifierModal: ModalDirective;
  @ViewChild('createMenuModal') createMenuModal: ModalDirective;
  @Output() triggerChangeParent = new EventEmitter<any>();
  @ViewChild('AssignPlatformModal') AssignPlatformModal: ModalDirective;
  @ViewChild('takeInput', { static: false }) InputVar: ElementRef;
  @ViewChild('addItemsModal') addItemsModal: ModalDirective;



  loading: boolean = false;
  selectedPlatformWhileAdding = [];
  fileToUpload: File | null = null;
  selectedTab = 2;
  someMenu: boolean = false;
  addingProducts: boolean = false;
  selectedMerchantId: string;
  MerchantaddOnsList: AddonDtoWithoutOptions[] = [];
  gettingMerchantAddOns: boolean;
  addEditAddOnObj = new AddEditAddonDto();
  addingAddons: boolean;
  openmodalfor = ''
  deletingAddOn: boolean;
  someModifiers: boolean = true;
  someModifiersItems: boolean = false;
  ProductsList: ItemDto[];
  addonsList: ItemDto[];
  gettingProducts = true;
  addProductObj = new AddEditProductDto();
  MerchantPlatformsEnumNewMenu = MerchantPlatformsEnumNewMenu;
  originalStatus: any = null;
  showPlatforms: boolean = false
  productsListPreserve: ItemDto[] = [];
  PlatformsPricingList = [];
  doordashPrice: number
  ubereatsPrice: number
  grubhubPrice: number
  platformBasedPricing: boolean = false;
  MerchantPlatformsEnum = MerchantPlatformsEnum
  originalModifierGroup: AddonDtoWithOptions[] = [];
  searchTermModifierGroup: string = '';
  originalAddons: ItemDto[] = [];
  originalBuilderAddons: ItemDto[] = [];
  searchTermAddons: string = '';
  searchTermBuilder: string = '';
  workingwithremovemodifier = ''
  workingwithremove = ''
  loadingfordownload: boolean = false
  loadingforupload: boolean = false
  userRoleType: UserRoleEnum;
  dropdownSettings = {};
  platformNames = []
  selectedPlatformWhileAddingNew = []
  MerchantaddOnsListWithOptions: AddonDtoWithOptions[] = [];
  itemsListAll: ItemDto[] = [];
  selectedItems: string[] = [];
  MerchantaddOnsWithOptions = false
  selectAllItems: boolean = false;
  addingItems: boolean = false;
  isFiltering: boolean = false
  openModalforID = ''
  dataToPush: any = []
  areAllAccordionsOpen: boolean = true;
  dataToSort = [];
  addonID: any
  emailToRemoveModifiersAccess: string[] = ['humayun@mifonda.io']
  showRemoveModifiersAccessBtn: boolean = false

  constructor(private merchantService: MerchantService, private toaster: ToastrService, private securityService: SecurityService,
    private catProductsService: ProductsCategoriesService,
    private appState: AppStateService, private itemService: ItemService, private cloner: ClonerService,
    private merchantservice: MerchantService, private route: ActivatedRoute, private router: Router, private appUi: AppUiService, private renderer: Renderer2,) { }

  PlatformsListOriginal = [
    { "id": 1, "name": "Standard Price", "selected": false, "platformItemPrice": 0, "platformType": 1, "type": "platform" },
    { "id": 2, "name": "Flipdish", "selected": false, "platformItemPrice": 0, "platformType": 2, "type": "platform" },
    { "id": 3, "name": "Ubereats", "selected": false, "platformItemPrice": 0, "platformType": 3, "type": "platform" },
    { "id": 4, "name": "Clover", "selected": false, "platformItemPrice": 0, "platformType": 4, "type": "POS" },
    { "id": 11, "name": "Square", "selected": false, "platformItemPrice": 0, "platformType": 11, "type": "POS" },
    { "id": 50, "name": "Store Front", "selected": false, "platformItemPrice": 0, "platformType": 50, "type": "platform" },
    { "id": 5, "name": "Grubhub", "selected": false, "platformItemPrice": 0, "platformType": 5, "type": "platform" },
    { "id": 6, "name": "Doordash", "selected": false, "platformItemPrice": 0, "platformType": 6, "type": "platform" },
    { "id": 7, "name": "GMB", "selected": false, "platformItemPrice": 0, "platformType": 7, "type": "platform" },
  ]

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const tabMatch = fragment.match(/tab=(\d+)/);
        if (tabMatch) {
          this.selectedTab = Number(tabMatch[1]);
        }
      }
    });
    this.userRoleType = this.securityService.securityObject.user.role;
    if (environment.production == false) {
      this.emailToRemoveModifiersAccess = ['humayun@mifonda.io', 'saim@email.com', 'sowmya@paalam.co.uk', 'saimabdullah+32@paalam.co.uk']
    }
    if (this.emailToRemoveModifiersAccess.includes(this.securityService.securityObject.user.email)) {
      this.showRemoveModifiersAccessBtn = true;
    }
    this.subscribeAppState();
    //this.GetAddOnsByMerchantId()
    this.GetProductsList()
    this.GetAddOnsByMerchantIdWithOptions()
    this.selectTab(this.selectedTab)
  }
  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      // Check if 'edit' query param exists and process accordingly
      if (params['add'] !== undefined) {
        console.log("find add param", typeof (params['add']))
        if (params['add'] == 'true') {
          this.selectTab(0)
          this.addaddon()
        }
        else {
          this.selectTab(1)
          this.showaddItems()
        }
      }
    });
  }
  addItems() {

    this.AddProductForMerchant()
  }
  showaddItems() {
    this.addProductObj = new AddEditProductDto()
    this.platformBasedPricing = false
    this.PlatformsPricingList = [];
    this.createMenuModal.show()
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










  subscribeAppState() {
    this.selectedMerchantId = this.appState.currentMerchant;

    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.selectedMerchantId = merchntId;
      this.GetAddOnsByMerchantIdWithOptions()
      this.GetProductsList()
    })
  }

  filterModifierGroup(): void {
    if (this.searchTermModifierGroup) {
      this.MerchantaddOnsListWithOptions = this.originalModifierGroup.filter(item =>
        item.addonName.toLowerCase().includes(this.searchTermModifierGroup.toLowerCase())
      );
    } else {
      this.MerchantaddOnsListWithOptions = [...this.originalModifierGroup];
    }
  }


  filterAddons(): void {
    if (this.searchTermAddons) {
      this.addonsList = this.originalAddons.filter(item =>
        item.itemName.toLowerCase().includes(this.searchTermAddons.toLowerCase())
      );
    } else {
      this.addonsList = [...this.originalAddons];
    }
  }


  filterAddonsOptionsBuilder(): void {
    if (this.searchTermBuilder) {
      this.itemsListAll = this.itemsListAll.filter(item =>
        item.itemName.toLowerCase().includes(this.searchTermBuilder.toLowerCase())
      );
    } else {
      this.itemsListAll = [...this.originalBuilderAddons];
    }
  }

  GetAddOnsByMerchantId() {
    this.gettingMerchantAddOns = true;
    this.MerchantaddOnsList = [];
    if (this.addEditAddOnObj.addon.status) {
      this.addEditAddOnObj.addon.status = 1
    }
    else {
      this.addEditAddOnObj.addon.status = 0
    }
    this.catProductsService.GetAddOnsWIthoutOptionsByMerchantId(this.selectedMerchantId, this.securityService.securityObject.token, 1).subscribe((data: AddonDtoWithoutOptions[]) => {
      this.MerchantaddOnsList = data;

      this.filterModifierGroup()
      this.someModifiers = this.MerchantaddOnsList.length > 0;
      this.gettingMerchantAddOns = false;
    }, (err) => {
      this.gettingMerchantAddOns = false;
      this.toaster.error(err.message);
    })
  }

  GetProductsList() {
    this.gettingProducts = true;
    this.ProductsList = [];
    this.itemService.getMerchantitems(this.selectedMerchantId, this.securityService.securityObject.token).subscribe((data: ItemDto[]) => {
      this.ProductsList = data;
      this.addonsList = this.ProductsList.filter(item => item.itemType === 2);
      this.someModifiersItems = this.addonsList.length > 0
      this.originalAddons = [...this.addonsList];
      this.filterAddons()
      this.gettingProducts = false;
    }, (err) => {
      this.gettingProducts = false;
      this.toaster.error(err.message);
    })
  }
  PostAddOns() {
    this.addingAddons = true;
    this.addEditAddOnObj.token = this.securityService.securityObject.token;
    this.addEditAddOnObj.addon.maxPermitted = !this.addEditAddOnObj.addon.maxPermitted || isNaN(this.addEditAddOnObj.addon.maxPermitted)
      ? 0
      : this.addEditAddOnObj.addon.maxPermitted;

    this.addEditAddOnObj.addon.minPermitted = !this.addEditAddOnObj.addon.minPermitted || isNaN(this.addEditAddOnObj.addon.minPermitted)
      ? 0
      : this.addEditAddOnObj.addon.minPermitted;


    console.log("this.addEditAddOnObj", this.addEditAddOnObj)
    this.catProductsService.PostAddOnsForProduct(this.selectedMerchantId, '', this.addEditAddOnObj).subscribe((data: any[]) => {
      //this.GetAddOnsByMerchantId();
      this.GetAddOnsByMerchantIdWithOptions();
      this.addingAddons = false;
      this.closeModal()
    }, (err) => {
      this.closeModal()
      this.addingAddons = false;
      this.toaster.error(err.message);
    })
  }
  get underlineStyle() {
    return `translateX(${this.selectedTab * 100}%)`;
  }

  selectTab(index: number) {

    this.searchTermModifierGroup = ''
    this.searchTermAddons = ''
    this.filterAddons()
    this.filterModifierGroup()

    this.selectedTab = index;
    this.router.navigate([], {
      fragment: `tab=${index}`,
      queryParamsHandling: 'preserve'  // Preserve existing query params
    });
  }

  openModal() {
    this.createModifierModal.show()
  }

  closeModal() {
    this.createModifierModal.hide()
    this.createMenuModal.hide()
  }
  openModalForSuggestCategory() {
    this.suggestCategoryModal.show()
  }
  closeModalForSuggestCategory() {
    this.suggestCategoryModal.hide()
  }


  AddonStatusToggle(item: any, event: Event) {
    const originalStatus = item.status;

    const title = item.status === 1
      ? "Inactivate"
      : "Activate";
    // Prevent default checkbox behavior until confirmed
    event.preventDefault();

    const message = item.status === 1
      ? "Are you sure that you want to inactivate this modifier group?"
      : "Are you sure that you want to activate this modifier group?";

    const modalDto = new LazyModalDtoNew();
    modalDto.Title = `${title} modifier group`;
    modalDto.Text = message;
    modalDto.acceptButtonText = `Yes, ${title} modifier group`
    modalDto.Description = `This will make your modifier group ${title}.
    Would you like to ${title} the modifier group ?`
    modalDto.callBack = () => {
      item.status = item.status === 1 ? 0 : 1
      this.addEditAddOnObj.addon = item;
      this.EditAddOns(item, true);
    };

    modalDto.rejectCallBack = () => {
      (event.target as HTMLInputElement).checked = originalStatus === 1;
    };

    this.appUi.openLazyConfrimModalNew(modalDto);
  }

  EditAddOns(item, isonlyStatus?: boolean) {
    this.addingAddons = true;


    this.addEditAddOnObj.token = this.securityService.securityObject.token;
    if (this.addEditAddOnObj.addon.status) {
      this.addEditAddOnObj.addon.status = 1
    }
    else {
      this.addEditAddOnObj.addon.status = 0
    }
    this.catProductsService.EditAddOn(this.selectedMerchantId, '', this.addEditAddOnObj).subscribe((data: any[]) => {

      this.toaster.success("Modifier Group status changed.");
      if (!isonlyStatus) {
        this.GetAddOnsByMerchantIdWithOptions();
      }


      this.addingAddons = false;

      this.closeModal()
    }, (err) => {
      this.closeModal()
      this.addingAddons = false;
      this.toaster.error(err.message);
    })
  }
  EditModifier(addon: any) {
    this.openmodalfor = 'edit'
    this.addEditAddOnObj.addon = addon
    this.openModal()
  }
  addaddon() {
    this.openmodalfor = 'add'
    this.addEditAddOnObj = new AddEditAddonDto()
    this.openModal()
  }


  deletemodifiergroup(id: any) {
    let nObj = id;
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove modifier group";
    modalDto.Description = "By taking this action, you will remove the modifier group.Would you like to remove the modifier group?"
    modalDto.acceptButtonText = "Yes, Remove modifier group";
    modalDto.Text = "Are you sure that you want to remove this modifier group?";
    modalDto.callBack = this.DeleteAddOn;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModalNew(modalDto);
  }



  DeleteAddOn = (addonid: string) => {
    this.deletingAddOn = true;
    this.workingwithremovemodifier = addonid
    this.catProductsService.DeleteAddOn(this.selectedMerchantId, '', addonid, this.securityService.securityObject.token).subscribe((data: any) => {

      this.MerchantaddOnsList = this.MerchantaddOnsList.filter(addon => addon.id !== addonid);

      this.MerchantaddOnsListWithOptions = this.MerchantaddOnsListWithOptions.filter(addon => addon.id !== addonid);

      //this.originalModifierGroup = [...this.MerchantaddOnsList];
      this.someModifiers = this.MerchantaddOnsList.length > 0;
      this.deletingAddOn = false;
      this.workingwithremovemodifier = ''
      this.toaster.success('Modifier group deleted successfully');
      this.GetProductsList()
      this.GetAddOnsByMerchantIdWithOptions()
    }, (err) => {
      this.workingwithremovemodifier = ''
      this.deletingAddOn = false;
      this.toaster.error(err.message);
    })
  };





  suggestModifier() {
    this.someModifiers = true;
    this.suggestCategoryModal.hide()
  }
  addModifierGroup() {
    this.someModifiers = true;
    // this.createMenuModal.hide()

  }


  openModalForAddModifier() {
    this.addModifierModal.show()
  }
  closeModalForAddModifier() {
    this.addModifierModal.hide()
  }

  saveModifier() {

    this.addModifierModal.hide()

  }

  openModalForSuggestModifier() {
    this.suggestModifierModal.show()
  }
  closeModalForSuggestModifier() {
    this.suggestModifierModal.hide()
  }



  deleteAddonOption(id: any) {
    let nObj = id;
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove modifier";
    modalDto.Description = "By taking this action, you will remove the modifier.Would you like to remove the modifier?"
    modalDto.acceptButtonText = "Yes, Remove modifier";
    modalDto.Text = "Are you sure that you want to remove this modifier?";
    modalDto.callBack = this.deleteAddonOptionCallback;
    modalDto.data = nObj;

    this.appUi.openLazyConfrimModalNew(modalDto);
  }

  deleteAddonOptionCallback = (id: string) => {
    this.workingwithremove = id
    this.itemService.deleteMerchantitem(this.selectedMerchantId, id).subscribe((data: any) => {

      this.ProductsList = this.ProductsList.filter(Product => Product.id !== id);;
      this.addonsList = this.ProductsList.filter(item => item.itemType === 2);
      this.someModifiersItems = this.addonsList.length > 0
      this.originalAddons = [...this.addonsList];
      this.workingwithremove = ''
      this.toaster.success("Modifier deleted.")
    }, (err) => {
      this.workingwithremove = ''
      this.toaster.error(err.error.message);
    })
  };



  modifierStatusToggle(item: any, event: Event) {
    const originalStatus = item.itemStatus;


    const title = item.itemStatus === 1
      ? "Inactivate"
      : "Activate";
    // Prevent default checkbox behavior until confirmed
    event.preventDefault();

    const message = item.itemStatus === 1
      ? "Are you sure that you want to inactivate this modifier?"
      : "Are you sure that you want to activate this modifier?";

    const modalDto = new LazyModalDtoNew();
    modalDto.Title = `${title} modifier`;
    modalDto.Text = message;
    modalDto.acceptButtonText = `Yes, ${title} modifier`
    modalDto.Description = `This will make your modifier ${title}.
      Would you like to ${title} the modifier ?`

    modalDto.callBack = () => {
      item.itemStatus = item.itemStatus === 1 ? 0 : 1;

      this.modifierStatusToogleCallback(item.itemStatus, item.id, true);
    };

    modalDto.rejectCallBack = () => {
      (event.target as HTMLInputElement).checked = originalStatus === 1;
    };

    this.appUi.openLazyConfrimModalNew(modalDto);
  }


  modifierStatusToogleCallback(status: number, id: string, isonlystatus?: boolean) {

    this.catProductsService.DisableEnableItem(this.selectedMerchantId, id, {
      "itemStatus": status
    }).subscribe((data: any) => {

      this.toaster.success('Modifier status changed');
      this.GetAddOnsByMerchantIdWithOptions(false)
      if (!isonlystatus) {
        this.GetProductsList()

      }
    }, (err) => {
      this.toaster.error(err.error.message);
    })
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

  isPriceInvalid(): boolean {
    const price = this.addProductObj.item.itemUnitPrice;
    const isInvalid = price === null ||
      price === undefined ||
      typeof price !== 'number' ||
      isNaN(price) ||
      price <= 0;
    console.log('Price:', price, 'Is Invalid:', isInvalid);
    return isInvalid;
  }

  AddProductForMerchant() {
    this.addingProducts = true
    this.addProductObj.token = this.securityService.securityObject.token;
    const filteredPlatforms = this.PlatformsPricingList.filter((item: { platformItemPrice: any }) => {
      // Convert platformItemPrice to a number for comparison
      const price = Number(item.platformItemPrice);
      return price !== 0 && !isNaN(price); // Ensure it's not NaN
    });
    this.addProductObj.item.itemPriceMappings = filteredPlatforms
    console.log(this.addProductObj.item.itemPriceMappings);
    this.addProductObj.item.itemType = 2;
    console.log(this.addProductObj)
    this.itemService.createMerchantItem(this.selectedMerchantId, this.addProductObj).subscribe((data: ItemDto) => {
      this.toaster.success("Modifier added")
      this.addingProducts = false
      this.createMenuModal.hide()
      this.GetProductsList();
    }, (err) => {
      this.toaster.error(err.message);
    })

  }
  downloadTemplate() {
    this.loadingfordownload = true;
    this.merchantService.getMenuTemplateURL(this.selectedMerchantId, 2).subscribe((data: any) => {

      const a = document.createElement('a');
      a.href = data.data.download_url;
      a.click();
      this.loadingfordownload = false
    }, (err) => {
      this.loadingfordownload = false;
      this.toaster.error(err.error.message);
    })
  }


  onitemSelect(event: any) {
    console.log(event)
    let type: number = MerchantPlatformsEnumNewMenu[event as keyof typeof MerchantPlatformsEnumNewMenu];

    if (!this.selectedPlatformWhileAdding.includes(type)) {
      this.selectedPlatformWhileAdding.push(type);
    }
    console.log(this.selectedPlatformWhileAdding)
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
    console.log(this.platformNames);
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;

    if (files && files.length > 0) {
      this.fileToUpload = files.item(0);
      this.updateFileToServer()
    }
  }

  dropdownsetting() {

    this.dropdownSettings = {
      singleSelection: false,
      itemsShowLimit: 7,
      allowSearchFilter: true,
      enableCheckAll: false

    };
  }
  fillPlatformSelection() {
    this.selectedPlatformWhileAdding = [];
  }



  updateFileToServer() {
    this.selectedPlatformWhileAdding = [1, 5, 11, 7, 4, 3, 2, 50, 6]
    this.loadingforupload = true;
    console.log(" this.selectedPlatformWhileAdding.join(',')", this.selectedPlatformWhileAdding.join(','))
    this.merchantservice.uploadItemsCSV(this.selectedMerchantId, this.fileToUpload, this.selectedPlatformWhileAdding.join(',')).subscribe((data: any) => {
      this.toaster.success("File uploaded successfully.")
      this.clearSelection()
      this.loadingforupload = false;
      this.triggerChangeParent.emit();
      this.GetProductsList()
      this.selectedTab = 1
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


  //modifier builders
  GetAddOnsByMerchantIdWithOptions(isboolean?: boolean) {
    isboolean = isboolean ?? true;
    console.log("running")
    this.MerchantaddOnsWithOptions = isboolean;
    this.gettingMerchantAddOns = isboolean;
    //this.MerchantaddOnsListWithOptions = [];
    this.catProductsService.GetAddOnsWIthOptionsByMerchantId(this.selectedMerchantId, this.securityService.securityObject.token).subscribe((data: AddonDtoWithOptions[]) => {
      this.MerchantaddOnsListWithOptions = data;
      this.originalModifierGroup = [...this.MerchantaddOnsListWithOptions];
      this.someModifiers = this.MerchantaddOnsListWithOptions.length > 0;
      this.gettingMerchantAddOns = false;
      this.MerchantaddOnsWithOptions = false;
    }, (err) => {
      this.gettingMerchantAddOns = false;
      this.gettingMerchantAddOns = false;
      this.toaster.error(err.message);
    })
  }




  storeOriginalStatus(currentStatus: any) {
    this.originalStatus = currentStatus;
    console.log("status", this.originalStatus)
  }


  onItemStatusChange(item?: any, addon?: any) {
    if (item.addonOptionStatus == 3) {
      this.deleteOption(addon.id, item)

    } else {
      console.log("status changed")
      this.modifierStatusToogleCallback(item.addonOptionStatus, item.id)
    }
  }


  deleteOption(addonID: any, item: any) {
    let nObj = {
      id: item.id,
      addonID: addonID
    };
    console.log(nObj)
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove Modifier";
    modalDto.Description = " By taking this action, you will remove the modifier from this modifier group."
    modalDto.Text = "Would you like to remove the modifier from this modifier group?";
    modalDto.acceptButtonText = "Yes, Remove modifier"
    modalDto.callBack = () => this.UpdateAddonsOptions(nObj);
    modalDto.data = nObj;
    modalDto.rejectCallBack = () => {
      item.addonOptionStatus = this.originalStatus
    };
    this.appUi.openLazyConfrimModalNew(modalDto);
  }



  //add or remove modifier

  UpdateAddonsOptions = (input?: any) => {
    //this.savingAssignModifier = true;
    this.addingItems = true
    this.someModifiers = true
    const { addonID, id } = input;
    //this.gettingProducts = true
    let data = {}
    if (id) {

      //this.workingwithremovemodifier = id
      data = {
        "itemId": id,
        "delete": 1
      }
    }
    else {
      data = {
        "itemId": this.selectedItems,
        "delete": 0
      }
    }

    this.itemService.updateItemAddonOptions(this.selectedMerchantId, addonID, data).subscribe((data: any) => {
      //this.addonsItemsList = []
      //this.addItemModal.hide()
      if (id) {
        this.toaster.success('Modifier removed successfully.');
        this.addingItems = false
        //this.workingwithremovemodifier = ''
      }
      else {
        this.toaster.success('Modifier added successfully.');
        this.addingItems = false
        this.closeModalForAddItems()
      }
      this.GetAddOnsByMerchantIdWithOptions()
      this.GetProductsList()
    }, (err) => {

      this.toaster.error(err.error.message);
    })
  }


  openModalForAddItems(addon: any) {
    this.openModalforID = addon.id
    this.isFiltering = true
    this.searchTermBuilder = ''
    this.selectedItems = []
    this.addItemsModal.show()
    this.itemsListAll = this.addonsList
    if (addon && addon.addonOptions && addon.addonOptions.length > 0) {
      const ItemsIdsToRemove = new Set(addon.addonOptions.map(item => item.id)); // Collect IDs to remove

      // Ensure correct filtering of items
      this.itemsListAll = this.itemsListAll.filter(item => {
        return !ItemsIdsToRemove.has(item.id); // Filter out items with matching IDs
      });
    }
    this.isFiltering = false
    this.originalBuilderAddons = [...this.itemsListAll];
  }

  closeModalForAddItems() {
    this.searchTermAddons = ''
    this.filterAddons()
    this.addItemsModal.hide()
  }

  isSelectedItem(menuId: string): boolean {
    return this.selectedItems.includes(menuId);
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


  addModifier() {
    this.addingItems = true
    let nObj = {
      addonID: this.openModalforID
    };
    this.UpdateAddonsOptions(nObj)
  }


  getTotalItemCountByAddonOptionId(addonOptionId: string): number {
    let totalItemCount = 0;

    // Step 1: Loop through all the AddonDtoWithOptions
    this.MerchantaddOnsListWithOptions.forEach((addon) => {
      // Step 2: Check if any addonOption in the current addon matches the given addonOptionId
      const matchingOption = addon.addonOptions.find((option) => option.id === addonOptionId);

      // Step 3: If a match is found, add the item's itemcount to the total
      if (matchingOption) {
        totalItemCount += addon.itemcount;
      }
    });

    return totalItemCount > 0 ? totalItemCount : 0;
  }


  onDragStarted(obj: any) {
    console.log("drag starting")
    this.dataToSort = obj.addonOptions
    this.addonID = obj.id
    console.log("categorylist obj in on drga", this.dataToSort)
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log("drag starting")
    moveItemInArray(this.dataToSort, event.previousIndex, event.currentIndex);
    this.dataToPush = []
    this.dataToSort.forEach((x, index) => {
      console.log("drag starting for each")
      this.dataToPush.push({
        "optionId": x.id,
        "sortId": index
      })

    })
    this.merchantService.sortAddonOptions({ "options": this.dataToPush }, this.selectedMerchantId, this.addonID).subscribe((data: any) => {

      this.toaster.success("Sorting saved successfully!");
    }, (err) => {
      this.toaster.error(err.error.message);
    })


  }
}

