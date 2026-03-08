import { ClonerService } from './../../core/DataServices/cloner.service';
import { ItemService } from './../../core/item.service';
import { AppUiService } from './../../core/app-ui.service';
import { MerchantService } from './../../core/merchant.service';
import { AddonDtoWithOptions, AddEditAddonDto, AddonDtoWithoutOptions } from './../../Models/Cat_Product.model';
import { ProductsCategoriesService } from './../../core/products-categories.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { SecurityService } from 'src/app/core/security.service';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/core/app-state.service';
import { ItemDto } from 'src/app/Models/item.model';
import Swal from 'sweetalert2'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserRoleEnum } from "../../Models/user.model";
import { TranslocoService } from '@ngneat/transloco';

import { LazyModalDto,LazyModalDtoNew } from 'src/app/Models/app.model';


@UntilDestroy()
@Component({
  selector: 'app-modifiers-details',
  templateUrl: './modifiers-details.component.html',
  styleUrls: ['./modifiers-details.component.css']
})
export class ModifiersDetailsComponent implements OnInit {
  @ViewChild('suggestCategoryModal') suggestCategoryModal: ModalDirective;
  @ViewChild('addItemModal') addItemModal: ModalDirective;


  selectedTab = 0;
  someoptions: boolean = false;
  someItems: boolean = false
  selectedMerchantId = ''
  addonid = ''
  gettingMerchantAddOn: boolean = true
  MerchantaddOn = new AddonDtoWithOptions();
  MerchantaddOnprserve = new AddonDtoWithOptions();
  gettingProducts = true;
  ProductsList: ItemDto[];
  addonsList: ItemDto[];
  addonsItemsList: ItemDto[] = [];
  productsListPreserve: ItemDto[] = [];
  openmodalfor = ''
  savingAssignModifier: boolean = false;
  selectedItemsIds = []
  disabled: boolean = true
  addingAddons: boolean = false
  addEditAddOnObj = new AddEditAddonDto();
  originalItems: ItemDto[] = [];
  searchTerm: string = '';
  dataToPush: any = []
  workingwithremovemodifier = ''
  workingwithremoveitem = ''
  tabCount = ''
  forNoCategory: boolean
  tabMatch: any
  userRoleType: UserRoleEnum;
  constructor(private merchantService: MerchantService, private toaster: ToastrService, private securityService: SecurityService,
    private catProductsService: ProductsCategoriesService,
    private appState: AppStateService, private route: ActivatedRoute, private itemService: ItemService, private cloner: ClonerService, private router: Router
    , private translocoService: TranslocoService,private appUi: AppUiService,) { }

