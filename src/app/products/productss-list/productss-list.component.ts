import { ClonerService } from './../../core/DataServices/cloner.service';
import { ItemDetailObject, AddonItemDetailDto } from './../../Models/item.model';
import { ItemService } from './../../core/item.service';
import { AppUiService } from './../../core/app-ui.service';
import { MerchantService } from './../../core/merchant.service';
import { AddCategoryDto, CategoryDto, CategoryStatusEnum, ProductListDto, ProductStatusEnum, AddEditAddonDto, AddonDto, AddonStatusEnum, AddonOptionDto, AddonOptionStatusEnum, AddEditProductDto, AddonDtoWithOptions, CategoryWithOptDto } from './../../Models/Cat_Product.model';
import { ProductsCategoriesService } from './../../core/products-categories.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { SecurityService } from 'src/app/core/security.service';
import { ToastrService } from 'ngx-toastr';
import {
  ConnectedPlatformObj,
  MerchantListDto,
  MerchantPlatformsEnum,
  MerchatMenu,
  Platforms,
  virtualMerchants
} from 'src/app/Models/merchant.model';
import { LazyModalDto } from 'src/app/Models/app.model';
import { ItemDto } from 'src/app/Models/item.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppStateService } from 'src/app/core/app-state.service';
// import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';
import { UserRoleEnum } from "../../Models/user.model";
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { TranslocoService } from '@ngneat/transloco';

@UntilDestroy()
@Component({
  selector: 'app-productss-list',
  templateUrl: './productss-list.component.html',
  styleUrls: ['./productss-list.component.scss']
})
export class ProductssListComponent implements OnInit {
  userRoleType: UserRoleEnum;
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
  addingCategories: boolean;
  editCategoryObj = new CategoryDto();
  addingProducts: boolean;
  editProductObj = new ItemDto();
  addProductObj = new AddEditProductDto();
  addEditAddOnObj = new AddEditAddonDto();
  selectedProduct = new ItemDto();
  gettingAddOns: boolean;
  addOnsList: AddonDto[] = [];
  addingAddons: boolean;
  deletingCategories: boolean;
  deletingAddOn: boolean;
  MerchantaddOnsList: AddonDtoWithOptions[] = [];
  selectedAddonWithOption = new AddonDtoWithOptions();
  gettingMerchantAddOns: boolean;
  gettingAddOnOptions: boolean;
  AddOnOptionsList: AddonOptionDto[] = [];
  AddOnOptionsListInline: AddonOptionDto[] = [];
  SavingOptionData: boolean;
  selectedViewType: number = 1;
  itemsDetailObj = new ItemDetailObject();
  fileToUpload: File | null = null;
  AddonPreserve: AddonDtoWithOptions[] = [];
  savingAssignModifier: boolean;
  categoriesPreserve: CategoryDto[] = [];
  savingAssignCategories: boolean;
  productsListPreserve: ItemDto[] = [];
  //if any platform price value is b/w [0, 99999]
  validPlatformPrice: boolean = true;
  //assigningOptionsToAddon: boolean;
  unAssigningCat: boolean;
  searchCatRef = '';
  searchCatRefModal = '';
  searchProdRef = '';
  searchAddonRef = '';
  searchAddonRefModal = '';
  searchItemtoAssignoptionRef = '';
  assignOptionOritemsModalSwitch = 'option';
  UpdatingitemsForCategories: boolean;
  gettingPdf: boolean
  gettingCsv: boolean

  productListByAddon: any[] = []
  // values for menu start
  gettingMenu: boolean = true;
  allMenusList: MerchatMenu[] = [];
  menuObject: MerchatMenu;
  searchMenuRef = '';
  selectedMenu = new MerchatMenu();
  virtualMerchants: virtualMerchants[] = [];
  MerchantPlatformsEnum = MerchantPlatformsEnum;
  savingAssignCategoriesToMenu: boolean = false;
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
  //PlatformsList = []
  selectedPlatformWhileAdding = 0;
  selectedVirtualMerchantWhileAdding = '';
  ConnectedPlatforms: ConnectedPlatformObj[] = [];
  savingAssignPlatformsToMenu = false;
  addMenuObj = new MerchatMenu();
  addingMenu: boolean = false
  /////////////
  platformBasedPricing: boolean = false;
  PlatformsPricingList = []
  productTypeList = [
    { "id": 1, "type": "Item" },
    { "id": 2, "type": "Add On Option" }
  ]
  // values for menu end

  constructor(private toaster: ToastrService, private translocoService: TranslocoService, private securityService: SecurityService, private router: Router, private itemService: ItemService,
    private merchantService: MerchantService, private catProductsService: ProductsCategoriesService, private appUi: AppUiService,
    private cloner: ClonerService, private appState: AppStateService) { }

  ngOnInit(): void {
    this.subscribeAppState();
    // this.GetConnectedPlatforms()
    this.getAllMenus();
    this.GetMerchantsList();
    this.getAllVirtualRestaurants();
    this.userRoleType = this.securityService.securityObject.user.role;
    this.getAllVirtualRestaurants();

  }

