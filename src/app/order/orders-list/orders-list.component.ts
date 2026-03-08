import { AppUiService } from 'src/app/core/app-ui.service';
import { EventBusService, EventTypes } from './../../core/event-bus.service';
import { AppStateService } from './../../core/app-state.service';
import { ClonerService } from './../../core/DataServices/cloner.service';
import { AddonOptionDto } from './../../Models/Cat_Product.model';
import { ItemService } from './../../core/item.service';
import { CustomerDto } from './../../Models/customer.model';
import { FilterDataService } from './../../core/filter-data.service';
import { MerchantService } from './../../core/merchant.service';
import { CreateOrderAddon, CreateOrderAddonOptions, CreateOrderDto, CreateOrderitem, OrderCancellationReasons, OrderDetailDto, OrderRejectionReasons, OrdersListDto, OrderStatusEnum } from './../../Models/order.model';
import { OrdersService } from './../../core/orders.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from 'src/app/core/security.service';
import { UserService } from 'src/app/core/user.service';
import { UserDto, UserRoleEnum } from 'src/app/Models/user.model';
import { MerchantListDto } from 'src/app/Models/merchant.model';
import { CustomerService } from 'src/app/core/customer.service';
import { ItemDetailObject, ItemDto } from 'src/app/Models/item.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslocoService } from '@ngneat/transloco';

import * as moment from 'moment';

