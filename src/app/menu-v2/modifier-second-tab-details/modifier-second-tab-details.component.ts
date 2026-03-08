import { ClonerService } from './../../core/DataServices/cloner.service';
import { ItemService } from './../../core/item.service';
import { AppUiService } from './../../core/app-ui.service';
import { MerchantService } from './../../core/merchant.service';
import { AddonDtoWithoutOptions,AddEditAddonDto } from './../../Models/Cat_Product.model';
import { ProductsCategoriesService } from './../../core/products-categories.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { SecurityService } from 'src/app/core/security.service';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/core/app-state.service';
import Swal from 'sweetalert2'
import {
  MerchantPlatformsEnum,
} from 'src/app/Models/merchant.model';
import { ItemDetailObject, AddonItemDetailDto } from './../../Models/item.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserRoleEnum } from "../../Models/user.model";
import { LazyModalDto,LazyModalDtoNew } from 'src/app/Models/app.model';


@UntilDestroy()
@Component({
  selector: 'app-modifier-second-tab-details',
  templateUrl: './modifier-second-tab-details.component.html',
  styleUrls: ['./modifier-second-tab-details.component.css']
})
export class ModifierSecondTabDetailsComponent {
  @ViewChild('suggestCategoryModal') suggestCategoryModal: ModalDirective;
  @ViewChild('addItemModal') addItemModal: ModalDirective;


  selectedTab = 0;
  someMenu: boolean = false;
  someItems: boolean = false
  optionid = ''
  selectedMerchantId = ''
  itemsDetailObj = new ItemDetailObject();
  itemsDetailObjpreserve = new ItemDetailObject();
  gettingAddOns: boolean;
  MerchantPlatformsEnum = MerchantPlatformsEnum
  platformBasedPricing: boolean = true;
  PlatformsPricingList = []
  doordashPrice: number
  ubereatsPrice: number
  grubhubPrice: number
  editingOptins: boolean = false
  MerchantaddOnsList: AddonDtoWithoutOptions[] = [];
  MerchantaddOnsListPreserve: AddonDtoWithoutOptions[] = [];
  MerchantOptionsaddOnsList: AddonDtoWithoutOptions[] = [];
  gettingMerchantAddOns: boolean;
  gettingaddonIds: boolean
  someModifiers: boolean = false;
  originalAddons: AddonDtoWithoutOptions[] = [];
  searchTerm: string = '';
  addonsids = []
  tabCount = ''
  tabMatch: any
  userRoleType: UserRoleEnum;

  crossIcon: boolean = false;
  addEditAddOnObj = new AddEditAddonDto();

  productTypeList = [
    { "id": 1, "type": "Item" },
    { "id": 2, "type": "Add On Option" }
  ]
  selectedItemsIds = []
  disabled: boolean = true
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
  fileToUpload: File | null = null;
  workingwithremovemodifier = ''

  savingAssignModifier: boolean = false;
  constructor(private toaster: ToastrService, private securityService: SecurityService,
    private catProductsService: ProductsCategoriesService,
    private appState: AppStateService, private route: ActivatedRoute, private itemService: ItemService, private cloner: ClonerService, private router: Router,private appUi: AppUiService) { }


