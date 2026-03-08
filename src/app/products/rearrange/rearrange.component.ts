import { ClonerService } from './../../core/DataServices/cloner.service';
import { ItemDetailObject } from './../../Models/item.model';
import { ItemService } from './../../core/item.service';
import { AppUiService } from './../../core/app-ui.service';
import { MerchantService } from './../../core/merchant.service';
import { ProductsCategoriesService } from './../../core/products-categories.service';
import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { SecurityService } from 'src/app/core/security.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AppStateService } from 'src/app/core/app-state.service';
@Component({
  selector: 'app-rearrange',
  templateUrl: './rearrange.component.html',
  styleUrls: ['./rearrange.component.scss']
})
export class RearrangeComponent implements OnInit {

  constructor(
    private merchantService: MerchantService
  ) { }
  @Input() dataToSort = [];
  @Input() type: string;
  @Input() merchantId: string;
  @Input() menuId: string = null;
  @Input() itemId: string = null;
  @Input() addonId: string = null;
  @Input() categoryId: string = null;
  savingSorting: boolean = false
  @ViewChild('reArrangeModal') reArrangeModal: ModalDirective;
  dataToPush: any = []
  ngOnInit(): void {
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dataToSort, event.previousIndex, event.currentIndex);
    this.dataToPush = []
    this.dataToSort.forEach((x, index) => {
      if (this.menuId != null) {
        this.dataToPush.push({
          "categoryId": x.id,
          "sortId": index
        })
      }
      if (this.categoryId != null) {
        this.dataToPush.push({
          "itemId": x.id,
          "sortId": index
        })
      }
      if (this.itemId != null) {
        this.dataToPush.push({
          "addonId": x.id,
          "sortId": index
        })
      }
      if (this.addonId != null) {
        this.dataToPush.push({
          "optionId": x.id,
          "sortId": index
        })
      }

    })

  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  showModal() {
    this.reArrangeModal.show()
  }
  saveSorting() {
    this.savingSorting = true;
    if (this.menuId != null) {
      this.merchantService.sortMenuCategories({ "categories": this.dataToPush }, this.merchantId, this.menuId).subscribe((data: any) => {
        this.reArrangeModal.hide();
        this.savingSorting = false;
        // this.toaster.success("Order saved successfully!");
      }, (err) => {
        this.savingSorting = false;
        // this.toaster.error(err.error.message);
      })
    }
    if (this.categoryId != null) {
      this.merchantService.sortCategoryItems({ "items": this.dataToPush }, this.merchantId, this.categoryId).subscribe((data: any) => {
        this.reArrangeModal.hide();
        this.savingSorting = false;
        // this.toaster.success("Order saved successfully!");
      }, (err) => {
        this.savingSorting = false;
        // this.toaster.error(err.error.message);
      })
    }
    if (this.itemId != null) {
      this.merchantService.sortItemAddons({ "addons": this.dataToPush }, this.merchantId, this.itemId).subscribe((data: any) => {
        this.reArrangeModal.hide();
        this.savingSorting = false;
        // this.toaster.success("Order saved successfully!");
      }, (err) => {
        this.savingSorting = false;
        // this.toaster.error(err.error.message);
      })
    }
    if (this.addonId != null) {
      this.merchantService.sortAddonOptions({ "options": this.dataToPush }, this.merchantId, this.addonId).subscribe((data: any) => {
        this.reArrangeModal.hide();
        this.savingSorting = false;
        // this.toaster.success("Order saved successfully!");
      }, (err) => {
        this.savingSorting = false;
        // this.toaster.error(err.error.message);
      })
    }
  }
}
