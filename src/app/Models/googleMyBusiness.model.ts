

export class Locations {
  accountId: string;
  locationId: string;
  title: string = '';
}
export class Location_obj {
  "locationId": string
  "accountId": string
  "title": string
  "address": Loc_Address
  "websiteUri": string
  "phoneNumber": string
  "category": string
  "profile": string
  "regularHours": []
  "menuHours": []
  "merchantId": string
  "status": number
}
export class Loc_Address {
  'regionCode': string
  'postalCode': string
  'state': string
  'town': string
  'addressLines': string[]
}
export class menu {
  'categories': categories[]
}
export class categories {
  'categoryName': string
  'items': item[]
}
export class item {
  "itemDescription": string
  "itemName": string
  "itemPrice": string
  "itemurl": string
}

export class image_obj {
  "locationAssociation": {
    "category": string
  }
  "googleUrl": string | ArrayBuffer | null = null
  "name": string
}

export class provider {
  "order_providers": []
  "links_id": []

}