@UntilDestroy()
@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  userRoleType: UserRoleEnum;
  gettingOrders: boolean = true;
  OrdersList: OrdersListDto[] = [];
  userStatusEnum = OrderStatusEnum;
  userStatusEnumList = this.filterDataService.getEnumAsList(OrderStatusEnum);
  gettingMerchants: boolean;
  MerchantsList: MerchantListDto[] = [];
  selectedMerchantId: string;
  filterMerchantIds: string[] = ['-1'];
  selectedStatus: OrderStatusEnum = OrderStatusEnum.Pending;
  selectedStatusStr = '0,1,2,3,4,6';
  gettingOrderDetail: boolean;
  selectedOrderId: string;
  orderDetailObj = new OrderDetailDto();
  gettingCustomers: boolean;
  newCustomerView: boolean;
  CustomersList: CustomerDto[];
  addCustomerDto = new CustomerDto();
  createOrderObj = new CreateOrderDto();
  selectedItemForCreateOrder = new ItemDto();
  gettingProducts: boolean;
  itemsList: ItemDto[];
  gettingItemDetails: boolean;
  showaddonprices: boolean;
  selectedItemDetail = new ItemDetailObject();
  creatingneworder: boolean;
  selectedOrderStatus: OrderStatusEnum;
  updatingStatus: boolean;
  savingCustomer: boolean;
  myInterval: number;
  reason: string;
  explaination: string = '';
  orderCancellationReasons = OrderCancellationReasons;
  orderRejectionReasons = OrderRejectionReasons;
  enumKeyOrderCancellationReasons = [];
  enumKeyOrderRejectionReasons = [];


  quickSearhOpen: boolean = false;
  searchOrderId: string = "";
  searchcustomerName: string = "";
  searchSource: string = "";
  searchExternalReferenceNumber: string = "";
  gettingMerchantDetail: boolean;
  merchantDto = new MerchantListDto();
  marketStatus: boolean = false;
  regexPattern: string = '^[a-zA-Z0-9#\\- ]*$';

  constructor(private translocoService: TranslocoService, private toaster: ToastrService, private securityService: SecurityService, private router: Router, private customerService: CustomerService,
    private merchantService: MerchantService, private orderService: OrdersService, private appUi: AppUiService, private filterDataService: FilterDataService,
    private itemService: ItemService, private eventBus: EventBusService, private cloner: ClonerService, private appState: AppStateService) {
    this.enumKeyOrderCancellationReasons = Object.keys(this.orderCancellationReasons);
    this.enumKeyOrderRejectionReasons = Object.keys(this.orderRejectionReasons)
  }
  ngOnInit(): void {
    //this.enumKeys = Object.keys(this.orderCancellationReasons)
    this.userRoleType = this.securityService.securityObject.user.role;
    this.GetOrdersList();
    this.subscribeAppState();
    this.GetMerchantsList();
    this.suscribeNewOrders();
    this.GetMerchantDetail();
    this.getDimensionsByFilter();


  }

  GetMerchantDetail() {
    this.gettingMerchantDetail = true;
    this.merchantService.GetMerchantById(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;
      this.gettingMerchantDetail = false;
      this.marketStatus = this.merchantDto.marketStatus
    }, (err) => {
      this.gettingMerchantDetail = false;
      this.toaster.error(err.message);
    });
  }

  filterInput(event: Event) {
    console.log("rejex callls")
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Define a regex pattern that matches any character not allowed
    const invalidCharRegex = new RegExp(`[^a-zA-Z0-9#\\- ]`, 'g');

    // Replace characters that do not match the regex pattern
    input.value = value.replace(invalidCharRegex, '');
    this.searchExternalReferenceNumber = input.value;
  }

  suscribeNewOrders() {
    this.eventBus.on(EventTypes.RefreshOrderEvent).subscribe(data => {
      this.GetOrdersList();
    })
  }
  calculateTotalItems(items) {
    let total = 0;
    items.forEach(element => {
      total = total + element.quantity
    });
    return total
  }
  showRefundOptions: boolean = false
  refundAmount: number = 0
  partialRefund: number = 1
  resetPopupValues() {
    this.reason = '';
    this.explaination = ''
    this.showRefundOptions = false
    this.partialRefund = 1
    this.refundAmount = 0
  }
  subscribeAppState() {
    this.selectedMerchantId = this.appState.currentMerchant;
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.selectedMerchantId = merchntId;
      this.GetMerchantDetail()
      // this.toaster.success('Merchant changed')
      // this.GetOrdersList();
      //this.GetCustomersList();
      //this.GetMerchantitems();
    })
  }
  ValidateSelection() {
    if (this.filterMerchantIds?.length) {
      const otherSelected = this.filterMerchantIds.find(x => x !== '-1')
      this.filterMerchantIds = this.filterMerchantIds.filter(x => x !== '-1')

    }
    if (!this.filterMerchantIds || !this.filterMerchantIds?.length) {
      this.filterMerchantIds = ['-1'];
    }
    this.GetOrdersList();
  }
  clearSearch() {
    this.quickSearhOpen = false;
    this.searchExternalReferenceNumber = "";
    this.searchOrderId = "";
    this.searchSource = "";
    this.searchcustomerName = "";
    this.GetOrdersList()
  }
  PerformSearch() {
    this.GetOrdersList()
  }
  GetOrdersList() {
    this.gettingOrders = true;
    this.orderDetailObj = new OrderDetailDto();
    this.OrdersList = [];
    this.orderService.GetAllMerchantOrders(this.securityService.securityObject.token, this.filterMerchantIds, this.selectedStatusStr,
      this.searchExternalReferenceNumber, this.searchOrderId, this.searchSource, this.searchcustomerName).subscribe((data: OrdersListDto[]) => {
        this.OrdersList = data;
        // clearInterval(this.myInterval);
        if (this.OrdersList && this.OrdersList.length) {
          this.selectedOrderId = this.OrdersList[0].id;
          this.GetOrderDetail();
        }
        this.gettingOrders = false;
      }, (err) => {
        this.gettingOrders = false;
        this.toaster.error(err.message);
      })
  }
  CreateNewOrder(modal: ModalDirective) {
    this.creatingneworder = true;
    const newObj = this.cloner.deepClone<CreateOrderDto>(this.createOrderObj);
    // newObj.orderMerchantID = this.selectedMerchantId;
    newObj.orderDateTime = new Date();
    newObj.orderTotal = newObj.orderitems.reduce((a, b) => a + (b.Total || 0), 0);
    newObj.orderStatus = OrderStatusEnum['Pending'];
    // newObj.orderSource = 'Apptopus';
    newObj.orderSubTotal = newObj.orderTotal;
    newObj.orderDeliveryFee = 0;
    newObj.orderTax = 0;
    // newObj.orderExternalReference = 'Dashboard';
    newObj.orderitems.forEach(item => {
      console.log('aaaaaaa items',item)
      delete item['productName'];
      item.addons.forEach(addon => {
        addon.addonoptions.forEach(x => {
          delete x['name']
        })
      })
    })
    console.log('bbbbbb newobj',newObj)
    var mid = '';
    for (var aa of this.MerchantsList) {
      for (var bb of aa.virtualMerchants) {
        if (bb.id == newObj.orderMerchantID) {
          mid = aa.id;
        }

      }
      if (aa.id == newObj.orderMerchantID) {

        mid = aa.id;
      }
    }
    const taxPercent = +(this.MerchantsList.find(x => x.id === mid).merchantTaxRate) / 100;
    newObj.orderTax = +newObj.orderSubTotal * taxPercent;
    newObj.orderTotal = newObj.orderSubTotal + newObj.orderTax;
    console.log('cccccccc newobj',newObj)
    if(newObj.orderSource!='online_order'){
      newObj.orderitems.forEach(item => {
        // Initialize addon price
        let addonTotalPrice = 0;
        console.log('1st item--',item)
        // Calculate total addon price
        if (item.addons && item.addons.length > 0) {
            item.addons.forEach(addon => {
                addonTotalPrice += addon.addonoptions.reduce((total, option) => {
                    return total + (option.price || 0); // Assuming addon options have a 'price' field
                }, 0);
            });
        }
        console.log('1st addon-->',addonTotalPrice)
        // Update the item's cost
        item.cost += addonTotalPrice; 
        console.log('Cost after adding addon --->',item.cost) // Add the total addon price to the item's cost
      })
    }
    console.log('dddddddd newobj',newObj)
    this.orderService.CreateNewOrder(newObj).subscribe((data: any) => {
      if (data) {
        this.appUi.recentOrderId = data.id;
      }
      modal.hide();
      this.GetOrdersList();
      this.creatingneworder = false;
    }, (err) => {
      this.creatingneworder = false;
      this.toaster.error(err.error.message);
    })
  }
  
  GetCustomersList(merchantId?: string) {
    this.gettingCustomers = true;
    let mMerchant = this.selectedMerchantId;
    if (merchantId) {
      mMerchant = merchantId;
    }
    this.customerService.GetCustomers(this.securityService.securityObject.token, mMerchant).subscribe((data: CustomerDto[]) => {
      this.CustomersList = data;
      // if (this.CustomersList && this.CustomersList.length) {
      //   this.selectedOrderId = this.CustomersList[0].id;
      //   this.GetOrderDetail();
      // }
      this.gettingCustomers = false;
    }, (err) => {
      this.gettingCustomers = false;
      this.toaster.error(err.message);
    })
  }
  GetOrderDetail() {
    this.showaddonprices = true
    this.gettingOrderDetail = true;
    this.orderDetailObj = new OrderDetailDto();
    this.orderService.GetOrderDetail(this.securityService.securityObject.token, this.selectedMerchantId, this.selectedOrderId, 0).subscribe((data: OrderDetailDto) => {
      // this.OrdersList = data;
      this.orderDetailObj = data;
      console.log("this.orderDetailObj source", this.orderDetailObj.orderSource)
      console.log("this.orderDetailObj marker", this.orderDetailObj.orderMerchant.MarketPlacePriceStatus)
      if (this.orderDetailObj.orderSource == "grubhub" && this.orderDetailObj.orderMerchant.MarketPlacePriceStatus == 1) {
        this.showaddonprices = false
      }
      console.log("this.orderDetailObj ", this.orderDetailObj)
      let dt = moment(this.orderDetailObj.orderDateTime, 'YYYY-MM-DDTHH:mm:ss').format('MM-DD-YYYY HH:mm:ss')
      console.log("dt ", dt)
      this.orderDetailObj.orderDateTime = dt;
      // this.orderDetailObj.orderDateTime = this.orderDetailObj.orderDateTime.replace('T', ' ');
      this.gettingOrderDetail = false;
    }, (err) => {
      this.gettingOrderDetail = false;
      this.toaster.error(err.message);
    })
  }
  getDimensionsByFilter() {
    this.orderDetailObj = new OrderDetailDto();
    this.orderService.GetOrderDetail(this.securityService.securityObject.token, this.selectedMerchantId, this.selectedOrderId, 0).subscribe((data: OrderDetailDto) => {
      this.orderDetailObj = data;

    })
  }
  GetMerchantsList() {
    this.gettingMerchants = true;
    this.merchantService.GetMerchants(this.securityService.securityObject.token).subscribe((data: MerchantListDto[]) => {
      this.MerchantsList = data;

      if (this.MerchantsList && this.MerchantsList.length) {
        // this.selectedMerchantId = this.MerchantsList[0].id;
        //this.GetOrdersList();
        // this.MerchantsList = this.MerchantsList.filter(x => Number(x.marketStatus) === 1)
        this.GetCustomersList();
        this.GetMerchantitems();
      }
      this.gettingMerchants = false;
    }, (err) => {
      this.gettingMerchants = false;
      this.toaster.error(err.message);
    })
  }
  GetMerchantitems(merchantId?: string) {
    let mMerchant = this.selectedMerchantId;
    if (merchantId) {
      mMerchant = merchantId;
    }
    this.gettingProducts = true;
    this.itemsList = [];
    // this.catProductsService.GetitemsListByCategory(this.selectedMerchantId, this.selectedCategoryId ,this.securityService.securityObject.token).subscribe((data: ProductListDto[]) => {
    // this.catProductsService.GetAllitemsListByMerchant(this.selectedMerchantId, this.securityService.securityObject.token).subscribe((data: ProductListDto[]) => {
    this.itemService.getMerchantitems(mMerchant, this.securityService.securityObject.token).subscribe((data: ItemDto[]) => {
      this.itemsList = data.filter(x => x.itemStatus == 1);

      this.gettingProducts = false;
    }, (err) => {
      this.gettingProducts = false;
      this.toaster.error(err.message);
    })
  }
  itemSelectionChanged(modal: ModalDirective) {
    if (this.selectedItemForCreateOrder !== null) {
      if (this.selectedItemForCreateOrder.addONCount > 0) {
        modal.show();
        this.GetItemDetails();

        return;
      } else {
        this.addItemToCreateOrder();
      }
    }
    this.selectedItemForCreateOrder = new ItemDto()
  }
  addItemToCreateOrder() {

    const item = this.createOrderObj.orderitems.find(x => x.productid === this.selectedItemForCreateOrder.id);
    if (false) {
      this.toaster.info('Item already selected , please remove to Reselect!')
    } else {
      const newCreateOrderitem = new CreateOrderitem();
      newCreateOrderitem.productid = this.selectedItemForCreateOrder.id;
      newCreateOrderitem.cost = +this.selectedItemForCreateOrder.itemUnitPrice;
      newCreateOrderitem.qty = 1;
      newCreateOrderitem.Total = this.selectedItemForCreateOrder.itemUnitPrice * 1;
      newCreateOrderitem['productName'] = this.selectedItemForCreateOrder.itemName;
      newCreateOrderitem.addons = [];
      this.createOrderObj.orderitems.push(newCreateOrderitem);
      this.calculateOrderTotal();
    }
    this.calculateOrderTotal()
  }
  GetItemDetails() {
    this.gettingItemDetails = true;
    this.itemService.getMerchantitem(this.selectedMerchantId, this.selectedItemForCreateOrder.id).subscribe((data: ItemDetailObject) => {
      this.selectedItemDetail = data;
      // this.addOnsList = this.addOnsList.filter(x => +x.addonStatus === AddonStatusEnum.Active);
      // this.addEditAddOnObj = new AddEditAddonDto();
      this.gettingItemDetails = false;
    }, (err) => {
      this.gettingItemDetails = false;
      this.toaster.error(err.message);
    })
  }
  openOrdeerchangeMOdal(item: OrdersListDto, modal: ModalDirective) {
    this.selectedOrderStatus = null;
    this.selectedOrderId = item.id;
    this.selectedMerchantId = item.merchantid;
    modal.show();
  }
  updatestatus(modal: ModalDirective) {
    if (this.refundAmount >= this.orderDetailObj.orderTotal) {
      this.toaster.error('Partial refund amount should be less than the total order amount.')
      return
    }
    this.updatingStatus = true;
    this.orderService.updatestatus(this.selectedMerchantId, this.selectedOrderId,
      this.selectedOrderStatus, this.reason, this.explaination, this.partialRefund,
      this.refundAmount, this.orderDetailObj.remarks, this.orderDetailObj.orderSource).subscribe((data: ItemDetailObject) => {
        modal.hide();
        this.createRedeem.hide();
        this.OrdersList = this.OrdersList.filter(x => x.id !== this.selectedOrderId);
        this.orderDetailObj
        if (this.selectedOrderId === this.orderDetailObj.id) {
          if (this.OrdersList && this.OrdersList.length) {
            this.selectedOrderId = this.OrdersList[0].id;
            this.GetOrderDetail();
          } else {
            this.selectedOrderId = '';
            this.orderDetailObj = new OrderDetailDto();
          }
        }
        this.toaster.success('Order status updated successfully ')
        this.updatingStatus = false;
      }, (err) => {
        this.updatingStatus = false;
        this.toaster.error(err.error.message);
      })
  }
  SaveCustomerData() {
    if (this.savingCustomer) {
      return;
    }
    if (!this.addCustomerDto.firstName && !this.addCustomerDto.lastName) {
      this.toaster.warning('Please enter name');
    }
    this.savingCustomer = true;
    // this.addEditCustomerDto.CustomerStatus = CustomerStatusEnum.Active;
    this.addCustomerDto.merchantID = this.createOrderObj.orderMerchantID;
    // this.addCustomerDto.merchantID = this.selectedMerchantId;
    this.customerService.AddCustomer(this.securityService.securityObject.token, this.addCustomerDto).subscribe((data: CustomerDto) => {
      // this.CustomersList = data;
      this.toaster.success('Data saved successfully');
      this.CustomersList.push(data);
      this.createOrderObj.orderCustomer.id = data.id;
      this.newCustomerView = false;
      this.savingCustomer = false;
      this.addCustomerDto = new CustomerDto();
    }, (err) => {
      this.savingCustomer = false;
      this.toaster.error(err.message);
    })
  }
  optionQtyChanged(option: AddonOptionDto, stype: string) {
    if (!option['quantity']) {
      option['quantity'] = 0;
    }
    if (stype === 'minus' && option['quantity'] === 0) {
      return;
    }
    if (stype === 'plus') {
      ++option['quantity'];
    }
    if (stype === 'minus') {
      --option['quantity'];
    }
  }
  DeleteOrderItem(orderItem: CreateOrderitem, index: number) {
    if (window.confirm('This item will be deleted, Do you want to continue ?')) {
      this.createOrderObj.orderitems.splice(index, 1);
    }
    this.calculateOrderTotal();
  }
  SaveOrderSelection() {
    const item = this.createOrderObj.orderitems.find(x => x.productid === this.selectedItemForCreateOrder.id);
    if (false) {
      this.toaster.info('Item already selected , please remove to Reselect!');
    } else {
      const newCreateOrderitem = new CreateOrderitem();
      newCreateOrderitem.productid = this.selectedItemForCreateOrder.id;
      newCreateOrderitem.cost = +this.selectedItemForCreateOrder.itemUnitPrice;
      newCreateOrderitem.qty = 1;
      newCreateOrderitem['productName'] = this.selectedItemForCreateOrder.itemName;
      newCreateOrderitem.addons = [];
      let optionsTOtal = 0;
      this.selectedItemDetail.addons.forEach(addon => {
        const nAddOn = new CreateOrderAddon();
        nAddOn.addonID = addon.id;
        addon.addonOptions.forEach(option => {
          if (option['selected'] && option['selected'] === true) {
            const nAddOnOption = new CreateOrderAddonOptions();
            nAddOnOption.qty = 1;
            nAddOnOption.addonOptionID = option.id;
            nAddOnOption.cost = +option.addonOptionPrice;
            nAddOnOption.price = +option.addonOptionPrice;
            optionsTOtal = (+nAddOnOption.price) + optionsTOtal;
            // nAddOn.price = option['quantity'] * option.addonOptionPrice;
            nAddOnOption['name'] = option.addonOptionName;
            nAddOn.addonoptions.push(nAddOnOption);
          }
        })
        if (nAddOn && nAddOn.addonoptions && nAddOn.addonoptions.length) {
          newCreateOrderitem.addons.push(nAddOn);
        }
      });
      newCreateOrderitem.Total = (+this.selectedItemForCreateOrder.itemUnitPrice + optionsTOtal) * 1;
      this.createOrderObj.orderitems.push(newCreateOrderitem);
    }
    this.calculateOrderTotal();
    this.selectedItemForCreateOrder = new ItemDto()
  }
  calculateOrderTotal() {

    var id = '';

    for (var aa of this.MerchantsList) {
      for (var bb of aa.virtualMerchants) {
        if (bb.id == this.createOrderObj.orderMerchantID) {

          id = aa.id;
        }

      }
      if (aa.id == this.createOrderObj.orderMerchantID) {

        id = aa.id;
      }
    }



    this.createOrderObj.orderSubTotal = this.createOrderObj.orderitems.reduce((a, b) => a + (b.Total || 0), 0);
    const taxPercent = +(this.MerchantsList.find(x => x.id === id).merchantTaxRate) / 100;
    this.createOrderObj.orderTax = this.roundTo(+this.createOrderObj.orderSubTotal * taxPercent, 2);
    this.createOrderObj.orderTotal = this.roundTo(this.createOrderObj.orderSubTotal + this.createOrderObj.orderTax, 2)
  }
  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };
  itemQtyChanged(cOrderitem: CreateOrderitem, stype: string) {
    if (!cOrderitem.qty) {
      cOrderitem.qty = 0;
    }
    if (stype === 'minus' && cOrderitem.qty <= 1) {
      return;
    }
    if (stype === 'plus') {
      ++cOrderitem.qty;
    }
    if (stype === 'minus') {
      --cOrderitem.qty;
    }
    let optionsTOtal = 0;
    cOrderitem.addons.forEach(x => {
      const amount = x.addonoptions.map(item => +item.price).reduce((a, b) => a + (b || 0), 0);
      optionsTOtal = optionsTOtal + amount;
    })
    cOrderitem.Total = (+cOrderitem.cost + optionsTOtal) * cOrderitem.qty;
    this.calculateOrderTotal();
  }
  createOrderModalOpened() {
    this.createOrderObj = new CreateOrderDto();
    this.createOrderObj.orderMerchantID = this.selectedMerchantId
    this.selectedItemForCreateOrder = new ItemDto();
    this.selectedItemDetail = new ItemDetailObject();
  }
  AddOnOptionSelectionModalOpened() {
    this.selectedItemDetail = new ItemDetailObject();
  }
  @ViewChild('createOurPoints') createOurPoints: ModalDirective;
  @ViewChild('createRedeem') createRedeem: ModalDirective;
  openModalforCreateRedeem() {
    this.createRedeem.show()
  }
  openModalforCreatePoints() {
    this.createOurPoints.show()
  }

  closeModal() {
    this.createOurPoints.hide();
  }
  closeSecondModal() {
    this.createRedeem.hide();
  }

  addItemsPriceArrayByMultiplyingWithTheirQuantity(array: any[], itemCost: string): number {
    let totalPrice = 0;
    array.map(({ addon }) => addon?.addonOptions.map(({ price, quantity }) => {
      totalPrice += Number(price) * quantity
    }));
    return totalPrice + Number(itemCost);
  }
  multiplyTwoValues(n1: string | number, n2: string | number): number {
    return Number(n1) * Number(n2)
  }
  getStatusTranslation(orderstatus): string {
    // Assuming you have translations for each enum value in your language files
    let status = ''
    this.translocoService.selectTranslate('Orders.' + this.userStatusEnum[orderstatus]).subscribe(translation => {
      status = translation;
    });
    return status
  }
  gettypeTranslation(ordertype): string {
    // Assuming you have translations for each enum value in your language files
    let type = ''
    this.translocoService.selectTranslate('Orders.' + ordertype).subscribe(translation => {
      type = translation;
    });
    return type
  }
}
