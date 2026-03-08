import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { StorefrontService } from 'src/app/core/storefront.service';
import { SecurityService } from 'src/app/core/security.service';
import { EsperDevices, MerchantListDto, MerchantStatusEnum } from 'src/app/Models/merchant.model';
import { UserRoleEnum } from 'src/app/Models/user.model';
import { MerchantService } from 'src/app/core/merchant.service';
import { WoflowService } from 'src/app/core/woflow.service';
import { environment } from './../../../environments/environment';
import { StoreFrontPromos, StoreFrontQR } from 'src/app/Models/storeFront.model';
import { items } from 'src/app/Models/storeFront.model';
import Swal from 'sweetalert2'
import { AppStateService } from 'src/app/core/app-state.service';
import { cloneDeep } from 'lodash';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as descriptions from '../../../../src/app/tooltips-for-fields/tooltips';

@UntilDestroy()
@Component({
  selector: 'app-store-front-settings',
  templateUrl: './store-front-settings.component.html',
  styleUrls: ['./store-front-settings.component.scss']
})

export class StoreFrontSettingsComponent implements OnInit {
  baseUrl = window.location.origin
  merchantDto = new MerchantListDto();
  merchantId: string
  currentDate: string
  @Output() triggerChangeParent = new EventEmitter<any>();
  @ViewChild('createOurPromo') createOurPromo: ModalDirective;
  @ViewChild('createStoreFrontQR') createStoreFrontQR: ModalDirective;
  @ViewChild('confirmationmodal') confirmationmodal: ModalDirective;
  @ViewChild('createOurPoints') createOurPoints: ModalDirective;
  MerchantsList: MerchantListDto[] = [];

  fileToUploadLogo: File | null = null;
  uploadingBanner: boolean = false;
  uploadingLogo: boolean = false;
  environment: any = environment;
  fileToUploadBanner: File | null = null;
  allPromos: StoreFrontPromos[] = []
  allSourceQR: StoreFrontQR[] = []
  itemsObj: items[] = []
  freeitemsObj: items[] = []
  promoObj: StoreFrontPromos = new StoreFrontPromos()
  sourceQRObj: StoreFrontQR = new StoreFrontQR()
  editpromoObj: StoreFrontPromos = new StoreFrontPromos()
  gettingPromoList: boolean = false
  has_address_error: number = 1
  filterStatus: number = 1
  smallerenddate: boolean = false
  filterStartdate: string = ''
  filterEnddate: string = ''
  delDocId: string = ''
  delModalId: string = ''
  gettingSourcePDF: boolean;
  openDocUrl: string = ''
  openDocName: string = ''
  showloader: boolean = false
  storefrontSlug: any

  checkURLError: any = ''
  sourceOptionsQR: any[] = [
    { value: 'GMB' },
    { value: 'FB' },
    { value: 'Insta' },
    { value: 'TikTok' },
    { value: 'Table' },
    { value: 'Window' },
    { value: 'Flyer' },
    { value: 'Direct' },
    { value: 'Other' }
  ]

  sourceOptionsPromo: any[] = [
    { value: 'GMB' },
    { value: 'FB' },
    { value: 'Insta' },
    { value: 'TikTok' },
    { value: 'Table' },
    { value: 'Window' },
    { value: 'Flyer' },
    { value: 'Direct' },
    { value: 'Other' }
  ]
  newOption: string = ''; // Holds the user input for the new option

  // Method to add the user-entered option
  addUserOptionQR() {
    if (this.newOption.trim()) { // Check if the input is not empty
      this.sourceOptionsQR.push({ value: this.newOption }); // Add the new option
      this.sourceQRObj.source = this.newOption; // Optionally, select the new option
      this.newOption = ''; // Clear the input field after adding
    }
    console.log(this.sourceQRObj.source);

  }
  // Method to add the user-entered option
  addUserOptionPromo() {
    if (this.newOption.trim()) { // Check if the input is not empty
      this.sourceOptionsPromo.push({ value: this.newOption }); // Add the new option
      this.promoObj.source = this.newOption; // Optionally, select the new option
      this.editpromoObj.source = this.newOption; // Optionally, select the new option
      this.newOption = ''; // Clear the input field after adding
    }
  }

