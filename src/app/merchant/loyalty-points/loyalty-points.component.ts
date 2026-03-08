import { Component, OnInit, ViewChild, SimpleChanges, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { EditLoaltyPoints } from 'src/app/Models/merchant.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
// import { LoaltyPoints } from 'src/app/Models/merchant.model';

@Component({
  selector: 'app-loyalty-points',
  templateUrl: './loyalty-points.component.html',
  styleUrls: ['./loyalty-points.component.scss'],
})
export class LoyaltyPointsComponent implements OnInit {

  @Input() merchantId: string;
  saveingLoaltyPoints: boolean;
  show: boolean = false;
  saveingRedeemPoints: boolean;
  gettingLoaltyList: boolean;
  updateLoaltyPoints: boolean;
  loaltyPoints: any
  expandtable: { expandtable: boolean, idx: number }[] = [];
  // addLoaltyPointsObj = new LoaltyPoints();
  editLoaltyPointsObj = new EditLoaltyPoints();
  date: string = '';
  remarks: string = '';
  point: string = '';
  constructor(private merchantService: MerchantService, private toaster: ToastrService, private securityService: SecurityService, private route: ActivatedRoute) { }
  @ViewChild('createOurPoints') createOurPoints: ModalDirective;
  @ViewChild('createRedeem') createRedeem: ModalDirective;
  @ViewChild('editPoints') editPoints: ModalDirective;
  removeClass: any
  ngOnInit(): void {
    this.allLoaltyPoints();
    this.loaltyPoints = [];
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.allLoaltyPoints();
    this.loaltyPoints = [];
  }
  showRow() {
    this.show = !this.show
  }
  onChangeExpandtable(idx) {
    console.log("onchange expandtable in loyalty points")
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }
  allLoaltyPoints() {
    this.gettingLoaltyList = true;
    this.merchantService.getAllPoints(this.merchantId).subscribe((data: any) => {
      this.loaltyPoints = data.data;
      // for mobile view
      this.expandtable = new Array(this.loaltyPoints.details.length).fill({ expandtable: false, idx: 0 });
      this.expandtable = this.expandtable.map((item, idx) => {
        return {
          ...item,
          idx: idx
        }
      })
      this.gettingLoaltyList = false;
    }, (err) => {
      this.gettingLoaltyList = false;
      this.toaster.error(err.error.message);
    })
  }
  addLoaltyPoint() {
    this.saveingLoaltyPoints = true;
    this.createOurPoints.hide();
    this.merchantService.postAddPoints(
      {
        "token": this.securityService.securityObject.token,
        "merchantId": this.merchantId,
        "date": this.date,
        "remarks": this.remarks,
        "points": this.point,
        "remove": 0
      }
    ).subscribe((data) => {
      this.toaster.success("Loyalty points added successfully");
      this.saveingLoaltyPoints = false;
      this.allLoaltyPoints();
      this.point = this.point = '';
      this.remarks = this.remarks = '';
    }, (err) => {
      this.saveingLoaltyPoints = false;
      this.toaster.error(err.error.message);
    })
  }
  // Same API for redeem
  addRedeemPoint() {
    this.saveingRedeemPoints = true;
    this.createRedeem.hide();
    this.merchantService.postAddPoints(
      {
        "token": this.securityService.securityObject.token,
        "merchantId": this.merchantId,
        "date": this.date,
        "remarks": this.remarks,
        "points": this.point,
        "remove": 1
      }
    ).subscribe((data) => {
      this.toaster.success("Redeem added successfully");
      this.saveingRedeemPoints = false;
      this.allLoaltyPoints();
      this.point = this.point = '';
      this.remarks = this.remarks = '';
    }, (err) => {
      this.saveingRedeemPoints = false;
      this.toaster.error(err.error.message);
    })
  }
  editLoaltyPoints(modal: ModalDirective) {
    this.updateLoaltyPoints = true;
    this.merchantService.editPoints(this.securityService.securityObject.token, {
      "remarks": this.editLoaltyPointsObj.remarks,
      "points": this.editLoaltyPointsObj.point.toString(),
      "pointId": this.editLoaltyPointsObj.id,
    }).subscribe((data) => {
      this.toaster.success("Loyalty points updated successfully");
      this.updateLoaltyPoints = false;
      modal.hide();
      this.allLoaltyPoints();
    }, (err) => {
      this.toaster.error(err.error.message);
      this.updateLoaltyPoints = false;
      this.editPoints.hide();
    })
  }
  deleteLoaltyPoint(id) {
    this.gettingLoaltyList = true;
    this.merchantService.deletePoints(this.merchantId, id).subscribe((data) => {
      this.toaster.success("Loyalty points deleted successfully");
      this.gettingLoaltyList = false;
      this.allLoaltyPoints();
    }, err => {
      this.gettingLoaltyList = false;
      this.toaster.error(err.error.message);
    })
  }
  openModalforCreatePoints() {
    this.createOurPoints.show()
  }
  openModalforCreateRedeem() {
    this.createRedeem.show()
  }
  openModalforAddEditPoints(modal: ModalDirective, item: EditLoaltyPoints) {
    Object.assign(this.editLoaltyPointsObj, item);
    modal.show()
  }
  resetObj() {
    this.editLoaltyPointsObj = new EditLoaltyPoints();
  }
  closeModal() {
    this.createOurPoints.hide();
  }
  closeSecondModal() {
    this.createRedeem.hide();
  }
  closeEditModal() {
    this.editPoints.hide();
  }

}
