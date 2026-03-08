import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ClonerService } from './../../core/DataServices/cloner.service';
import { ItemDetailObject, AddonItemDetailDto } from './../../Models/item.model';
import { ItemService } from './../../core/item.service';
import { AppUiService } from './../../core/app-ui.service';
import { MerchantService } from './../../core/merchant.service';
import { AddCategoryDto, CategoryDto, CategoryStatusEnum, ProductListDto, ProductStatusEnum, AddEditAddonDto, AddonDto, AddonStatusEnum, AddonOptionDto, AddonOptionStatusEnum, AddEditProductDto, AddonDtoWithOptions, CategoryWithOptDto } from './../../Models/Cat_Product.model';
import { ProductsCategoriesService } from './../../core/products-categories.service';
import { SecurityService } from 'src/app/core/security.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ConnectedPlatformObj,
  MerchantListDto,
  MerchantPlatformsEnum,
  MerchatMenu,
  Platforms,
  virtualMerchants
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
import { environment } from 'src/environments/environment';





@UntilDestroy()
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})


export class CategoriesComponent {
  @ViewChild('createMenuModal') createMenuModal: ModalDirective;
  @ViewChild('suggestCategoryModal') suggestCategoryModal: ModalDirective;
  constructor(private toaster: ToastrService, private translocoService: TranslocoService, private securityService: SecurityService, private router: Router, private itemService: ItemService,
    private merchantService: MerchantService, private catProductsService: ProductsCategoriesService, private appUi: AppUiService,
    private cloner: ClonerService, private appState: AppStateService, private route: ActivatedRoute) { }

  CategoriesList: CategoryWithOptDto[];
  gettingCategories = true;
  userRoleType: UserRoleEnum;
  gettingProducts = true;
  productStatusEnum = ProductStatusEnum;
  ProductsList: ItemDto[];
  gettingMerchants: boolean;
  MerchantsList: MerchantListDto[];
  selectedMerchantId = ''
  selectedCategoryId: string;
  categoryName: string;
  addCategoryObj = new AddCategoryDto();
  addingCategories: boolean;
  editCategoryObj = new CategoryDto();
  deletingCategories: boolean;
  categoriesPreserve: CategoryDto[] = [];
  savingAssignCategories: boolean;
  originalItems: CategoryWithOptDto[] = [];
  searchTerm: string = '';
  workingwithremove = ''
  LengthOfCat = true
  emailToRemoveCatAccess: string[] = ['humayun@mifonda.io']
  showRemoveCatAccessBtn: boolean = false