  constructor(private merchantService: MerchantService, private toaster: ToastrService, private appState: AppStateService, private merchantservice: MerchantService, private storeFrontService: StorefrontService, private securityService: SecurityService,
    private woflowService: WoflowService, private router: Router, private filterDataService: FilterDataService, private appUi: AppUiService, private activatedRoute: ActivatedRoute,) {


  }


  // tooltips start
  uRLSlugDescription = descriptions.uRLSlugDescription;
  uploadLogoDescription = descriptions.uploadLogoDescription;
  uploadBannerDescription = descriptions.uploadBannerDescription;

  ngOnInit(): void {
    this.merchantId = this.appState.currentMerchant;

    this.GetMerchantDetail()
    this.getAllPromos()
    this.getAllSource()
    this.subscribeAppState()

    // this.subscribeAppState()
    const currentDate = new Date();
    const currentonboardingdate = new Date();
    // Get the next day by adding 1 to the current day
    currentDate.setDate(currentDate.getDate());
    this.currentDate = currentDate.toISOString().split('T')[0];
  }

  updateHappyHourCheckValue(checked: boolean) {
    this.promoObj.ishappyhourenabled = checked ? 1 : 0;
    console.log("this.promoObj.days", this.promoObj.days) // Update the value based on whether the checkbox is checked or unchecked
  }
  handleCheckboxChange(day: string, isChecked: boolean) {
    if (isChecked) {
      // Add the day to the list of selected days
      this.promoObj.days.push(day);
    } else {
      // Remove the day from the list of selected days
      const index = this.promoObj.days.indexOf(day);
      if (index !== -1) {
        this.promoObj.days.splice(index, 1);
      }
    }
  }
  GetMerchantDetail() {

    this.merchantService.GetMerchantById(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;
      this.storefrontSlug = this.merchantDto.slug
      console.log("storefront slug", this.merchantDto.slug)
      this.showloader = false;
    }, (err) => {
      this.showloader = false
      this.toaster.error(err.message);
    })
  }

  subscribeAppState() {

    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.showloader = true
      this.merchantId = merchntId;
      this.GetMerchantDetail()
      this.getAllPromos()
      this.getAllSource();
    })

  }

  handleFileInputForLogo(files: FileList) {
    this.uploadingLogo = true;
    this.fileToUploadLogo = files.item(0);

    this.storeFrontService.uploadBannerLogo(this.merchantId, this.fileToUploadLogo).subscribe((data: any) => {
      this.GetMerchantDetail()

      this.toaster.success("image added successfully.")
      this.uploadingLogo = false;
      this.triggerChangeParent.emit();
    }, (err) => {
      this.uploadingLogo = false;
      this.toaster.error(err.error.message);
    })
  }
  showBanner = true
  handleFileInputForBanner(files: FileList) {
    this.fileToUploadBanner = files.item(0);
    // this.showBanner = false
    this.merchantDto.banner = null

    this.uploadingBanner = true
    this.storeFrontService.uploadBannerBanner(this.merchantId, this.fileToUploadBanner, "1").subscribe((data: any) => {
      this.woflowService.uploadFilesToAWS(data.data.presignedUrl.url, data.data.presignedUrl.fields, this.fileToUploadBanner).subscribe((data1: any) => {
        this.storeFrontService.uploadBannerBanner(this.merchantId, this.fileToUploadBanner, data.data.presignedUrl.url + data.data.presignedUrl.fields.key).subscribe((data2: any) => {
          this.toaster.success("banner added successfully.")
          this.uploadingBanner = false
          this.showBanner = false
          this.merchantDto.banner = data.data.presignedUrl.url + data.data.presignedUrl.fields.key
          this.showBanner = true
        })
      })

    }, (err) => {
      this.toaster.error(err.error.message);
      this.uploadingBanner = false
    })
  }

  savingMerchant: boolean = false
  processSaveMerchantData() {
    this.savingMerchant = true;
    this.merchantservice.UpdateMerchant(this.securityService.securityObject.token, this.merchantId, this.merchantDto).subscribe((data: any) => {
      this.toaster.success('Data saved successfully');
      this.GetMerchantDetail()
      this.savingMerchant = false;
      this.triggerChangeParent.emit();
    }, (err) => {
      this.savingMerchant = false;
      this.toaster.error(err.error.message);
    })
  }


  storefrontSlugChange() {
    this.savingMerchant = true;
    this.merchantservice.UpdateStorefrontSlug(this.securityService.securityObject.token, this.merchantId, this.storefrontSlug).subscribe((data: any) => {
      this.toaster.success('Storefront slug Changed Successfully');
      this.GetMerchantDetail()
      this.savingMerchant = false;
      this.triggerChangeParent.emit();
    }, (err) => {
      this.savingMerchant = false;
      console.log("error", err)
      this.toaster.error(err.error.message);
    })
  }


  storefrontStatusChange() {
    this.savingMerchant = true;
    console.warn("comming there", this.merchantDto.storefrontStatus)
    this.merchantservice.UpdateStorefrontStatus(this.securityService.securityObject.token, this.merchantId, this.merchantDto.storefrontStatus).subscribe((data: any) => {
      this.toaster.success('Storefront status Changed Successfully');
      this.GetMerchantDetail()
      this.savingMerchant = false;
      this.triggerChangeParent.emit();
    }, (err) => {
      this.savingMerchant = false;
      console.log("error", err)
      this.toaster.error(err.error.message);
    })
  }


  gettingPDF: boolean;
  blob = null
  DownloadQRCode(promo = null) {
    this.gettingPDF = true
    this.storeFrontService.getQRCodepdf(this.merchantId, promo = promo).subscribe(
      (data: any) => {


        this.blob = new Blob([data], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(data);
        console.log(" data of qr code is ", data)
        var link = document.createElement('a');
        link.href = downloadURL;
        let promoname = ''
        if (promo != null) {
          for (const promo_obj of this.allPromos) {
            if (promo_obj.promoId === promo) {
              promoname = promo_obj.promo;
            }
          }
        }
        link.download = this.merchantDto.merchantName + '_' + promoname;
        link.click();
        this.gettingPDF = false
      }, (err) => {
        this.gettingPDF = false;
        this.toaster.error(err.error.message);
      }
    )
  }

  resetObj() {
    this.promoObj = new StoreFrontPromos()
    this.sourceQRObj = new StoreFrontQR()
    this.newOption = ''
  }

  // Store Front QR Modal
  addFrontQR() {
    this.savingPromo = true
    this.storeFrontService.addSourceQR(this.securityService.securityObject.token, this.merchantId, this.sourceQRObj).subscribe((data: any) => {
      this.savingPromo = false
      this.createStoreFrontQR.hide()
      this.toaster.success("Source saved successfully");
      this.getAllSource()
    }, (err) => {
      this.savingPromo = false;
      this.toaster.error(err.error.message);
    })
    // }
  }

  getAllSource() {

    if (this.filterStartdate != '' && this.filterEnddate != '' && this.filterStartdate > this.filterEnddate) {
      this.toaster.error("Start date can not be greater than end date.")
    }
    else {
      this.storeFrontService.getAllSource(this.securityService.securityObject.token, this.merchantId).subscribe((data: any) => {
        this.gettingPromos = false

        this.allSourceQR = data.data
        this.itemsObj = data.items
        this.freeitemsObj = data.freeItems
        // for mobile view
        this.allSourceQR = this.allSourceQR.map((item, idx) => {
          return {
            ...item,
            idx: idx
          }
        })
      }, (err) => {
        this.gettingPromos = false;
        this.toaster.error(err.error.message);
      })
    }
  }

  DownloadSourceQRCode(qrId = null) {
    this.gettingSourcePDF = true

    this.storeFrontService.getSourceQRCodepdf(this.securityService.securityObject.token, qrId = qrId).subscribe(
      (data: any) => {


        this.blob = new Blob([data], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(data);

        var link = document.createElement('a');
        link.href = downloadURL;
        let sourcename = ''
        if (qrId != null) {
          for (const source_obj of this.allSourceQR) {

            if (source_obj.qrId === qrId) {
              sourcename = source_obj.source;
            }
          }
        }
        const fileName = `${this.merchantDto.merchantName}_${sourcename}`;

        link.download = fileName;

        link.click();
        this.gettingSourcePDF = false
      }, (err) => {
        this.gettingSourcePDF = false;
        this.toaster.error(err.error.message);
      }
    )
  }
  addModalId(ids: string) {
    this.delModalId = ids;
  }

  deleteSource(id?: string) {
    // this.showloader = true

    const qrId = id || this.delModalId;

    this.storeFrontService.DeleteSource(this.securityService.securityObject.token, qrId).subscribe((data) => {
      this.toaster.success("Source deleted successfully.")
      this.getAllSource()
    }, (err) => {
      this.toaster.error(err.message);
    })
    this.addModalId('')
  }


  openModalforConfirmation(url: any) {
    this.delDocId = url.id
    this.confirmationmodal.show()
  }
  closeModal() {
    this.createOurPoints.hide();
  }
  closeConfirmModal() {
    this.confirmationmodal.hide();
  }

  checkURLValidation(event: any) {
    const urlRegex = /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
    if (event.target.value && !urlRegex.test(event.target.value)) {
      this.checkURLError = "Url is not valid"
    } else {
      this.checkURLError = ''
    }
  }

  savingPromo: boolean = false
  addPromos() {
    this.savingPromo = true
    if (this.promoObj.promoId.length > 0) {
      this.merchantservice.editPromoCode(this.securityService.securityObject.token, this.merchantId, this.promoObj).subscribe((data: any) => {
        this.savingPromo = false
        this.createOurPromo.hide()
        this.toaster.success("Promo edited successfully");

        this.getAllPromos()
      }, (err) => {
        this.savingPromo = false;
        this.toaster.error(err.error.message);
      })
    } else {
      this.merchantservice.addPromoCode(this.securityService.securityObject.token, this.merchantId, this.promoObj).subscribe((data: any) => {
        this.savingPromo = false
        this.createOurPromo.hide()
        this.toaster.success("Promo saved successfully");

        this.getAllPromos()
      }, (err) => {
        this.savingPromo = false;
        this.toaster.error(err.error.message);
      })
    }


  }

  gettingPromos: boolean = false
  expandtable: { expandtable: boolean, idx: number }[] = [];
  onChangeExpandtable(idx) {
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }




  getAllPromos() {
    if (this.filterStartdate != '' && this.filterEnddate != '' && this.filterStartdate > this.filterEnddate) {
      this.toaster.error("Start date can not be greater than end date.")
    }
    else {
      this.merchantservice.getAllPromos(this.securityService.securityObject.token, this.merchantId, this.filterStatus, this.filterStartdate, this.filterEnddate).subscribe((data: any) => {
        this.gettingPromos = false

        this.allPromos = data.data
        this.itemsObj = data.items
        this.freeitemsObj = data.freeItems
        // for mobile view
        this.expandtable = new Array(this.allPromos.length).fill({ expandtable: false, idx: 0 });
        this.expandtable = this.expandtable.map((item, idx) => {
          return {
            ...item,
            idx: idx
          }
        })
      }, (err) => {
        this.gettingPromos = false;
        this.toaster.error(err.error.message);
      })
    }


  }
  preventNegativeInput(event: KeyboardEvent, propertyName?: string) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    if (parseFloat(inputValue) < 0 || Object.is(parseFloat(inputValue), -0)) {

      this.merchantDto[propertyName] = 0;
      inputElement.value = ''; // Clear the input value if it's negative
      event.preventDefault(); // Prevent the negative input
    }
  }
  openModalforAddEditPromos(item: any) {
    console.log(" openModalforAddEditPromos ", item)

    if (item.source) {
      let checkOption = this.sourceOptionsPromo.find((val) => val?.value === item?.source);
      if (!checkOption) {
        this.sourceOptionsPromo.push({ value: item.source })
      }
    }
    this.promoObj = cloneDeep(item);

  }
  checkenddate() {
    this.smallerenddate = false
    if (this.promoObj.promoenddate != '') {
      if (this.promoObj.promostartdate > this.promoObj.promoenddate) {
        this.smallerenddate = true
      }
    }

  }
  copyInputSourceUrl(itemSource: string) {
    let url = environment.storeFrontBaseUrl + this.merchantDto.slug + '?type=qr&utm_source=' + itemSource

    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toaster.success('Storefront URL is copied to clipboard');
  }

}
