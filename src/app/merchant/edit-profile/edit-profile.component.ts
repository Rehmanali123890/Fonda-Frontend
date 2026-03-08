import { Component, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Location_obj } from 'src/app/Models/googleMyBusiness.model'
import { Loc_Address } from 'src/app/Models/googleMyBusiness.model'
import { GoogleMyBusinessService } from 'src/app/core/google-my-business.service'
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@ngneat/transloco';
import { SecurityService } from 'src/app/core/security.service';
declare const google: any;
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  @ViewChild('openinghoursmodal') openinghoursmodal: ModalDirective;
  @ViewChild('confirmationmodal') confirmationmodal: ModalDirective;
  @ViewChild('editbusinesslocatonmodal') editbusinesslocatonmodal: ModalDirective;
  @Input() loc_obj = new Location_obj();
  @Input() merchantId: string;
  @Output() callgetLocation = new EventEmitter<void>();
  Loc_Address = new Loc_Address()

  constructor(private securityService: SecurityService, private googleMyBusiness: GoogleMyBusinessService, private toaster: ToastrService, private translocoService: TranslocoService) { }
  ngOnInit(): void {
    this.Loc_Address = cloneDeep(this.loc_obj.address);
    console.log("this.Loc_Address ", this.Loc_Address)
    this.initMap();
  }
  async initMap(): Promise<void> {
    // Address string
    const address = `${this.loc_obj.address.addressLines.join(', ')}, ${this.loc_obj.address.town}, ${this.loc_obj.address.state} ${this.loc_obj.address.postalCode}`;
    //const address = "1855 41st Avenue, Food Court In The Capitola Mall, Capitola, CA 95010";

    // Geocode the address to get the coordinates
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK') {
        const position = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };

        // The map, centered at the specified address
        const map1 = new google.maps.Map(document.getElementById('map1') as HTMLElement, {
          zoom: 15,
          center: position,
        });

        // Add a marker at the specified address
        new google.maps.Marker({
          position: position,
          map: map1,
          title: address
        });
        const map2 = new google.maps.Map(document.getElementById('map2') as HTMLElement, {
          zoom: 15,
          center: position,
        });

        // Add a marker at the specified address
        new google.maps.Marker({
          position: position,
          map: map2,
          title: address
        });
      } else {
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  }
  getdayTranslation(day): string {
    console.log(day)
    let dayy = ''
    this.translocoService.selectTranslate('Hours.' + day).subscribe(translation => {
      dayy = translation;
    });
    return dayy
  }
  syncOpeningHours() {

    this.googleMyBusiness.syncOpeningHoursToGmb(this.securityService.securityObject.token,
      {
        "merchantid": this.merchantId,
        "locationid": this.loc_obj.locationId

      }
    ).subscribe((data: any) => {
      console.log("data is ", data)
      //call the parent function.
      this.callgetLocation.emit();
      this.toaster.success('Sync opening hours successfully');
    }, (err) => {
      console.log("menu data is in error")
      //this.toaster.error(ßssage);
    })
  }
  syncBusinessProfile() {

    this.googleMyBusiness.syncBusinessProfileToGmb(this.securityService.securityObject.token,
      {
        "merchantid": this.merchantId,
        "locationid": this.loc_obj.locationId,
        "description": this.loc_obj.profile,
        "category": this.loc_obj.category,
        "storefrontAddress": {
          "regionCode": "US",
          "postalCode": this.loc_obj.address.postalCode,
          "administrativeArea": this.loc_obj.address.state,
          "locality": this.loc_obj.address.town,
          'addressLines': this.loc_obj.address.addressLines
        }

      }
    ).subscribe((data: any) => {
      console.log("data is ", data)
      //call the parent function
      this.callgetLocation.emit();
      this.toaster.success('Sync business profile successfully');
    }, (err) => {
      console.log("menu data is in error")
      this.toaster.error(err.error.message);
    })
  }
  // for opening hours modal
  openingHoursModal() {
    this.openinghoursmodal.show()
  }
  closeModal() {
    this.openinghoursmodal.hide();
  }
  // for confirmation modal
  confirmModal() {
    this.confirmationmodal.show();
  }
  closeConfirmModal() {
    this.confirmationmodal.hide();
  }
  // for edit business location
  editBusinessModal() {
    this.editbusinesslocatonmodal.show();
  }
  closeEditBusinessModal() {
    this.editbusinesslocatonmodal.hide();
  }
  saveaddress() {

    this.loc_obj.address = this.Loc_Address
    this.initMap();
  }
  addAddressLine() {
    this.loc_obj.address.addressLines.push('');
  }
}