  ngOnInit(): void {
    this.addonid = this.route.snapshot.paramMap.get('addonid');
    this.selectedMerchantId = this.route.snapshot.queryParams['merchantid']

    this.userRoleType = this.securityService.securityObject.user.role;
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

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.tabMatch = fragment.match(/tab=(\d+)/);
        if (this.tabMatch) {
          this.tabMatch = Number(this.tabMatch[1]);
        }
      }
    });
    this.subscribeAppState()

    this.GetAddonById()

    if (this.tabMatch !== undefined && this.tabMatch !== null) {
      this.selectTab(this.tabMatch);
    } else {
      if (this.tabCount == 'items') {
        this.selectTab(1)
      } else if (this.tabCount == "addonsOptions") {
        this.selectTab(2)
      } else {
        this.selectTab(this.selectedTab)
      }
    }

  }

  drop(event: CdkDragDrop<string[]>) {
    console.log("drag starting")
    moveItemInArray(this.MerchantaddOn.addonOptions, event.previousIndex, event.currentIndex);
    this.dataToPush = []
    this.MerchantaddOn.addonOptions.forEach((x, index) => {
      console.log("drag starting for each")
      this.dataToPush.push({
        "optionId": x.id,
        "sortId": index
      })

    })
    this.merchantService.sortAddonOptions({ "options": this.dataToPush }, this.selectedMerchantId, this.addonid).subscribe((data: any) => {

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
        this.router.navigate(['home/menus/modifiers']);
      }
    })
  }
  GetAddonById(isonlystatus: boolean = true) {
    this.gettingMerchantAddOn = isonlystatus;
    this.catProductsService.GetAddOnById(this.selectedMerchantId, this.addonid, this.securityService.securityObject.token).subscribe((data: any) => {
      this.MerchantaddOn = data;
      this.MerchantaddOnprserve = this.cloner.deepClone(this.MerchantaddOn);
      this.someoptions = this.MerchantaddOn.addonOptions.length > 0
      // this.forNoCategory = !this.someoptions
      this.someItems = this.MerchantaddOn.addonItems.length > 0
      this.GetProductsList()
      this.gettingMerchantAddOn = false;

    }, (err) => {

      this.gettingMerchantAddOn = false;
      this.toaster.error(err.message);
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
  GetProductsList() {
    this.gettingProducts = true;
    this.ProductsList = [];
    this.itemService.getMerchantitems(this.selectedMerchantId, this.securityService.securityObject.token).subscribe((data: ItemDto[]) => {
      this.ProductsList = data;
      this.addonsList = this.ProductsList.filter(item => item.itemType === 2);
      this.ProductsList = this.ProductsList.filter(item => item.itemType !== 2);
      this.removeInstances()
      this.gettingProducts = false;
    }, (err) => {
      this.gettingProducts = false;
      this.toaster.error(err.message);
    })
  }
  removeInstances() {
    const itemsIdsToRemove = new Set(this.MerchantaddOn.addonItems.map(item => item.id));
    console.log("itemsIdsToRemove ", itemsIdsToRemove)
    this.ProductsList = this.ProductsList.filter(item => !itemsIdsToRemove.has(item.id));

    const optionsIdsToRemove = new Set(this.MerchantaddOn.addonOptions.map(option => option.id));
    this.addonsList = this.addonsList.filter(option => !optionsIdsToRemove.has(option.id));
    this.forNoCategory = this.addonsList.length == 0
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

  addMenu() {

    this.suggestCategoryModal.hide()

  }
  openModalForAddItem(keyr: string) {
    this.openmodalfor = keyr
    if (this.openmodalfor == 'items') {
      this.addonsItemsList = this.ProductsList
    }
    else {
      this.addonsItemsList = this.addonsList
    }
    this.selectedItemsIds = []
    this.addItemModal.show()
  }


  filterItems(): void {
    if (this.openmodalfor == 'items') {
      this.originalItems = [...this.ProductsList];
    }
    else {
      this.originalItems = [...this.addonsList];
    }

    if (this.searchTerm) {
      this.addonsItemsList = this.originalItems.filter(item =>
        item.itemName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.addonsItemsList = [...this.originalItems];
    }
  }


  closeModalForAddItem() {
    this.addonsItemsList = []
    this.addItemModal.hide()
  }


  UpdateItem = (id?: string) => {
    this.savingAssignModifier = true;
    this.gettingProducts = true
    let data = {}
    let payloaditemid = ''
    if (id) {
      this.workingwithremoveitem = id
      payloaditemid = id
      data = {
        "addonId": this.addonid,
        "delete": 1
      }
    }
    else {
      payloaditemid = this.addonid
      data = {
        "itemids": this.selectedItemsIds,
        "delete": 0
      }
    }

    this.itemService.updateItemIddons(this.selectedMerchantId, payloaditemid, data).subscribe((data: any) => {
      this.addonsItemsList = []
      this.addItemModal.hide()
      if (id) {
        this.workingwithremoveitem = ''
        this.toaster.success('Item removed successfully.');
      }
      else {
        this.toaster.success('Item added successfully.');
      }
      this.GetAddonById()
      this.savingAssignModifier = false;

    }, (err) => {
      this.workingwithremoveitem = ''
      this.addonsItemsList = []
      this.addItemModal.hide()
      this.savingAssignModifier = false;

      this.toaster.error(err.error.message);
    })
  }
  
  
  UpdateAddonsOptions = (id?: string) => {
    this.savingAssignModifier = true;
    this.gettingProducts = true
    let data = {}
    if (id) {
      this.workingwithremovemodifier = id
      data = {
        "itemId": id,
        "delete": 1
      }
    }
    else {
      data = {
        "itemId": this.selectedItemsIds,
        "delete": 0
      }
    }

    this.itemService.updateItemAddonOptions(this.selectedMerchantId, this.addonid, data).subscribe((data: any) => {
      this.addonsItemsList = []
      this.addItemModal.hide()
      if (id) {
        this.toaster.success('Modifier removed successfully.');
        this.workingwithremovemodifier = ''
      }
      else {
        this.toaster.success('Modifier  added successfully.');
      }
      this.GetAddonById()
      this.savingAssignModifier = false;
    }, (err) => {
      this.workingwithremovemodifier = ''
      this.addonsItemsList = []
      this.addItemModal.hide()
      this.savingAssignModifier = false;
      this.toaster.error(err.error.message);
    })
  }


  onCategoryChange(event: any, itemId: number) {
    console.log("categories list is ", this.selectedItemsIds)
    if (event.target.checked) {
      // Add the category ID to the selected list if it is checked
      this.selectedItemsIds.push(itemId);
    } else {
      // Remove the category ID from the selected list if it is unchecked
      this.selectedItemsIds = this.selectedItemsIds.filter(id => id !== itemId);
    }
  }
  toggleAllCategories(event: any) {
    if (event.target.checked) {
      // If "Select All" is checked, select all category IDs
      this.selectedItemsIds = this.addonsItemsList.map(cat => cat.id);
    } else {
      // If "Select All" is unchecked, clear the selected category IDs
      this.selectedItemsIds = [];
    }
  }
  areAllCatsSelected(): boolean {
    return this.addonsItemsList.length > 0 && this.selectedItemsIds.length === this.addonsItemsList.length;
  }
  transform(value: string): any {
    console.log("value is ", value)
    if (!value) return '';
    let val = value.charAt(0).toUpperCase() + value.slice(1)
    let returnvalue = ''
    this.translocoService.selectTranslate('Menus.' + val).subscribe(translation => {
      returnvalue = translation;
    });
    return returnvalue
  }
  


  deleteItem(id: any) {
    let nObj = id;
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove Item";
    modalDto.Description = " By taking this action, you will remove the item from this modifier group."
    modalDto.Text = "Would you like to remove the item from this modifier group?";
    modalDto.acceptButtonText = "Yes, Remove Item"
    modalDto.callBack = this.UpdateItem;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModalNew(modalDto);
  }



  deleteOption(id: any) {
    let nObj = id;
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove Modifier";
    modalDto.Description = " By taking this action, you will remove the modifier from this modifier group."
    modalDto.Text = "Would you like to remove the modifier from this modifier group?";
    modalDto.acceptButtonText = "Yes, Remove modifier"
    modalDto.callBack = this.UpdateAddonsOptions;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModalNew(modalDto);
  }

  editModifier() {
    this.MerchantaddOnprserve = this.cloner.deepClone(this.MerchantaddOn);
  }
  canceleditModifier() {

    this.MerchantaddOn = this.MerchantaddOnprserve
    this.disabled = true
  }
  EditAddOns() {
    this.addingAddons = true;
    this.addEditAddOnObj.token = this.securityService.securityObject.token;
    this.addEditAddOnObj.addon = this.MerchantaddOn
    this.addEditAddOnObj.addon.maxPermitted = !this.MerchantaddOn.maxPermitted || isNaN(this.MerchantaddOn.maxPermitted)
      ? 0
      : this.MerchantaddOn.maxPermitted;
    this.addEditAddOnObj.addon.minPermitted = !this.MerchantaddOn.minPermitted || isNaN(this.MerchantaddOn.minPermitted)
      ? 0
      : this.MerchantaddOn.minPermitted;
    if (this.addEditAddOnObj.addon.status) {
      this.addEditAddOnObj.addon.status = 1
    }
    else {
      this.addEditAddOnObj.addon.status = 0
    }
    this.catProductsService.EditAddOn(this.selectedMerchantId, '', this.addEditAddOnObj).subscribe((data: any[]) => {
      this.GetAddonById();
      this.disabled = true
      this.toaster.success('Modifier Group Updated Successfully.');
      this.addingAddons = false;
    }, (err) => {
      this.addingAddons = false;
      this.disabled = true
      this.toaster.error(err.message);
    })
  }


  //active inactive modifier
  modifierStatusToggle(item: any, event: Event) {
    const originalStatus = item.addonOptionStatus;
    

    const title  = item.addonOptionStatus === 1 
    ? "Inactivate" 
    : "Activate";
    // Prevent default checkbox behavior until confirmed
    event.preventDefault();
  
    const message = item.addonOptionStatus === 1 
      ? "Are you sure that you want to inactivate this modifier?" 
      : "Are you sure that you want to activate this modifier?";
  
      const modalDto = new LazyModalDtoNew();
      modalDto.Title = `${title} modifier`;
      modalDto.Text = message;
      modalDto.acceptButtonText = `Yes, ${title} modifier`
      modalDto.Description = `This will make your modifier ${title}.
      Would you like to ${title} the modifier ?`
  
    modalDto.callBack = () => {
      item.addonOptionStatus = item.addonOptionStatus === 1 ? 0 : 1;
      
      this.modifierStatusToogleCallback(item.addonOptionStatus, item.id, true);
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
      this.GetAddonById(false)
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
}
