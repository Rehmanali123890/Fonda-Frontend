import { SecurityService } from 'src/app/core/security.service';
import { AddEditAddonDto, AddonOptionDto } from './../Models/Cat_Product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { AddCategoryDto, AddEditProductDto } from '../Models/Cat_Product.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': environment.apiKey,
    'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('securityData')).token,
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProductsCategoriesService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient, private securityService: SecurityService) { }
  GetProductsListByCategory(merchantid: string, categoryID: string, token: string) {
    return this.http.get(this.baseUrl + `merchant/${merchantid}/products?limit=500&token=${token}&merchantid=${merchantid}&categoryID=${categoryID}`, httpOptions);
  }

  GetAllProductsListByMerchant(merchantid: string, token: string) {
    return this.http.get(this.baseUrl + `merchant/${merchantid}/products?limit=500&token=${token}&merchantid=${merchantid}`, httpOptions);
  }
  GetCategoriesList(merchantid: string, token: string) {
    return this.http.get(this.baseUrl + `merchant/${merchantid}/categories?limit=500&token=${token}&merchantid=${merchantid}`, httpOptions);
  }
  GetCategoriesWithItems(merchantid: string, token: string, menuid?: string) {
    if (menuid) {
      return this.http.get(this.baseUrl + `merchant/${merchantid}/categoriesWithItems?limit=500&token=${token}&merchantid=${merchantid}&menuid=${menuid}`, httpOptions);
    }
    else {
      return this.http.get(this.baseUrl + `merchant/${merchantid}/categoriesWithItems?limit=500&token=${token}&merchantid=${merchantid}`, httpOptions);
    }
  }
  GetAddOnsByMerchantId(merchantid: string, token: string) {
    return this.http.get(this.baseUrl + `merchant/${merchantid}/addons?limit=500&token=${token}`, httpOptions);
  }
  GetAddOnsWIthOptionsByMerchantId(merchantid: string, token: string) {
    return this.http.get(this.baseUrl + `merchant/${merchantid}/addonsWithOptions?limit=500&token=${token}`, httpOptions);
  }
  GetAddOnsWIthoutOptionsByMerchantId(merchantid: string, token: string, withitemcount: number) {
    return this.http.get(this.baseUrl + `merchant/${merchantid}/addonsWithoutOptions?limit=500&token=${token}&withitemcount=${withitemcount}`, httpOptions);
  }
  GetOptionAddonsbyId(merchantid: string, token: string, optionid: string) {
    return this.http.get(this.baseUrl + `merchant/${merchantid}/option/${optionid}/getaddons`, httpOptions);
  }
  GetAddOnsByProductId(merchantid: string, productID: string, token: string) {
    return this.http.get(this.baseUrl + `merchant/${merchantid}/product/${productID}/addons?limit=500&token=${token}`, httpOptions);
  }
  GetAddOnOptions(merchantid: string, productID: string, addonID: string, token: string) {
    return this.http.get(this.baseUrl + `merchant/${merchantid}/product/${productID}/addon/${addonID}/addonoptions?token=${token}`, httpOptions);
  }
  GetAddOnById(merchantid: string, addonID: string, token: string) {
    return this.http.get(this.baseUrl + `merchant/${merchantid}/addon/${addonID}?token=${token}`, httpOptions);
  }
  AddCategoryForMerchant(merchantid: string, obj: AddCategoryDto) {
    return this.http.post(this.baseUrl + `merchant/${merchantid}/category`, obj, httpOptions);
  }
  EditCategoryForMerchant(merchantid: string, obj: AddCategoryDto) {
    return this.http.put(this.baseUrl + `merchant/${merchantid}/category/${obj.category.id}`, obj, httpOptions);
  }
  AddProductForMerchant(merchantid: string, obj: AddEditProductDto) {
    return this.http.post(this.baseUrl + `merchant/${merchantid}/product`, obj, httpOptions);
  }
  EditProductForMerchant(merchantid: string, obj: AddEditProductDto) {
    // return this.http.put(this.baseUrl + `merchant/${merchantid}/product/${obj.product.id}`, obj , httpOptions);
  }
  PostAddOnsForProduct(merchantid: string, productID: string, obj: AddEditAddonDto) {
    return this.http.post(this.baseUrl + `merchant/${merchantid}/addon`, obj, httpOptions);
  }

  EditAddOn(merchantid: string, productID: string, obj: AddEditAddonDto) {
    return this.http.put(this.baseUrl + `merchant/${merchantid}/addon/${obj.addon.id}`, obj, httpOptions);
  }
  usedAddonItems(merchantid: string, addonID: string) {
    return this.http.get(this.baseUrl + `merchant/${merchantid}/addon/${addonID}/usedAddonItems`, httpOptions);
  }

  AddEditOptionForAddOn(merchantid: string, productId: string, addonID: string, obj: AddonOptionDto) {
    const newObj = {
      token: this.securityService.securityObject.token,
      addonOption: obj
    }

    if (newObj.addonOption['id']) {
      return this.http.put(this.baseUrl + `merchant/${merchantid}/product/${productId}/addon/${addonID}/addonoption/${newObj.addonOption['id']}`, newObj, httpOptions);
    } else {
      return this.http.post(this.baseUrl + `merchant/${merchantid}/product/${productId}/addon/${addonID}/addonoption`, newObj, httpOptions);
    }
  }
  // EditAddOnOption(merchantid: string,productID: string, addOnId: string, addonOptionID: string, token: string, addOnObj: AddonOptionDto) {
  //   const nObj = {
  //     token: token,
  //     addonOption: addOnObj
  //   }
  //   return this.http.put(this.baseUrl + `merchant/${merchantid}/product/${productID}/addon/${addOnId}/addonoption/${addonOptionID}`, nObj , httpOptions);
  // }

  // UnLinkCategoryFromItem(merchantid: string, itemID: string, catId: string) {
  //   const cObj = {
  //     token: this.securityService.securityObject.token,
  //     categories: [
  //       { 'categoryID': catId }
  //     ]
  //   }
  //   return this.http.post(this.baseUrl + `merchant/${merchantid}/item/${itemID}/unlinkcategory`, cObj, httpOptions);
  // }
  // UnLinkAddonFromItem(merchantid: string, itemID: string, addOnId: string) {
  //   const cObj = {
  //     token: this.securityService.securityObject.token,
  //     addons: [
  //       { 'addonID': addOnId }
  //     ]
  //   }
  //   return this.http.post(this.baseUrl + `merchant/${merchantid}/item/${itemID}/unlinkaddons`, cObj, httpOptions);
  // }
  // UnLinkItemFromAddon(merchantid: string, itemID: string, addonID: string) {
  //   const cObj = {
  //     token: this.securityService.securityObject.token,
  //     AddonOptions: [
  //       { 'itemID': itemID }
  //     ]
  //   }
  //   return this.http.post(this.baseUrl + `merchant/${merchantid}/addon/${addonID}/unlinkitems`, cObj, httpOptions);
  // }
  GetCategorybyid(merchantid: string, categoryID: string, token: string) {
    return this.http.get(this.baseUrl + `merchant/${merchantid}/category/${categoryID}?token=${token}`, httpOptions);
  }
  GetCategoryMenubyid(merchantid: string, categoryID: string, token: string) {
    return this.http.get(this.baseUrl + `merchant/${merchantid}/category-menus/${categoryID}?token=${token}`, httpOptions);
  }
  DeleteCategory(merchantid: string, categoryID: string, token: string) {
    return this.http.delete(this.baseUrl + `merchant/${merchantid}/category/${categoryID}?token=${token}`, httpOptions);
  }
  DeleteProduct(merchantid: string, productID: string, token: string) {
    return this.http.delete(this.baseUrl + `merchant/${merchantid}/product/${productID}?token=${token}`, httpOptions);
  }
  DeleteAddOn(merchantid: string, productID: string, addOnId: string, token: string) {
    return this.http.delete(this.baseUrl + `merchant/${merchantid}/addon/${addOnId}?token=${token}`, httpOptions);
  }
  DeleteAddOnOption(merchantid: string, productID: string, addOnId: string, addonOptionID: string, token: string) {
    return this.http.delete(this.baseUrl + `merchant/${merchantid}/product/${productID}/addon/${addOnId}/addonoption/${addonOptionID}?token=${token}`, httpOptions);
  }
  DisableEnableCategory(merchantid: string, categoryId: string, obj: any) {
    return this.http.put(this.baseUrl + `merchant/${merchantid}/category/${categoryId}/status`, obj, httpOptions);
  }
  DisableEnableItem(merchantid: string, itemId: string, obj: any) {
    return this.http.put(this.baseUrl + `merchant/${merchantid}/item/${itemId}/status`, obj, httpOptions);
  }
  saveCategoryHours(merchantId: string, categoryId: string, hours: Object) {
    return this.http.post(
      this.baseUrl +
      `merchant/${merchantId}/category/${categoryId}/service-availability`,
      {
        serviceAvailability: hours,
      },
      httpOptions
    );
  }
  getCategoryHours(merchantId: string, categoryId: string) {
    return this.http.get<any>(
      `${this.baseUrl}merchant/${merchantId}/category/${categoryId}/service-availability`,
      httpOptions
    );
  }
}