  ngOnInit(): void {
    this.subscribeAppState();
    this.GetCategoriesList(true);
    this.userRoleType = this.securityService.securityObject.user.role;
    if (environment.production == false) {
      this.emailToRemoveCatAccess = ['humayun@mifonda.io', 'saim@email.com', 'sowmya@paalam.co.uk', 'saimabdullah+32@paalam.co.uk']
    }
    if (this.emailToRemoveCatAccess.includes(this.securityService.securityObject.user.email)) {
      this.showRemoveCatAccessBtn = true;
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
      this.CategoriesList = this.originalItems.filter(category =>
        category.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.CategoriesList = [...this.originalItems];
    }
  }

  subscribeAppState() {
    this.selectedMerchantId = this.appState.currentMerchant;
    console.log("this.appstate is ", this.appState)
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.selectedMerchantId = merchntId;
      this.GetCategoriesList(true);

    })
  }
  openModal() {
    console.log("")
    this.editCategoryObj = new CategoryDto()

    this.createMenuModal.show()
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

  truncateText(value: string, limit: number = 25, trail: string = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }

  truncate(text: string): string {
    return this.truncateText(text, 40);
  }

  GetCategoriesList(loadProducts?: boolean) {
    this.gettingCategories = true;
    this.CategoriesList = [];
    this.catProductsService.GetCategoriesWithItems(this.selectedMerchantId, this.securityService.securityObject.token).subscribe((data: CategoryWithOptDto[]) => {
      this.CategoriesList = data;
      if (this.CategoriesList.length === 0) {
        this.LengthOfCat = false
      } else {
        this.LengthOfCat = true
      }
      this.originalItems = [...this.CategoriesList];
      if (data) {
        this.categoriesPreserve = this.cloner.deepClone(data);
      }

      this.gettingCategories = false;

    }, (err) => {
      this.gettingCategories = false;
      this.toaster.error(err.message);
    })
  }



  DeleteCatCallBack = (id: any) => {
    this.deletingCategories = true;
    this.workingwithremove = id
    this.catProductsService.DeleteCategory(this.selectedMerchantId, id, this.securityService.securityObject.token).subscribe((data: any) => {
      this.CategoriesList = this.CategoriesList.filter(menu => menu.id !== id);

      if (this.CategoriesList.length === 0) {
        this.LengthOfCat = false
      }

      this.originalItems = [...this.CategoriesList];
      this.workingwithremove = ''
      this.deletingCategories = false;
      this.toaster.success('Category deleted successfully');
    }, (err) => {
      this.workingwithremove = ''
      this.deletingCategories = false;
      this.toaster.error(err.message);
    })
  };

  AddCategoryForMerchant(modal: ModalDirective) {
    let status: number = this.editCategoryObj.categoryStatus ? 1 : 0;
    this.addCategoryObj.token = this.securityService.securityObject.token;
    this.addCategoryObj.category.categoryStatus = status;
    this.addingCategories = true;
    this.addCategoryObj.category.categoryName = this.editCategoryObj.categoryName;
    this.addCategoryObj.category.posName = this.editCategoryObj.posName;
    this.addCategoryObj.category.categoryDescription = this.editCategoryObj.categoryDescription;
    console.log(this.addCategoryObj)
    this.catProductsService.AddCategoryForMerchant(this.selectedMerchantId, this.addCategoryObj).subscribe((data: ProductListDto[]) => {
      modal.hide();
      this.GetCategoriesList();
      this.addingCategories = false;
      this.toaster.success("Category added")
    }, (err) => {
      this.addingCategories = false;
      this.toaster.error(err.message);
    })
  }





  OpenConfirmToggle(menu: any, event: Event) {
    const originalStatus = menu.categoryStatus;

    // Prevent default checkbox behavior until confirmed
    event.preventDefault();

    const title = menu.categoryStatus === 1
      ? "Inactivate"
      : "Activate";

    const message = menu.categoryStatus === 1
      ? "Are you sure that you want to inactivate this category?"
      : "Are you sure that you want to activate this category?";

    const modalDto = new LazyModalDtoNew();
    modalDto.Title = `${title} Category`;
    modalDto.Text = message;
    modalDto.acceptButtonText = `Yes, ${title} category`
    modalDto.Description = `This will make your category ${title}.
    Would you like to ${title} the category ?`
    modalDto.callBack = () => {
      menu.categoryStatus = menu.categoryStatus === 1 ? 0 : 1;
      this.categoryStatusToogleCallback(menu.categoryStatus, menu.id);
    };

    modalDto.rejectCallBack = () => {
      (event.target as HTMLInputElement).checked = originalStatus === 1;
    };

    this.appUi.openLazyConfrimModalNew(modalDto);
  }


  categoryStatusToogleCallback(status: number, id: string) {

    this.catProductsService.DisableEnableCategory(this.selectedMerchantId, id, {
      "categoryStatus": status
    }).subscribe((data: any) => {
      this.toaster.success('Category status changed.');

    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }



  //

  OpenConfirmUnAssignCategoryToMenu(catid: any) {
    let nObj = catid;
    const modalDto = new LazyModalDtoNew();
    modalDto.Title = "Remove Category";
    modalDto.Description = "By taking this action, you will remove the category.Would you like to remove the category?"
    modalDto.acceptButtonText = "Yes, Remove Category";
    modalDto.Text = "Are you sure that you want to remove this category?";
    modalDto.callBack = this.DeleteCatCallBack;
    modalDto.data = nObj;
    this.appUi.openLazyConfrimModalNew(modalDto);
  }
}
