import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { MerchantService } from 'src/app/core/merchant.service';
import { MerchantListDto, VirtualRestaurant } from 'src/app/Models/merchant.model';

@Component({
  selector: 'app-virtual-resturants',
  templateUrl: './virtual-resturants.component.html',
  styleUrls: ['./virtual-resturants.component.scss'],
})
export class VirtualResturantsComponent implements OnInit {
  @Input() merchantDto = new MerchantListDto();
  @Input() gettingMerchantDetail: boolean;
  @Input() selectedTab: string;
  @Input() merchantId: string;


  @ViewChild('addVirtualRestuarant') addVirtualRestuarant: ModalDirective;

  virtaulRestaurantList: VirtualRestaurant[] = []
  virtualRestaurantObj: VirtualRestaurant = new VirtualRestaurant()
  saveingVirtualRestaurant: boolean = false
  gettingVirtualResturants: boolean = false
  openmodal: string = ''
  constructor(private merchantService: MerchantService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getAllVirtualResturants()
  }
  ngOnChanges(changes: SimpleChanges): void {


    this.getAllVirtualResturants()

  }
  openModalforAddEdit() {
    this.virtualRestaurantObj = new VirtualRestaurant()
    this.addVirtualRestuarant.show()
  }
  addModifyRestaurant() {
    this.saveingVirtualRestaurant = true;
    if (this.virtualRestaurantObj.id) {
      this.merchantService.editVirtualRestaurant(this.virtualRestaurantObj, this.merchantId).subscribe((data) => {
        let toastmessage = ''
        if (this.openmodal == 'edit') { toastmessage = "Virtual Merchant Edited Successfully." }
        else { toastmessage = "Virtual Merchant Added Successfully." }
        this.toaster.success(toastmessage)
        this.saveingVirtualRestaurant = false;
        this.getAllVirtualResturants()
        this.addVirtualRestuarant.hide()

      }, err => {
        this.saveingVirtualRestaurant = false;
        this.toaster.error(err.error.message);
      })
    } else {
      this.merchantService.addVirtualRestaurant(this.virtualRestaurantObj, this.merchantId).subscribe((data) => {
        this.toaster.success("Virtual merchant Added Successfully.")
        this.saveingVirtualRestaurant = false;
        this.getAllVirtualResturants()
        this.addVirtualRestuarant.hide()

      }, err => {
        this.saveingVirtualRestaurant = false;
        this.toaster.error(err.error.message);
      })
    }

  }
  // logic for mobile
  expandtable: { expandtable: boolean, idx: number }[] = [];
  onChangeExpandtable(idx) {
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }
  getAllVirtualResturants() {
    this.gettingVirtualResturants = true
    this.merchantService.getVirtualRestaurants(this.merchantId).subscribe((data: any) => {
      this.virtaulRestaurantList = data.data;
      // for mobile view
      this.expandtable = new Array(this.virtaulRestaurantList.length).fill({ expandtable: false, idx: 0 });
      this.expandtable = this.expandtable.map((item, idx) => {
        return {
          ...item,
          idx: idx
        }
      })
      this.gettingVirtualResturants = false
    }, err => {
      this.gettingVirtualResturants = false;
      this.toaster.error(err.error.message);
    })
  }
  merchantStatusToogle(virtualRestaurantObj: VirtualRestaurant) {
    this.merchantService.virtualRestaurantStatus(virtualRestaurantObj, this.merchantId).subscribe((data) => {
      this.toaster.success("Virtual merchant status changed Successfully.")

    }, err => {
      this.toaster.error(err.error.message);
    })
  }
  closeModal() {
    this.addVirtualRestuarant.hide();
    this.virtualRestaurantObj = new VirtualRestaurant()
  }
}
