// import { ɵɵNgModuleDefWithMeta } from "@angular/core";
import { ItemDetailObject } from "./item.model";

export class MerchantDetails {
  id: string
  address: string;
  banner: string;
  logo: string;
  marketStatus: boolean;
  specialInstructions: boolean;
  phone: string
  hours: string
  day: string
  storefrontStatus: boolean
  merchantTaxRate: number = 0;
  merchantName: string;
  gmb: GoogleMyBusinessProfile;
  pickUptime: number
  cardfeeType: number
  processingfeeFixed: string
  processingfeeRate: string
  has_address_error: number = 0
  businessAddressLine: string
  businessAddressCity: string
  businessAddressState: string
  zip:number
  cusines:string
  menuName: string;
  openingHours: any[] = []
  timezone: string
  closeforbusinessflag:number = 0
}

export class GoogleMyBusinessProfile {
  averageRating: number = 0;
  reviews: any[] = []
  totalReviewCount: number = 0
}

export class MenuStoreFrontCategories {
  category: string;
  items: ItemDetailObject[] = [];
}
export class items {
  id: string = '';
  itemName: string = ''
}


export class StoreFrontPromos {
  promo: string = ''
  description: string = ''
  promoDiscount: number = 0
  status: number = 0
  promoText: string = ''
  source: string = ''
  print: number = 0
  promoId: string = '';
  minPurchaseAmount: number = 0
  maxDiscount: number = 0
  promostartdate: string = ''
  promoenddate: string = ''
  ishappyhourenabled: number = 0
  promoType: number = 1
  primaryitem: string = ''
  primaryitemquantity: number = 0
  freeitem: string = ''
  freeitemquantity: number = 0
  happyhourstarttime: string = ''
  happyhourendtime: string = ''
  redirecturl?: string = ''
  days = []
  roi: number
  sale: number
  cost: number
  count: number

}
export class StoreFrontQR {
  qrId: string = ''
  source: string = ''
  marchantId: string = ''

}
