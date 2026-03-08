import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { provider } from 'src/app/Models/googleMyBusiness.model'
import { GoogleMyBusinessService } from 'src/app/core/google-my-business.service'
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from 'src/app/core/security.service';

@Component({
  selector: 'app-food-ordering',
  templateUrl: './food-ordering.component.html',
  styleUrls: ['./food-ordering.component.css']
})
export class FoodOrderingComponent implements OnInit {
  @ViewChild('confirmationmodal') confirmationmodal: ModalDirective;
  @Input() provider_obj = new provider();
  @Input() merchantId: string;
  @Input() locationId: string;
  @Input() accountId: string;

  linksids = []
  order_providers = []
  creatingLink: boolean = false
  updating: boolean = false
  deleteIds = []
  createLinks = []


  constructor(private securityService: SecurityService, private googleMyBusiness: GoogleMyBusinessService, private toaster: ToastrService) { }
  ngOnInit(): void {
    console.log("provider_obj in food page ", this.provider_obj)
    this.linksids = this.provider_obj.links_id
    this.order_providers = this.provider_obj.order_providers
  }
  addRow() {
    this.order_providers.push({ url: '' });
  }
  createlinkfunc(url: string) {
    this.deleteIds = []
    this.createLinks = []
    this.createLinks.push({
      "url": url,
      "action_type": "FOOD_TAKEOUT"
    })
    this.createLinks.push({
      "url": url,
      "action_type": "FOOD_DELIVERY"
    })
    this.creatingLink = true
    this.orderplacelink()

  }
  getPlaceAction() {

    this.googleMyBusiness.getOrderPlaceLink(this.securityService.securityObject.token,
      {
        "merchantid": this.merchantId,
        "locationid": this.locationId,
        "accountid": this.accountId,
      }
    ).subscribe((data: any) => {
      console.log("getPlaceAction data is ", data)
      this.provider_obj = data
      this.linksids = this.provider_obj.links_id
      this.order_providers = this.provider_obj.order_providers
      this.createLinks = []
      this.deleteIds = []

    }, (err) => {
      console.log("media data is in error")
      //this.toaster.error(ßssage);
    })
  }
  removeRow(dataObj, index: number) {
    this.deleteIds = []
    this.createLinks = []
    console.log("remove obj ", dataObj)
    if (dataObj.hasOwnProperty('FOOD_TAKEOUT')) {
      const Obj = dataObj['FOOD_TAKEOUT'];
      const id: string = Obj.id;
      if (this.linksids.includes(id)) {
        this.deleteIds.push(id);
      }
    }
    if (dataObj.hasOwnProperty('FOOD_DELIVERY')) {
      const Obj = dataObj['FOOD_DELIVERY'];
      const id = Obj.id;
      if (this.linksids.includes(id)) {
        this.deleteIds.push(id);
      }
    }
    this.provider_obj.order_providers.splice(index, 1)
    this.orderplacelink()

  }
  removeuncreatedRow(index: number) {
    this.provider_obj.order_providers.splice(index, 1)
    this.updating = false
  }
  // for confirmation modal
  orderplacelink() {

    this.googleMyBusiness.updatePlaceActionLink(this.securityService.securityObject.token,
      {
        "merchantid": this.merchantId,
        "locationid": this.locationId,
        "accountid": this.accountId,
        "create_list": this.createLinks,
        "delete_ids": this.deleteIds

      }
    ).subscribe((data: any) => {

      this.toaster.success("updated successfully")
      this.creatingLink = false
      this.updating = false
      this.getPlaceAction()

    }, (err) => {
      this.creatingLink = false
      this.updating = false
      this.toaster.error(err.error.message);
    })
  }
  handleCheckboxChange(dataObj, key: string, index, isChecked: boolean) {
    console.log("dataObj ", dataObj)
    console.log("key ", key)
    console.log("index ", index)
    console.log("isChecked ", isChecked)
    console.log("dataObj key ", dataObj[key])


    if (isChecked) {
      if (dataObj[key]) {
        const Obj = dataObj[key];
        const id = Obj.id;
        if (this.linksids.includes(id)) {
          if (this.deleteIds.includes(id)) {
            const create_index = this.deleteIds.indexOf(id);
            if (create_index !== -1) {
              this.deleteIds.splice(create_index, 1);
            }
          }
        }
      }
      else {
        this.deleteIds = []
        this.createLinks.push({
          "url": dataObj.url,
          "action_type": key
        })
        this.orderplacelink()
      }

    } else {
      const Obj = dataObj[key];
      const id = Obj.id;
      if (this.linksids.includes(id)) {
        this.deleteIds.push(id);
      }
      // delete this.provider_obj.order_providers[index][key]
    }
    console.log("new create links  ", this.createLinks)
    console.log("delete ids  ", this.deleteIds)
    console.log("linked ids ", this.linksids)
  }
  confirmModal() {
    this.confirmationmodal.show();
  }
  closeConfirmModal() {
    this.confirmationmodal.hide();
  }
}
