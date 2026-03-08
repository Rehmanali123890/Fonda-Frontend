import { Component, ViewChild, Input, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { menu } from 'src/app/Models/googleMyBusiness.model'
import { GoogleMyBusinessService } from 'src/app/core/google-my-business.service'
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@ngneat/transloco';
import { SecurityService } from 'src/app/core/security.service';
@Component({
  selector: 'app-gmb-menus',
  templateUrl: './gmb-menus.component.html',
  styleUrls: ['./gmb-menus.component.css']
})
export class GmbMenusComponent implements OnInit {
  @ViewChild('menuhoursmodal') menuhoursmodal: ModalDirective;
  @ViewChild('confirmationmodal') confirmationmodal: ModalDirective;
  @Input() menu_obj = new menu();
  @Input() merchantId: string;
  @Input() locationId: string;
  @Input() accountId: string;
  @Input() menuHours: [];
  @Output() callgetLocation = new EventEmitter<void>();
  constructor(private securityService: SecurityService, private googleMyBusiness: GoogleMyBusinessService, private toaster: ToastrService, private renderer: Renderer2, private translocoService: TranslocoService) { }
  ngOnInit(): void {
    for (let cat in this.menu_obj.categories) {
      // console.log("cayegory ", this.menu_obj.categories[cat])
      for (let item in this.menu_obj.categories[cat].items) {
        // console.log("item ", this.menu_obj.categories[cat].items[item].itemurl)
      }
    }

    this.checkMobileView();
    window.addEventListener('resize', () => {
      this.checkMobileView();
    });

  }
  // logic for menu in the mobile view
  @ViewChild('itemName') itemNameElement: ElementRef;
  isMobileView: boolean;
  ngOnDestroy() {
    window.removeEventListener('resize', () => {
      this.checkMobileView();
    });
  }

  checkMobileView() {
    this.isMobileView = window.innerWidth < 768; // Adjust the width according to your design
  }
  getdayTranslation(day): string {
    console.log(day)
    let dayy = ''
    this.translocoService.selectTranslate('Hours.' + day).subscribe(translation => {
      dayy = translation;
    });
    return dayy
  }
  toggleDetails(item: any) {
    item.showDetails = !item.showDetails;
  }



  syncMenu() {

    this.googleMyBusiness.syncMenuToGmb(this.securityService.securityObject.token,
      {
        "merchantId": this.merchantId,
        "locationId": this.locationId,
        "accountId": this.accountId,

      }
    ).subscribe((data: any) => {
      console.log("data is ", data)
      this.toaster.success('Sync Menu successfully')
    }, (err) => {
      console.log("menu data is in error")
      this.toaster.error(err.error.message);
    })
  }
  syncMenuHours() {

    this.googleMyBusiness.syncMenuHoursToGmb(this.securityService.securityObject.token,
      {
        "merchantid": this.merchantId,
        "locationid": this.locationId,
      }
    ).subscribe((data: any) => {
      console.log("data is ", data)
      //call the parent function
      this.callgetLocation.emit();
      this.toaster.success('Sync menu hours successfully');
    }, (err) => {
      console.log("menu data is in error")
      this.toaster.error(err.error.message);
    })
  }
  // for opening hours modal
  openingHoursModal() {
    this.menuhoursmodal.show()
  }
  closeModal() {
    this.menuhoursmodal.hide();
  }
  // for confirmation modal
  confirmModal() {
    this.confirmationmodal.show();
  }
  closeConfirmModal() {
    this.confirmationmodal.hide();
  }


}