  ngOnInit(): void {
    this.optionid = this.route.snapshot.paramMap.get('optionid');
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
    this.gettingAddOns = true;
    this.GetItemDetails()

    if (this.tabMatch !== undefined && this.tabMatch !== null) {
      this.selectTab(this.tabMatch);
    } else {
      if (this.tabCount == 'modifiers') {
        this.selectTab(1)
      } else {
        this.selectTab(this.selectedTab)
      }
    }
    setTimeout(() => {
      this.crossIcon = true;
    }, 3000);

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
  GetItemDetails() {

    this.itemService.getMerchantitem(this.selectedMerchantId, this.optionid).subscribe((data: ItemDetailObject) => {
      this.itemsDetailObj = data;
      console.log("item obj ", this.itemsDetailObj.itemPriceMappings)
      //this.updatePrices(this.itemsDetailObj.itemPriceMappings);
      if (this.itemsDetailObj.itemPriceMappings && this.itemsDetailObj.itemPriceMappings.length > 0) {
        this.platformBasedPricing = true
        this.PlatformsPricingList = this.itemsDetailObj.itemPriceMappings
      }
      else {
        this.PlatformsPricingList = []
        this.platformBasedPricing = false
      }
      this.gettingaddonIds = true
      if (this.disabled == false) {
        this.editModifierOption()
      }
      this.GetAddOnsByMerchantId()
      this.gettingAddOns = false;
    }, (err) => {
      this.gettingAddOns = false;
      this.toaster.error(err.message);
    })
  }



  filterAddons(): void {
    if (this.searchTerm) {
      this.MerchantaddOnsList = this.originalAddons.filter(item =>
        item.addonName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.MerchantaddOnsList = [...this.originalAddons];
    }
  }

  GetAddOnsByMerchantId() {
    this.gettingMerchantAddOns = true;
    this.addItemModal.hide()
    this.MerchantaddOnsList = [];
    this.catProductsService.GetAddOnsWIthoutOptionsByMerchantId(this.selectedMerchantId, this.securityService.securityObject.token, 0).subscribe((data: AddonDtoWithoutOptions[]) => {
      this.MerchantaddOnsList = data;
      this.MerchantaddOnsListPreserve = this.cloner.deepClone(this.MerchantaddOnsList);
      console.log("MerchantaddOnsList", this.MerchantaddOnsList)
      
      this.someModifiers = this.MerchantaddOnsList.length > 0;
      this.GetAddOnsByOptionId()
    }, (err) => {
      this.gettingMerchantAddOns = false;
      this.toaster.error(err.message);
    })
  }
  GetAddOnsByOptionId() {
    this.MerchantaddOnsList = this.MerchantaddOnsListPreserve
    this.catProductsService.GetOptionAddonsbyId(this.selectedMerchantId, this.securityService.securityObject.token, this.optionid).subscribe((data: AddonDtoWithoutOptions[]) => {
      this.addonsids = data['addons_ids'];
      console.log("this.addons ids ", this.addonsids)
      this.someModifiers = this.MerchantOptionsaddOnsList.length > 0
      this.extractandremoveaddons()
      this.someModifiers = this.addonsids.length > 0;
      this.gettingaddonIds = false;
    }, (err) => {
      this.gettingaddonIds = false;
      this.toaster.error(err.message);
    })
  }
  extractandremoveaddons() {
    const itemsIdsToRemove = new Set(this.addonsids);
    this.MerchantOptionsaddOnsList = this.MerchantaddOnsList.filter(item => itemsIdsToRemove.has(item.id));
    this.MerchantaddOnsList = this.MerchantaddOnsList.filter(item => !itemsIdsToRemove.has(item.id));
    this.originalAddons = [...this.MerchantaddOnsList];
  }
  UpdateAddonsOptions = (id?: string) => {
    this.savingAssignModifier = true;
    let data = {}
    if (id) {
      this.workingwithremovemodifier = id
      data = {
        "AddonId": id,
        "delete": 1
      }
    }
    else {
      data = {
        "AddonId": this.selectedItemsIds,
        "delete": 0
      }
    }

    this.itemService.updateItemAddonOptions(this.selectedMerchantId, this.optionid, data).subscribe((data: any) => {

      if (id) {
        this.MerchantOptionsaddOnsList = this.MerchantOptionsaddOnsList.filter(item => item.id != id);
        this.toaster.success('Modifier removed successfully.')

      }
      else {
        this.toaster.success('Modifier added successfully.');
        this.addItemModal.hide()
      }
      this.GetAddOnsByOptionId()
      this.workingwithremovemodifier = ''

      this.savingAssignModifier = false;
    }, (err) => {
      this.addItemModal.hide()
      this.workingwithremovemodifier = ''
      this.savingAssignModifier = false;
      this.toaster.error(err.error.message);
    })
  }
  

  deleteOption(id: any) {
    let nObj = id;
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove Modifier Group";
    modalDto.Description = "By taking this action, you will remove the modifier group from this modifier."
    modalDto.Text = "Would you like to remove the modifier group from this modifier?";
    modalDto.acceptButtonText = "Yes, Remove Modifier Group"
    modalDto.callBack = this.UpdateAddonsOptions;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModalNew(modalDto);
  }

  get underlineStyle() {
    return `translateX(${this.selectedTab * 100}%)`;
  }
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
    this.someMenu = true;
    this.suggestCategoryModal.hide()

  }
  openModalForAddItem() {
    this.selectedItemsIds = []
    this.addItemModal.show()
  }
  closeModalForAddItem() {
    this.addItemModal.hide()
  }

  addItem() {
    this.someItems = true
    this.addItemModal.hide()

  }

  fillPlatformPricingCheckboxesonedit() {
    this.PlatformsPricingList = this.itemsDetailObj.itemPriceMappings
    console.log("thisplatforms", this.PlatformsPricingList)
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
  editModifierOption() {
    this.itemsDetailObjpreserve = this.cloner.deepClone(this.itemsDetailObj);
    if (this.PlatformsPricingList && this.PlatformsPricingList.length > 0) {
      this.fillPlatformPricingCheckboxesonedit()
    }
  }

  canceleditModifierOption() {

    this.itemsDetailObj = this.itemsDetailObjpreserve
    this.PlatformsPricingList = this.itemsDetailObj.itemPriceMappings
    if (this.PlatformsPricingList && this.PlatformsPricingList.length > 0) {
      this.platformBasedPricing = true
    }
    this.disabled = true
  }

  EditAddOnsOption() {
    this.editingOptins = true
    const filteredPlatforms = this.PlatformsPricingList.filter((item: { platformItemPrice: any }) => {
      const price = Number(item.platformItemPrice);
      return price !== 0 && !isNaN(price); // Ensure it's not NaN
    });
    this.itemsDetailObj.itemPriceMappings = filteredPlatforms
    if (Boolean(this.itemsDetailObj.itemStatus) === true) {
      this.itemsDetailObj.itemStatus = 1;
    }
    else {
      this.itemsDetailObj.itemStatus = 0
    }
    let data = {
      "token": this.securityService.securityObject.token,
      "item": this.itemsDetailObj
    }
    console.log(data)


    let itemstatus = this.itemsDetailObj.itemStatus;
    if( typeof this.itemsDetailObj.itemStatus == "boolean"){      
      itemstatus = this.itemsDetailObj.itemStatus == true ? 1 : this.itemsDetailObj.itemStatus === false ? 0 :this.itemsDetailObj.itemStatus;
    }
    let isupdate = this.itemsDetailObjpreserve.itemStatus !== itemstatus ? true : false;
    
    this.itemService.updateMerchantitem(this.selectedMerchantId, this.itemsDetailObj.id, data).subscribe((data: any) => {
      if(isupdate){
        this.itemStatusToogleCallback(itemstatus,this.itemsDetailObj.id)
      }
      this.disabled = true
      this.GetItemDetails()
      this.toaster.success("Modifier Updated")
      this.editingOptins = false
    }, (err) => {
      this.editingOptins = false
      this.toaster.error(err.message);
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
      this.selectedItemsIds = this.MerchantaddOnsList.map(cat => cat.id);
    } else {
      // If "Select All" is unchecked, clear the selected category IDs
      this.selectedItemsIds = [];
    }
  }
  areAllCatsSelected(): boolean {
    return this.MerchantaddOnsList.length > 0 && this.selectedItemsIds.length === this.MerchantaddOnsList.length;
  }



  

  RemoveProductImage() {
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove Modifier Image";
    modalDto.Description = " By taking this action, you will remove the image from this modifier."
    modalDto.Text = "Would you like to remove the image from this modifier?";
    modalDto.acceptButtonText = "Yes, Remove Image"
    modalDto.callBack = this.RemoveProductImageCallback;
    this.appUi.openLazyConfrimModalNew(modalDto);
  }

  //remove image
  RemoveProductImageCallback = () => {
    this.itemService.deleteMerchantitemImage(this.selectedMerchantId, this.optionid, this.securityService.securityObject.token).subscribe((data: ItemDetailObject[]) => {
      this.toaster.success("Image removed successfully.")
      this.GetItemDetails()
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }

  //add image for item

  handleFileInputForProduct(event: Event) {
    this.gettingAddOns = true;
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
              modalDto.Title = "Add modifer Image";
              modalDto.Description = " By taking this action, you will add the image for this modifer."
              modalDto.Text = "Would you like to add the image for this modifer";
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
  handleFileInputForProductCallback = ()  => {
    this.gettingAddOns = true;
    this.itemService.updateMerchantitemImage(this.selectedMerchantId, this.optionid, this.fileToUpload, this.securityService.securityObject.token).subscribe((data: ItemDetailObject[]) => {
      this.toaster.success("Image added successfully.")
      this.GetItemDetails()
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }

  isInvalidPrice(itemUnitPrice: any): boolean {
    return isNaN(Number(itemUnitPrice)) || itemUnitPrice === null || itemUnitPrice === '';

  }

//active inactive modiier group
AddonStatusToggle(item: any, event: Event) {
  const originalStatus = item.status;

  const title  = item.status === 1 
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
    this.EditAddOns(item,true);
  };

  modalDto.rejectCallBack = () => {
    (event.target as HTMLInputElement).checked = originalStatus === 1;
  };

  this.appUi.openLazyConfrimModalNew(modalDto);
}

EditAddOns(item, isonlyStatus?: boolean) {


  this.addEditAddOnObj.token = this.securityService.securityObject.token;
  if (this.addEditAddOnObj.addon.status) {
    this.addEditAddOnObj.addon.status = 1
  }
  else {
    this.addEditAddOnObj.addon.status = 0
  }
  this.catProductsService.EditAddOn(this.selectedMerchantId, '', this.addEditAddOnObj).subscribe((data: any[]) => {

    this.toaster.success("Modifier Group status changed.");
 
      
    

  }, (err) => {
 
    this.toaster.error(err.message);
  })
}
}