  clearSearchFields() {
    this.searchMenuRef = ''
    this.searchCatRef = ''
    this.searchProdRef = ''
    this.searchAddonRef = ''
  }
  getAllMenus() {
    this.gettingMenu = true;
    this.merchantService.GetMerchantsMenus(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: any) => {
      this.allMenusList = data.data
      this.selectedMenu = new MerchatMenu();
      if (this.allMenusList && this.allMenusList.length) {

        Object.assign(this.selectedMenu, this.allMenusList[0]);
      }

      this.gettingMenu = false
    }, (err) => {
      this.gettingMerchants = false;
      this.toaster.error(err.message);
    })
  }
  getAllVirtualRestaurants() {
    this.gettingMenu = true;
    this.merchantService.GetVirtualRestaurants(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: any) => {
      this.virtualMerchants = data.data;

      this.gettingMenu = false
    }, (err) => {
      this.gettingMerchants = false;
      this.toaster.error(err.message);
    })
  }
  MenuChanged(item: MerchatMenu) {
    this.selectedMenu = item;

  }
  checkUbereatsConnected() {
    if (this.selectedMenu.menuPlatforms.length > 0) {
      let check = this.selectedMenu.menuPlatforms.filter(x => x.platformType == '3' || x.platformType == '7')
      if (check.length > 0) {
        return true
      }
    }

    return false
  }
  
  UpdateMenuCategories(modal?: ModalDirective, val?: any) {
    if (this.selectedViewType == 1) {
      this.savingAssignCategoriesToMenu = true;
      let data = {
        "categoryId": val.id,
        "delete": val.selected ? 0 : 1
      }
      this.merchantService.updateMenuCategories(this.selectedMerchantId, this.selectedMenu.id, data).subscribe((data: any) => {
        this.savingAssignCategoriesToMenu = false;
        this.toaster.success("Categories updated")
      }, (err) => {
        this.savingAssignCategories = false;
        this.toaster.error(err.error.message);
      })
    }
  }
  onCloseModalMenuCategories() {
    this.GetSelectedMenuDetail();
    this.GetCategoriesList();
  }
  GetSelectedMenuDetail() {
    this.merchantService.GetMerchantsMenuById(this.securityService.securityObject.token, this.selectedMerchantId, this.selectedMenu.id).subscribe((data: any) => {
      this.selectedMenu = data.data
      let objIndex = this.allMenusList.findIndex((obj => obj.id == data.data.id));
      this.allMenusList[objIndex] = data.data
    }, (err) => {
      this.gettingMerchants = false;
      this.toaster.error(err.error.message);
    })
  }

  OpenConfirmUnAssignCategoryToMenu(cat: CategoryDto, itemId: string) {
    let nObj = {};
    Object.assign(nObj, cat);
    nObj['itemId'] = itemId;
    const modalDto = new LazyModalDto();
    modalDto.Title = "Un Assign Category to Menu";
    modalDto.Text = "Are you sure that you want to un assign Category to Menu.";
    modalDto.callBack = this.UnAssignMenuCatCallback;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  UnAssignMenuCatCallback = (data: any) => {
    let data1 = {
      "categoryId": data.id,
      "delete": 1
    }
    this.merchantService.updateMenuCategories(this.selectedMerchantId, this.selectedMenu.id, data1).subscribe((datahh: any) => {
      this.GetSelectedMenuDetail();
      this.GetCategoriesList();
      this.toaster.success("Categories updated")
    }, (err) => {
      this.savingAssignCategories = false;
      this.toaster.error(err.error.message);
    })


  };
  ConfirmMenuDelete(menuItem: MerchatMenu) {

    const modalDto = new LazyModalDto();
    var translate_item = 'Menu'
    var translationKey = 'Menus.Delete item'
    this.translocoService.selectTranslate(translationKey, { translate_item })
      .subscribe(translation => {
        modalDto.Title = translation;
      });
    translationKey = 'Menus.Are you sure to delete item.'
    this.translocoService.selectTranslate(translationKey, { translate_item })
      .subscribe(translation => {
        modalDto.Text = translation;
      });
    modalDto.callBack = this.ConfirmMenuDeleteCallback;
    modalDto.data = menuItem;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  ConfirmMenuDeleteCallback = (data: any) => {
    this.merchantService.deleteMerchantMenu(this.securityService.securityObject.token, this.selectedMerchantId, data.id).subscribe((data: any) => {
      this.getAllMenus();
    }, (err) => {
      this.toaster.error(err.error.message);
    })

  };
  blob: any = null
  DownloadPdf() {
    this.gettingPdf = true
    this.merchantService.GetPdfDetial(this.selectedMenu.id).subscribe(
      (data: any) => {


        this.blob = new Blob([data], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = this.selectedMenu.id;
        link.click();
        this.gettingPdf = false
      }, (err) => {
        this.toaster.error(err.error.message);
        this.gettingPdf = false
      }
    )
  }
  DownloadCsv() {
    this.gettingCsv = true;
    this.merchantService.GetCsvDetails(this.selectedMerchantId, this.selectedMenu.id).subscribe(
      (data: any) => {

        Object.assign(document.createElement('a'), {
          // target:'_blank',
          href: data.data.download_url,
        }).click();
        this.gettingCsv = false;
      }, (err) => {
        this.gettingCsv = false;
        this.toaster.error(err.error.message);
      }
    )
  }
  OpenConfirmUnAssignPlatformFromMenu(platform: Platforms, PlatformType: string) {
    let nObj = {};
    Object.assign(nObj, platform);
    nObj['PlatformType'] = PlatformType;
    const modalDto = new LazyModalDto();
    modalDto.Title = "Un Assign Platform to Menu";
    modalDto.Text = "Are you sure that you want to un assign Platform to Menu.";
    modalDto.callBack = this.UnAssignMenuPlatformCallback;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  UnAssignMenuPlatformCallback = (data: any) => {
    this.merchantService.removeMerchantMenuPlatform(data.id, this.selectedMerchantId, this.selectedMenu.id).subscribe((data: any) => {
      this.GetSelectedMenuDetail();
    }, (err) => {
      this.toaster.error(err.error.message);
    })

  };
  OpenConfirmUnAssignVirtualMenu(id: string) {
    let nObj = {};
    nObj['id'] = id;
    const modalDto = new LazyModalDto();
    modalDto.Title = "Un Assign Virtual Merchant";
    modalDto.Text = "Are you sure that you want to un assign virtual merchant.";
    modalDto.callBack = this.UnAssignVirtualMerchantCallback;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  UnAssignVirtualMerchantCallback = (data: any) => {

    this.merchantService.updateMerchantVirtualMenu(this.securityService.securityObject.token, data.id, this.selectedMerchantId, this.selectedMenu.id, { 'delete': 1 }).subscribe((data: any) => {
      this.GetSelectedMenuDetail();
      this.savingAssignPlatformsToMenu = false;
    }, (err) => {
      this.savingAssignPlatformsToMenu = false;
      this.toaster.error(err.error.message);
    })

  };
  fillPlatformSelection() {

    this.selectedPlatformWhileAdding = 0;
    this.selectedVirtualMerchantWhileAdding = '';

  }

  UpdateMenuPlatforms(modal: ModalDirective) {
    this.savingAssignPlatformsToMenu = true;

    this.merchantService.updateMerchantMenuPlatfromMapping(this.securityService.securityObject.token, { 'platformType': this.selectedPlatformWhileAdding }, this.selectedMerchantId, this.selectedMenu.id).subscribe((data: any) => {
      modal.hide();
      this.GetSelectedMenuDetail();
      this.savingAssignPlatformsToMenu = false;
    }, (err) => {
      this.savingAssignPlatformsToMenu = false;
      this.toaster.error(err.error.message);
    })
  }

  UpdateVrtualResMenu(modal: ModalDirective) {
    // this.savingAssignPlatformsToMenu = true;

    this.merchantService.updateMerchantVirtualMenu(this.securityService.securityObject.token, this.selectedVirtualMerchantWhileAdding, this.selectedMerchantId, this.selectedMenu.id, { 'delete': 0 }).subscribe((data: any) => {
      modal.hide();
      this.getAllVirtualRestaurants();
      this.GetSelectedMenuDetail();
      // this.savingAssignPlatformsToMenu = false;
    }, (err) => {
      this.savingAssignPlatformsToMenu = false;
      this.toaster.error(err.error.message);
    })
  }

  resetMenuObj() {
    this.addMenuObj = new MerchatMenu();
  }
  EditMenu(menuItem: MerchatMenu, modal: ModalDirective) {
    this.addMenuObj = menuItem
    this.selectedMenu = menuItem
    modal.show()

  }
  AddMenuForMerchant(modal: ModalDirective) {
    this.addingMenu = true;
    if (this.addMenuObj.id && this.addMenuObj.id.length) {
      const idsList = this.addMenuObj.menuPlatforms.map(y => y.platformType);
      let nObj: any = this.addMenuObj
      nObj.menuPlatforms = idsList
      this.merchantService.updateMerchantMenu(this.securityService.securityObject.token, nObj, this.selectedMerchantId, this.addMenuObj.id).subscribe((data: any) => {
        modal.hide();
        this.addingMenu = false;

      }, (err) => {
        this.toaster.error(err.error.message);
      })
    }
    else {
      this.merchantService.CreateMerchantMenu(this.securityService.securityObject.token, this.addMenuObj, this.selectedMerchantId).subscribe((data: ItemDto) => {
        modal.hide();
        this.getAllMenus();
        this.addingMenu = false;
      }, (err) => {
        this.addingMenu = false;
        this.toaster.error(err.error.message);
      })
    }

  }

  ///////////////////////////////


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
              this.addingProducts = true;

              this.itemService.updateMerchantitemImage(this.selectedMerchantId, this.selectedProduct.id, this.fileToUpload, this.securityService.securityObject.token).subscribe((data: ProductListDto[]) => {
                this.toaster.success("image added successfully.")
                this.GetItemDetails()
                this.addingProducts = false;
              }, (err) => {
                this.addingProducts = false;
                this.toaster.error(err.error.message);
              })
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


  RemoveProductImage() {
    this.itemService.deleteMerchantitemImage(this.selectedMerchantId, this.selectedProduct.id, this.securityService.securityObject.token).subscribe((data: ProductListDto[]) => {
      this.selectedProduct.imageUrl = null;
      this.toaster.success("image removed successfully.")
      this.GetItemDetails()
    }, (err) => {
      this.addingProducts = false;
      this.toaster.error(err.error.message);
    })
  }
  // fillPlatformPricingCheckboxes() {
  //   if (this.platformBasedPricing) {
  //     this.PlatformsPricingList = this.cloner.deepClone(this.PlatformsListOriginal.filter(x => x.type == "platform"));
  //     this.PlatformsPricingList.map((x) => {
  //       x.platformItemPrice = this.selectedProduct.itemUnitPrice
  //     })

  //   } else {
  //     this.PlatformsPricingList = []
  //   }

  // }

  fillPlatformPricingCheckboxes() {
    if (this.platformBasedPricing) {
      this.PlatformsPricingList = this.cloner.deepClone(this.PlatformsListOriginal.filter(x => x.type == "platform"));
      this.PlatformsPricingList.map((x) => {
        if (this.editProductObj.itemUnitPrice != null && this.editProductObj.itemUnitPrice != undefined && this.editProductObj.itemUnitPrice > 0) {
          x.platformItemPrice = this.editProductObj.itemUnitPrice;
        } else {
          x.platformItemPrice = 0;
        }
      });
    } else {
      this.PlatformsPricingList = [];
    }
  }


  validPlatformPriceFunc(value: boolean) {
    this.validPlatformPrice = value;
  }


  ////////////////////////
  subscribeAppState() {
    this.selectedMerchantId = this.appState.currentMerchant;

    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.selectedMerchantId = merchntId;

      this.MerchantChanged();
      this.GetCategoriesList(true);
      this.GetProductsList();
      this.GetAddOnsByMerchantId()
      this.getAllMenus()
    })
  }

  GetMerchantsList() {
    this.gettingMerchants = true;
    this.merchantService.GetMerchants(this.securityService.securityObject.token).subscribe((data: MerchantListDto[]) => {
      this.MerchantsList = data;
      if (this.MerchantsList && this.MerchantsList.length) {
        this.GetCategoriesList(true);
        this.GetProductsList();
        this.GetAddOnsByMerchantId();
      }
      this.gettingMerchants = false;
    }, (err) => {
      this.gettingMerchants = false;
      this.toaster.error(err.message);
    })
  }
  GetCategoriesList(loadProducts?: boolean) {
    this.gettingCategories = true;
    this.CategoriesList = [];
    this.catProductsService.GetCategoriesWithItems(this.selectedMerchantId, this.securityService.securityObject.token).subscribe((data: CategoryWithOptDto[]) => {
      this.CategoriesList = data;
      if (data) {
        this.categoriesPreserve = this.cloner.deepClone(data);
      }

      this.gettingCategories = false;
    }, (err) => {
      this.gettingCategories = false;
      this.toaster.error(err.message);
    })
  }
  MerchantChanged() {
    this.selectedProduct = new ItemDto();
  }
  GetProductsList(id?: string) {
    this.gettingProducts = true;
    this.ProductsList = [];
    this.addOnsList = [];
    this.itemService.getMerchantitems(this.selectedMerchantId, this.securityService.securityObject.token).subscribe((data: ItemDto[]) => {
      this.ProductsList = data;
      if (data) {
        this.productsListPreserve = this.cloner.deepClone(data);
      }
      if (this.ProductsList && this.ProductsList.length) {
        this.selectedProduct = new ItemDto();
        if (id == undefined) {
          Object.assign(this.selectedProduct, this.ProductsList[0]);
        } else {
          Object.assign(this.selectedProduct, this.ProductsList.filter(x => x.id == id)[0]);
        }

        this.GetItemDetails();
      } else {
        this.gettingProducts = false;
      }
      this.gettingProducts = false;
    }, (err) => {
      this.gettingProducts = false;
      this.toaster.error(err.message);
    })
  }
  GetItemDetails() {
    this.gettingAddOns = true;
    this.addOnsList = [];
    this.itemService.getMerchantitem(this.selectedMerchantId, this.selectedProduct.id).subscribe((data: ItemDetailObject) => {
      this.itemsDetailObj = data;

      this.gettingAddOns = false;
    }, (err) => {
      this.gettingAddOns = false;
      this.toaster.error(err.message);
    })
  }
  GetAddOnsByMerchantId() {
    this.gettingMerchantAddOns = true;
    this.MerchantaddOnsList = [];
    this.catProductsService.GetAddOnsWIthOptionsByMerchantId(this.selectedMerchantId, this.securityService.securityObject.token).subscribe((data: AddonDtoWithOptions[]) => {
      this.MerchantaddOnsList = data;
      if (data) {
        data.forEach(x => {
          const sds = x.addonOptions.map(x => x.addonOptionName).join(' ,');
          x['concatOptionsStr'] = sds;
        })
        this.AddonPreserve = this.cloner.deepClone(data);
      }
      this.gettingMerchantAddOns = false;
    }, (err) => {
      this.gettingMerchantAddOns = false;
      this.toaster.error(err.message);
    })
  }
  SaveOptionData(addOnOption: AddonOptionDto) {
    this.SavingOptionData = true;
    addOnOption.addonOptionStatus = AddonOptionStatusEnum.Active;
    this.catProductsService.AddEditOptionForAddOn(this.selectedMerchantId, this.selectedProduct.id, this.addEditAddOnObj.addon.id, addOnOption).subscribe((data: AddonOptionDto) => {
      addOnOption.id = data.id;
      this.SavingOptionData = false;
    }, (err) => {
      this.SavingOptionData = false;
      this.toaster.error(err.message);
    })
  }

  AddNewEmptyOption() {
    this.AddOnOptionsList.push(new AddonOptionDto());
  }
  AddCategoryForMerchant(modal: ModalDirective) {
    this.addingCategories = true;
    this.addCategoryObj.token = this.securityService.securityObject.token;
    this.addCategoryObj.category.categoryStatus = CategoryStatusEnum.Active;
    this.addCategoryObj.category.categoryName = this.editCategoryObj.categoryName;
    this.addCategoryObj.category.posName = this.editCategoryObj.posName;
    this.addCategoryObj.category.categoryDescription = this.editCategoryObj.categoryDescription;
    this.catProductsService.AddCategoryForMerchant(this.selectedMerchantId, this.addCategoryObj).subscribe((data: ProductListDto[]) => {
      modal.hide();
      this.GetCategoriesList();
      this.addingCategories = false;
    }, (err) => {
      this.addingCategories = false;
      this.toaster.error(err.message);
    })
  }
  EditCategoryForMerchant(modal: ModalDirective) {
    this.addingCategories = true;
    this.addCategoryObj.token = this.securityService.securityObject.token;
    this.addCategoryObj.category.categoryStatus = this.editCategoryObj.categoryStatus;
    this.addCategoryObj.category.categoryName = this.editCategoryObj.categoryName;
    this.addCategoryObj.category.posName = this.editCategoryObj.posName;
    this.addCategoryObj.category.categoryDescription = this.editCategoryObj.categoryDescription;
    this.addCategoryObj.category.id = this.editCategoryObj.id;
    this.catProductsService.EditCategoryForMerchant(this.selectedMerchantId, this.addCategoryObj).subscribe((data: ProductListDto[]) => {
      modal.hide();
      this.GetCategoriesList();
      this.addingCategories = false;
    }, (err) => {
      this.addingCategories = false;
      this.toaster.error(err.message);
    })
  }

  EditCategory(item: CategoryDto, modal: ModalDirective) {
    Object.assign(this.editCategoryObj, item);
    modal.show();
  }
  CategoryChanged(item: CategoryDto) {
    this.selectedCategoryId = item.id;
  }
  fillCategorySelection() {
    this.searchCatRefModal = ""
    this.CategoriesList = this.cloner.deepClone(this.categoriesPreserve);
    if (this.selectedViewType === 1) {
      if (this.selectedMenu.categories) {
        this.CategoriesList = this.CategoriesList.map(x => ({ ...x, selected: false }))
        this.selectedMenu.categories.forEach(element => {
          const find = this.CategoriesList.find(x => x.id === element.id);
          find.selected = true;
        })
      }
    } else {
      if (this.itemsDetailObj.categories) {
        this.itemsDetailObj.categories.forEach(element => {
          const find = this.CategoriesList.find(x => x.id === element.id);
          find['selected'] = true;
        });
      }
    }

  }
  fillOptionsOrItemsSelected() {
    this.ProductsList = this.cloner.deepClone(this.productsListPreserve);

    //this.ProductsList = this.ProductsList.filter(x => x.itemStatus === 1)


    if (this.assignOptionOritemsModalSwitch === 'option') {
      if (this.selectedAddonWithOption.addonOptions) {
        this.selectedAddonWithOption.addonOptions.forEach(element => {
          const find = this.ProductsList.find(x => x.id === element.id);
          find['selected'] = true;
        });
      }
    }
    if (this.assignOptionOritemsModalSwitch === 'item') {
      const category = this.CategoriesList.find(x => x.id === this.selectedCategoryId);
      if (category && category.items && category.items.length) {
        category.items.forEach(element => {
          const find = this.ProductsList.find(x => x.id === element.id);
          find['selected'] = true;
        });
      }
    }
  }
  fillModifierSelection() {
    this.searchAddonRefModal = "";
    this.MerchantaddOnsList = this.cloner.deepClone(this.AddonPreserve);
    if (this.itemsDetailObj.addons) {
      this.itemsDetailObj.addons.forEach(element => {
        const find = this.MerchantaddOnsList.find(x => x.id === element.id);
        find['selected'] = true;
      });
    }
  }
  UpdateItemAddons(val) {
    this.savingAssignModifier = true;
    let data = {
      "addonId": val.id,
      "delete": val.selected ? 0 : 1
    }
    this.itemService.updateItemIddons(this.selectedMerchantId, this.selectedProduct.id, data).subscribe((data: any) => {
      this.savingAssignModifier = false;
    }, (err) => {
      this.savingAssignModifier = false;
      this.toaster.error(err.error.message);
    })
  }
  closeItemAdonModal() {
    this.GetItemDetails();

  }

  closeCategorytoItemAndAddonModal() {
    if (this.selectedViewType === 4) {
      this.GetCategoriesList();
    }
    else {
      this.GetAddOnsByMerchantId();
    }
  }
  UpdateitemsForCategoriesAndAddonOptions(modal: ModalDirective, val: any) {
    this.UpdatingitemsForCategories = true;
    let data = {
      "itemId": val.id,
      "delete": val.selected ? 0 : 1
    }
    if (this.selectedViewType === 4) {
      this.itemService.UpdateCategoryItems(this.selectedMerchantId, this.selectedCategoryId, data).subscribe((data: any) => {
        this.UpdatingitemsForCategories = false;
      }, (err) => {
        this.UpdatingitemsForCategories = false;
        this.toaster.error(err.error.message);
      })
    } else {
      this.itemService.updateItemAddonOptions(this.selectedMerchantId, this.selectedAddonWithOption.id, data).subscribe((data: any) => {
        this.UpdatingitemsForCategories = false;
      }, (err) => {
        this.UpdatingitemsForCategories = false;
        this.toaster.error(err.error.message);
      })

    }
  }

  AddProductForMerchant(modal: ModalDirective) {
    this.addingProducts = true;
    this.addProductObj.token = this.securityService.securityObject.token;
    this.addProductObj.item.itemStatus = this.editProductObj.itemStatus;
    this.addProductObj.item.itemName = this.editProductObj.itemName;
    this.addProductObj.item.itemUnitPrice = this.editProductObj.itemUnitPrice;
    this.addProductObj.item.itemSKU = this.editProductObj.itemSKU;
    this.addProductObj.item.itemDescription = this.editProductObj.itemDescription;
    this.addProductObj.item.itemPriceMappings = this.PlatformsPricingList
    this.addProductObj.item.itemType = this.editProductObj.itemType;
    this.addProductObj.item.shortName = this.editProductObj.shortName;
    this.addProductObj.item.posName = this.editProductObj.posName;

    this.itemService.createMerchantItem(this.selectedMerchantId, this.addProductObj).subscribe((data: ItemDto) => {
      modal.hide();
      this.GetProductsList(data.id);
      this.addingProducts = false;
    }, (err) => {
      this.addingProducts = false;
      this.toaster.error(err.message);
    })
  }
  EditProductForMerchant(modal: ModalDirective) {
    this.addingProducts = true;
    this.addProductObj.token = this.securityService.securityObject.token;
    this.addProductObj.item.itemStatus = this.editProductObj.itemStatus;
    this.addProductObj.item.itemName = this.editProductObj.itemName;
    this.addProductObj.item.itemUnitPrice = this.editProductObj.itemUnitPrice;
    this.addProductObj.item.itemSKU = this.editProductObj.itemSKU;
    this.addProductObj.item.itemDescription = this.editProductObj.itemDescription;
    this.addProductObj.item.itemType = this.editProductObj.itemType;
    this.addProductObj.item.shortName = this.editProductObj.shortName;
    this.addProductObj.item.posName = this.editProductObj.posName;
    this.addProductObj.item.itemPriceMappings = this.PlatformsPricingList

    this.addProductObj.item.id = this.editProductObj.id;
    this.itemService.updateMerchantitem(this.selectedMerchantId, this.addProductObj.item.id, this.addProductObj).subscribe((data: any) => {
      modal.hide();
      this.GetProductsList(data.id);
      this.addingProducts = false;
    }, (err) => {
      this.addingProducts = false;
      this.toaster.error(err.message);
    })
  }
  resetProductObj() {
    this.editProductObj = new ItemDto();
    this.addProductObj = new AddEditProductDto();
    this.platformBasedPricing = false;
    this.PlatformsPricingList = this.cloner.deepClone(this.PlatformsListOriginal.filter(x => x.type == "platform"));

  }
  resetAddOnObj() {
    this.addEditAddOnObj = new AddEditAddonDto();
  }
  EditProduct(item: ItemDto, modal: ModalDirective) {

    Object.assign(this.editProductObj, item);
    if (item.itemPriceMappings.length > 0) {
      this.platformBasedPricing = true;
      this.PlatformsPricingList = item.itemPriceMappings
    }
    modal.show();
  }
  // EditAddOn(item: AddonDtoWithOptions, modal: ModalDirective, idx: number) {
  //   const nObj = this.cloner.deepClone<AddonDtoWithOptions>(item);
  //   delete nObj.addonOptions;
  //   Object.assign(this.addEditAddOnObj.addon, nObj);

  //   this.productListByAddon = this.ProductsList.filter(({ addONCount }) => addONCount === idx)

  //   modal.show();
  // }
  EditAddOn(item: AddonDtoWithOptions, modal: ModalDirective, idx?: number) {
    const nObj = this.cloner.deepClone<AddonDtoWithOptions>(item);
    delete nObj.addonOptions;
    Object.assign(this.addEditAddOnObj.addon, nObj);


    this.catProductsService.usedAddonItems(this.selectedMerchantId, item.id).subscribe((data: any) => {

      this.productListByAddon = data

      modal.show();

    }, (err) => { })

  }
  ProductChanged(item: ItemDto) {
    this.selectedProduct = item;
    this.GetItemDetails();
  }

  ProductChangedSearch(itemid) {
    this.selectedProduct = this.ProductsList.filter(x => x.id == itemid.id)[0];
    this.GetItemDetails();
  }

  PostAddOnsForProduct(modal: ModalDirective) {
    this.addingAddons = true;
    this.addEditAddOnObj.token = this.securityService.securityObject.token;
    this.catProductsService.PostAddOnsForProduct(this.selectedMerchantId, this.selectedProduct.id, this.addEditAddOnObj).subscribe((data: any[]) => {
      modal.hide();
      this.GetItemDetails();
      this.GetAddOnsByMerchantId();
      this.addingAddons = false;
    }, (err) => {
      this.addingAddons = false;
      this.toaster.error(err.message);
    })
  }
  EditAddOnsForProduct(modal: ModalDirective) {
    this.addingAddons = true;
    this.addEditAddOnObj.token = this.securityService.securityObject.token;
    delete this.addEditAddOnObj.addon['addonoptionname']
    this.catProductsService.EditAddOn(this.selectedMerchantId, this.selectedProduct.id, this.addEditAddOnObj).subscribe((data: any[]) => {
      modal.hide();
      this.GetItemDetails();
      this.GetAddOnsByMerchantId();
      this.addingAddons = false;
    }, (err) => {
      this.addingAddons = false;
      this.toaster.error(err.message);
    })
  }

  OpenConfirmUnAssignItemFromAddon(cat: AddonOptionDto, addonId: string) { //triggered from modifers page
    let nObj = {};
    Object.assign(nObj, cat);
    nObj['addonId'] = addonId;
    const modalDto = new LazyModalDto();
    modalDto.Title = "Un Assign Addon Option";
    modalDto.Text = "Are you sure that you want to un assign addon option.";
    modalDto.callBack = this.UnAssignItemFromAddonCallback;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  UnAssignItemFromAddonCallback = (data1: any) => {
    // this.deleteDefaultCPTCharge(data);
    //this.fillOptionsOrItemsSelected()
    this.unAssigningCat = true;
    let data = {
      "itemId": data1.id,
      "delete": 1
    }
    this.itemService.updateItemAddonOptions(this.selectedMerchantId, data1.addonId, data).subscribe((data: any) => {
      this.unAssigningCat = false;
      this.GetAddOnsByMerchantId();
      this.toaster.success("Addon option updated successfully")
    }, (err) => {
      this.unAssigningCat = false;
      this.toaster.error(err.error.message);
    })

  };
  OpenConfirmUnAssignAddonFromItem(cat: AddonItemDetailDto, itemId: string) {//triggered from item page
    let nObj = {};
    Object.assign(nObj, cat);
    nObj['itemId'] = itemId;
    const modalDto = new LazyModalDto();
    modalDto.Title = "Un Assign Addon";
    modalDto.Text = "Are you sure that you want to un assign Addon.";
    modalDto.callBack = this.UnAssignAddonFromItemCallback;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  UnAssignAddonFromItemCallback = (data1: any) => {
    this.savingAssignModifier = true;
    //const idsList = this.MerchantaddOnsList.filter(x => (x['selected'] && x['selected'] === true)).map(y => y.id);
    let data = {
      "addonId": data1.id,
      "delete": 1
    }
    this.itemService.updateItemIddons(this.selectedMerchantId, this.selectedProduct.id, data).subscribe((data: any) => {
      // modal.hide();
      this.GetItemDetails()
      this.savingAssignModifier = false;
    }, (err) => {
      this.savingAssignModifier = false;
      this.toaster.error(err.error.message);
    })
  };
  ConfirmCategoryDelete(item: CategoryDto) {
    const modalDto = new LazyModalDto();

    var translate_item = 'Category'
    var translationKey = 'Menus.Delete item'
    this.translocoService.selectTranslate(translationKey, { translate_item })
      .subscribe(translation => {
        modalDto.Title = translation;
      });
    translationKey = 'Menus.Are you sure to delete item.'
    this.translocoService.selectTranslate(translationKey, { translate_item })
      .subscribe(translation => {
        modalDto.Text = translation;
      });
    modalDto.callBack = this.DeleteCatCallBack;
    modalDto.data = item;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  DeleteCatCallBack = (data: any) => {
    this.deletingCategories = true;
    this.catProductsService.DeleteCategory(this.selectedMerchantId, data.id, this.securityService.securityObject.token).subscribe((data: any) => {
      this.toaster.success('Record deleted successfully');
      this.GetCategoriesList();
      this.deletingCategories = false;
    }, (err) => {
      this.deletingCategories = false;
      this.toaster.error(err.message);
    })
  };
  ConfirmProductDelete(item: ItemDto) {
    const modalDto = new LazyModalDto();
    var translate_item = 'Product'
    var translationKey = 'Menus.Delete item'
    this.translocoService.selectTranslate(translationKey, { translate_item })
      .subscribe(translation => {
        modalDto.Title = translation;
      });
    translationKey = 'Menus.Are you sure to delete item.'
    this.translocoService.selectTranslate(translationKey, { translate_item })
      .subscribe(translation => {
        modalDto.Text = translation;
      });
    modalDto.callBack = this.DeleteProductCallBack;
    modalDto.data = item;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  DeleteProductCallBack = (data: any) => {
    this.deletingCategories = true;
    this.itemService.deleteMerchantitem(this.selectedMerchantId, data.id).subscribe((data: any) => {
      this.toaster.success('Record deleted successfully');
      this.GetProductsList();
      this.deletingCategories = false;
    }, (err) => {
      this.deletingCategories = false;
      this.toaster.error(err.message);
    })
  };
  ConfirmAddOnDelete(item: AddonDtoWithOptions) {
    const modalDto = new LazyModalDto();
    var translate_item = 'Add on'
    var translationKey = 'Menus.Delete item'
    this.translocoService.selectTranslate(translationKey, { translate_item })
      .subscribe(translation => {
        modalDto.Title = translation;
      });
    translationKey = 'Menus.Are you sure to delete item.'
    this.translocoService.selectTranslate(translationKey, { translate_item })
      .subscribe(translation => {
        modalDto.Text = translation;
      });
    modalDto.callBack = this.DeleteAddOnCallBack;
    const nObj = this.cloner.deepClone<AddonDtoWithOptions>(item);
    delete nObj.addonOptions;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  DeleteAddOnCallBack = (data: any) => {
    this.deletingAddOn = true;
    this.catProductsService.DeleteAddOn(this.selectedMerchantId, this.selectedProduct.id, data.id, this.securityService.securityObject.token).subscribe((data: any) => {
      this.toaster.success('Record deleted successfully');
      this.GetItemDetails();
      this.GetAddOnsByMerchantId();
      this.deletingAddOn = false;
    }, (err) => {
      this.deletingAddOn = false;
      this.toaster.error(err.message);
    })
  };
  categoryStatusToogle() {
    if (this.editCategoryObj.categoryStatus == 0) {
      this.catModalItemList.map(x => x.itemStatus = 0)
    } else {
      this.catModalItemList.map(x => x.itemStatus = 1)
    }
    this.catProductsService.DisableEnableCategory(this.selectedMerchantId, this.editCategoryObj.id, {
      "categoryStatus": this.editCategoryObj.categoryStatus
    }).subscribe((data: any) => {
      this.toaster.success('Category edit successfully');
      this.CategoriesList.filter(x => x.id == this.editCategoryObj.id)[0].categoryStatus = this.editCategoryObj.categoryStatus
      this.categoriesPreserve.filter(x => x.id == this.editCategoryObj.id)[0].categoryStatus = this.editCategoryObj.categoryStatus
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
  catModalItemList: ItemDto[] = [];
  openCategoryModal() {
    this.catModalItemList = this.CategoriesList.filter(x => x.id == this.editCategoryObj.id)[0].items
  }
  changeItemStatus(item) {
    if (item.itemStatus == true) {
      this.editCategoryObj.categoryStatus = 1
      this.CategoriesList.filter(x => x.id == this.editCategoryObj.id)[0].categoryStatus = this.editCategoryObj.categoryStatus
      this.categoriesPreserve.filter(x => x.id == this.editCategoryObj.id)[0].categoryStatus = this.editCategoryObj.categoryStatus
    }
    this.catProductsService.DisableEnableItem(this.selectedMerchantId, item.id, {
      "itemStatus": item.itemStatus
    }).subscribe((data: any) => {
      this.toaster.success('Item status changed');

      this.ProductsList.filter(x => x.id == item.id)[0].itemStatus = +item.itemStatus

    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
  resetObj() {
    this.editCategoryObj = new CategoryDto();
    this.addCategoryObj = new AddCategoryDto();
    //this.GetProductsList();
  }

  @ViewChild('createOurPoints') createOurPoints: ModalDirective;
  @ViewChild('createItemsDetails') createItemsDetails: ModalDirective;


  openModalforCreatePoints() {
    this.createOurPoints.show()
  }
  openModalforItemsDetail() {
    this.createItemsDetails.show()
  }

  closeModal() {
    this.createOurPoints.hide();
  }
  closeItemModal() {
    this.createItemsDetails.hide();
  }
}
