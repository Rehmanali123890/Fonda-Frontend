import { SecurityService } from './security.service';
import { ItemDetailObject } from './../Models/item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { ItemDto } from '../Models/item.model';
import { AddEditProductDto } from '../Models/Cat_Product.model';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': environment.apiKey,
    'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('securityData')).token,

  }),
};

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  basePath = environment.baseUrl;
  constructor(private http: HttpClient, private securityService: SecurityService) { }

  // public addAddonsToProduct(merchantid: string, itemID: string, obj: ItemDto) {
  //   return this.http.post(`${this.basePath}merchant/${encodeURIComponent(String(merchantid))}/item/${encodeURIComponent(String(itemID))}/linkaddons`,obj , httpOptions);
  // }
  // public addCateogoriesToItem(merchantid: string, itemID: string, tObj: ItemDto) {
  // return this.http.post(`${this.basePath}merchant/${encodeURIComponent(String(merchantid))}/item/${encodeURIComponent(String(itemID))}/linkcategory`, tObj , httpOptions);
  // }
  public createMerchantItem(merchantid: string, tObj: AddEditProductDto) {
    return this.http.post(`${this.basePath}merchant/${encodeURIComponent(String(merchantid))}/item`, tObj, httpOptions);
  }
  public deleteMerchantitem(merchantid: string, itemID: string) {
    return this.http.delete<any>(`${this.basePath}merchant/${encodeURIComponent(String(merchantid))}/item/${encodeURIComponent(String(itemID))}?token=${this.securityService.securityObject.token}`, httpOptions);
  }
  public getMerchantitem(merchantid: string, itemID: string) {
    return this.http.get<ItemDetailObject>(`${this.basePath}merchant/${encodeURIComponent(String(merchantid))}/item/${encodeURIComponent(String(itemID))}?token=${this.securityService.securityObject.token}&merchantid=${merchantid}&itemID=${itemID}`, httpOptions);
  }
  public getMerchantitems(merchantid: string, token: string, limit?: number, from?: number, itemName?: string) {
    return this.http.get<Array<ItemDto>>(`${this.basePath}merchant/${encodeURIComponent(String(merchantid))}/items?limit=750&token=${token}`, httpOptions)
  };
  // public removeAddonsFromProduct(merchantid: string, itemID: string , tObj: ItemDto) {
  // return this.http.post<any>(`${this.basePath}merchant/${encodeURIComponent(String(merchantid))}/item/${encodeURIComponent(String(itemID))}/unlinkaddons`, tObj , httpOptions);
  // }
  // public removeCateogoriesFromItem(merchantid: string, itemID: string, tObj: ItemDto) {
  //   return this.http.post<any>(`${this.basePath}merchant/${encodeURIComponent(String(merchantid))}/item/${encodeURIComponent(String(itemID))}/unlinkcategory`, tObj , httpOptions);
  // }
  public updateMerchantitem(merchantid: string, itemID: string, tObj: AddEditProductDto) {
    return this.http.put<any>(`${this.basePath}merchant/${encodeURIComponent(String(merchantid))}/item/${encodeURIComponent(String(itemID))}`, tObj, httpOptions);
  }
  public updateItemCategories(merchantid: string, itemID: string, ids: string[]) {
    const makeObj = [];
    ids.forEach(item => {
      makeObj.push({ categoryID: item })
    })
    const tObj = {
      "token": this.securityService.securityObject.token,
      "categories": makeObj
    }
    return this.http.post<any>(`${this.basePath}merchant/${merchantid}/item/${itemID}/updatecategories`, tObj, httpOptions);
  }
  public UpdateCategoryItems(merchantid: string, categoryId: string, obj) {
    return this.http.post<any>(`${this.basePath}merchant/${merchantid}/category/${categoryId}/item`, obj, httpOptions);
  }
  public UpdateItemsCategorywithList(merchantid: string, itemId: string, obj) {
    return this.http.post<any>(`${this.basePath}merchant/${merchantid}/item/${itemId}/category`, obj, httpOptions);
  }
  public updateItemIddons(merchantid: string, itemID: string, data) {

    return this.http.post<any>(`${this.basePath}merchant/${merchantid}/item/${itemID}/addon`, data, httpOptions);
  }
  public updateItemAddonOptions(merchantid: string, addonID: string, obj) {
    return this.http.post<any>(`${this.basePath}merchant/${merchantid}/addon/${addonID}/option`, obj, httpOptions);
  }

  public updateMerchantitemImage(merchantid: string, itemID: string, fileToUpload: File, token: string) {
    const endpoint = `${this.basePath}merchant/${encodeURIComponent(String(merchantid))}/item/${encodeURIComponent(String(itemID))}/image`;
    let formData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    formData.append('token', token);

    return this.http.put<any>(endpoint, formData, {
      headers: new HttpHeaders({
        'x-api-key': environment.apiKey,
      }),
    });
  }

  public deleteMerchantitemImage(merchantid: string, itemID: string, token: string) {
    const endpoint = `${this.basePath}merchant/${encodeURIComponent(String(merchantid))}/item/${encodeURIComponent(String(itemID))}/image?token=${token}`;
    return this.http.delete<any>(endpoint, httpOptions);
  }

  public createCuisineOption(cuisineName: string, cuisineType: string) {
    const tObj = {
      "configValue": cuisineName,
      "configType": cuisineType
    }
    return this.http.post(`${this.basePath}addConfigOption`, tObj, httpOptions);
  }
  public getCuisineTypeList(cuisineType: string) {
    return this.http.get(`${this.basePath}getConfigOption?configType=${cuisineType}`, httpOptions);
  }

  // createContrat(fileToUpload: File, newContrat: Contrat): Observable<boolean> { 
  //   let headers = new Headers(); 
  //   const endpoint = Api.getUrl(Api.URLS.createContrat)); 
  //   const formData: FormData = new FormData(); 
  //   formData.append('fileKey', fileToUpload, FileToUpload.name); 
  //   let body= newContrat.gup(this.auth.getCurrentUser().token); 
  //   return this.http.post(endpoint, formData, body).map(() => { return true; }) }

  saveItemHours(merchantId: string, itemId: string, hours: Object) {
    return this.http.post(
      this.basePath +
      `merchant/${merchantId}/item/${itemId}/service-availability`,
      {
        serviceAvailability: hours,
      },
      httpOptions
    );
  }
  getItemHours(merchantId: string, itemId: string) {
    return this.http.get<any>(
      `${this.basePath}merchant/${merchantId}/item/${itemId}/service-availability`,
      httpOptions
    );
  }
}
