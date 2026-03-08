import { SecurityService } from './security.service';
import { ItemDetailObject } from './../Models/item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { ItemDto } from '../Models/item.model';
import { AddEditProductDto } from '../Models/Cat_Product.model';
import { MerchantListDto } from '../Models/merchant.model';
import { StoreFrontPromos, StoreFrontQR } from '../Models/storeFront.model';
// import { ConsoleService } from '@ng-select/ng-select/lib/console.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': environment.apiKey,
    CorrelationId: Math.round(+new Date() / 1000).toString(),
    // Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('securityData')).token,
  }),
};

@Injectable({
  providedIn: 'root',
})
export class StorefrontService {
  baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient,
    private securityService: SecurityService
  ) { }
  public uploadMediaOnBoard(logo: File) {
    const endpoint = `${this.baseUrl}merchant/onboardnewmerchant-media`;
    let formData = new FormData();
    formData.append('media', logo, logo.name);

    return this.http.put<any>(endpoint, formData, {
      headers: new HttpHeaders({
        'x-api-key': environment.apiKey,
      }),
    });
  }
  public uploadBannerLogo(merchantid: string, logo: File) {
    const endpoint = `${this.baseUrl}merchant/${merchantid}/storefront-logo`;
    let formData = new FormData();
    formData.append('logo', logo, logo.name);

    return this.http.put<any>(endpoint, formData, {
      headers: new HttpHeaders({
        'x-api-key': environment.apiKey,
      }),
    });
  }
  public uploadBannerBanner(
    merchantid: string,
    banner: File,
    uploaded_url: string
  ) {
    const endpoint = `${this.baseUrl}merchant/${merchantid}/storefront-banner`;
    let formData = new FormData();
    formData.append('banner', banner.name);
    formData.append('uploaded_url', uploaded_url);

    return this.http.put<any>(endpoint, formData, {
      headers: new HttpHeaders({
        'x-api-key': environment.apiKey,
      }),
    });
  }
  getMerchantDetailBySlug(slug: string) {
    return this.http.get(this.baseUrl + `storefront/${slug}`, httpOptions);
  }
  getQRCodepdf(merchentid: string, promo = null) {
    const httpOptionsFile = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': environment.apiKey,
      }),
    };
    if (promo == null) {
      return this.http.get(
        this.baseUrl + `qrcodestorefront/${merchentid}`,
        httpOptionsFile
      );
    } else {
      return this.http.get(
        this.baseUrl + `qrcodestorefront/${merchentid}/${promo}`,
        httpOptionsFile
      );
    }
  }
  getMenu(slug: string) {
    return this.http.get(this.baseUrl + `storefront/menu/${slug}`, httpOptions);
  }
  CreateNewOrder(dObj: any, slug: string) {
    const pObj = {
      order: dObj,
    };
    return this.http.post(
      this.baseUrl + `storefront/order/${slug}`,
      pObj,
      httpOptions
    );
  }
  getPaymentIntent(amount: number, slug: string) {
    const pObj = {
      amount: amount,
    };
    return this.http.post(
      this.baseUrl + `storefront/stripeToken/${slug}`,
      pObj,
      httpOptions
    );
  }
  verifyAddress(dObj: any, slug: string) {
    return this.http.post(
      this.baseUrl + `storefront/deliveryfee/${slug}`,
      dObj,
      httpOptions
    );
  }
  onboardNewMerchant(obj: MerchantListDto | any) {
    const mData = {
      merchant: obj,
    };
    return this.http.post(
      this.baseUrl + `onboardnewmerchant`,
      mData,
      httpOptions
    );
  }
  uploadFilesToAWS(baseUrl: string, data: any, file: any) {
    let formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    formData.append('file', file);
    // formData = data
    return this.http.post<any>(baseUrl, formData, {});
  }
  getPromoDetail(slug: string, promo: string) {
    const encodedSlug = encodeURIComponent(slug);
    const encodedPromo = encodeURIComponent(promo);
    return this.http.get(
      
      this.baseUrl + `storefront/validatepromo/${encodedSlug}/${encodedPromo}`,
      httpOptions
    );
  }
  getpromoCheckDetail(slug: string, promo: string) {
    return this.http.get(
      this.baseUrl + `storefront/validatepromo/${slug}/${promo}`,
      httpOptions
    );
  }
  generatelogging(merchentid: string, mData: any) {
    return this.http.post(
      this.baseUrl + `storefront/GenerateStoreFrontLogs/${merchentid}`,
      mData,
      httpOptions
    );
  }

  addSourceQR(token: string, slug: string, sourceQRObj?: StoreFrontQR) {
    const pObj = {
      source: sourceQRObj.source,
    };
    return this.http.post(
      this.baseUrl + `storefront/addsourceqr/${slug}?token=${token}`,
      pObj,
      httpOptions
    );
  }

  getAllSource(token: string, slug: string) {
    return this.http.get(
      this.baseUrl + `storefront/getallsourceqr/${slug}?token=${token}`,
      httpOptions
    );
  }

  getSourceQRCodepdf(token: string, qrId = null) {
    const httpOptionsFile = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': environment.apiKey,
      }),
    };

    return this.http.get(
      this.baseUrl + `storefront/getsourceqr/${qrId}?token=${token}`,
      httpOptionsFile
    );
  }

  DeleteSource(token: string, qrId: string) {
    return this.http.get(
      this.baseUrl + `storefront/deletesourceqr/${qrId}&token=${token}`,
      httpOptions
    );
  }
}
