import { AddonDto, ProductDto, AddonDtoWithOptions } from './Cat_Product.model';

export class OrdersListDto {
	id: string;
	short_order_id: string = "";
	merchantName: string;
	merchantid: string;
	orderCustomerID: string;
	orderCustomerName: string;
	orderDateTime: string;
	orderDeliveryFee: string;
	orderExternalReference: string;
	orderSource: string;
	orderStatus: string;
	orderSubTotal: string;
	orderTax: string;
	orderTotal: string;
}
export enum OrderStatusEnum {
	'Pending' = 0,
	'Preparation' = 1,
	'Ready for collection' = 2,
	'Ready for delivery' = 3,
	'Dispatched' = 4,
	'Delivered' = 5,
	'Unable to deliver' = 6,
	'Completed' = 7,
	'Rejected' = 8,
	'Cancelled' = 9,
	'Pending acceptance' = 10,
	'Refund' = 11,
}
export enum OrderCancellationReasons {
	'OUT_OF_ITEMS' = "Items out of stock",
	'KITCHEN_CLOSED' = "Kitchen is closed",
	'CUSTOMER_CALLED_TO_CANCEL' = "customer called to cancel",
	'RESTAURANT_TOO_BUSY' = "Restaurant to busy",
	'CANNOT_COMPLETE_CUSTOMER_NOTE' = "Can not complete customer notes",
	'OTHER' = "Other",
}
export enum OrderRejectionReasons {
	'STORE_CLOSED' = "Store is closed",
	'POS_OFFLINE' = "POS is offline",
	'OTHER' = "Other",
}
export class OrderCustomer {
	id: string;
	customerName: string = '';
	customerEmail: string = ""
	customerPhone: string = '';
	customerAddress: string = '';
}

export class CreateOrderAddon {
	addonID: string;
	addonoptions = new Array<CreateOrderAddonOptions>();
}
export class CreateOrderAddonOptions {
	addonOptionID: string;
	price: number;
	qty: number;
	cost: number;
}
export class Item {
	id: string;
	itemName: string;
	itemDescription: string;
	itemUnitPrice: number;
	itemSKU: string;
	itemStatus: number;
	addonCount: number;
}

export class CreateOrderitem {
	promoId: string = ''
	productid: string;
	qty: number;
	cost: number;
	addons: CreateOrderAddon[];
	Total: number;
	productName: string = ''
	specialInstructions: string = ''

}

export class CreateOrderDto {
	orderDateTime: string | Date;
	orderSubTotal: number;

	orderDeliveryFee: number;
	orderTax: number;
	orderSubTotalMinusPromo: number;
	orderTotal: number;
	promoDiscount: number = 0;//discount amount
	orderExternalReference: number | string = '';
	orderSource: string;
	orderMerchantID: string;
	orderCustomer = new OrderCustomer();
	orderitems: CreateOrderitem[] = [];
	orderStatus: OrderStatusEnum;
	remarks: string;
	specialInstructions: string = '';
	orderAdjustments: number;
	errorcharges: number;
	orderVirtualMerchantID: string;
	orderType: string;
	chargeId: string = ""
	externalDeliveryId: string = "";
	tipAmount: number = 0;//doordash tip amount
	scheduled: number;
	scheduledTime: string = ""
	doorDashDeliveryStatus: string
	taxFees: number = 0
	deliveryFee: number = 0
	promoid: string = ""
	marketingCommunication: boolean
}



export class OrderDetailDto {
	id: string;
	merchantid: string
	orderDateTime: string;
	orderDateTimeFormatted: string;
	orderSubTotal: number;
	orderDeliveryFee: number;
	orderTax: number;
	orderTotal: number;
	refundAmount: number;
	doordashDeliveryFee: any;
	online_order: string;
	orderExternalReference: number;
	orderType: string;
	scheduledTime: string;
	orderSource: string;
	orderMerchant = new CreateOrderMerchantDto();
	orderCustomer = new OrderCustomer();
	orderitems: OrderDetailitem[] = [];
	orderStatus: number;
	remarks: string;
	specialInstructions: string = '';
	orderInBusyMode: boolean;
	orderPreparationTime: string;
	orderAdjustments: number;
	errorcharges: number;
	commission: number;
	commissionTax: number;
	marketplaceTax: number;
	processingFee: number;
	staffTips: number;
	subTotalWithStaffTips: number;
	locked: number = 0;
	promoDiscount: number = 0
	squareFee: number = 0;
	virtualMerchantName: string = '';
	usePromo: string = ''
}
export class OrderDetailitem {
	addons: OrderDetailAddon[];
	cost: string;
	item: Item;
	quantity: number;
	totalprice: string;
	specialInstructions: string = '';
}
export class DetailAddonOption {
	addonOptionID: string;
	price: string;
	quantity: number;
	totalprice?: any;
}
export class OrderDetailAddon {
	addonID: string;
	addonName: string;
	addonOptions: DetailAddonOption[] = [];
}
export class CreateOrderMerchantDto {
	id: string;
	merchantName: string;
	address: string = '';
	MarketPlacePriceStatus: number
}
