import { SecurityService } from './security.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import {
  ActivityLogsTypes,
  AddEditOpeningHoursDto,
  AssignMerchantUserDto, AuditLogsTypes, EditLoaltyPoints, ErrorLogsTypes,
  FlipDishDetails,
  MerchantListDto,
  MerchantStatusEnum,
  MerchantUserListDto,
  MerchatMenu,
  SubscriptionType,
  TorderTransaction,
} from '../Models/merchant.model';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

var httpOptions = {};
var httpOptionsWithFile = {};
const storeFronthttpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': environment.apiKey,
    'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
    // Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('securityData')).token,

  }),
};

@Injectable({
  providedIn: 'root',
})
export class MerchantService {
  baseUrl = environment.baseUrl;
  Ecsbaseurl = environment.Ecsbaseurl;
  fileUploadUrl = environment.fileUploadUrl;
  constructor(
    private http: HttpClient,
    private securityService: SecurityService
  ) {
    this.securityService.getToken().subscribe(securityObject => {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-api-key': environment.apiKey,
          'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
          Authorization: securityObject.token ? `Bearer ${securityObject.token}` : 'Bearer ' + JSON.parse(localStorage.getItem('securityData')).token
        })
      };
      httpOptionsWithFile = {
        headers: new HttpHeaders({
          // 'Content-Type': 'multipart/form-data',
          'x-api-key': environment.apiKey,
          'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
          Authorization: securityObject.token ? `Bearer ${securityObject.token}` : 'Bearer ' + JSON.parse(localStorage.getItem('securityData')).token
        }),
      };

    });
  }
  initializeHeader(securityObject) {
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': environment.apiKey,
        // 'CorrelationId': 'sasasa',
        'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
        Authorization: securityObject.token ? `Bearer ${securityObject.token}` : 'Bearer ' + JSON.parse(localStorage.getItem('securityData')).token
      })
    };
    httpOptionsWithFile = {
      headers: new HttpHeaders({
        // 'Content-Type': 'multipart/form-data',
        'x-api-key': environment.apiKey,
        'CorrelationId': (Math.round(+new Date() / 1000)).toString(),
        Authorization: securityObject.token ? `Bearer ${securityObject.token}` : 'Bearer ' + JSON.parse(localStorage.getItem('securityData')).token
      }),
    };
  }
  GetMerchants(
    token: string,
    merchantName?: string,
    merchantStatus?: MerchantStatusEnum,
    merchantEmail?: string,
  ) {
    let qStr = '';
    if (merchantName) {
      qStr += `&merchantName=${merchantName}`;
    }
    if (merchantStatus) {
      qStr += `&merchantStatus=${merchantStatus}`;
    }
    if (merchantEmail) {
      qStr += `&merchantEmail=${merchantEmail}`;
    }
    return this.http.get(
      this.baseUrl + `merchants?limit=1000&token=${token}${qStr}`,
      httpOptions
    );
  }
  GetMerchantsList(
    token: string,
    merchantName?: string,
    merchantStatus?: MerchantStatusEnum,
    merchantEmail?: string,
    offset: number = 0,
    onBoardingCompleted?: number,
    marketStatus?: boolean
  ) {
    let qStr = '';
    if (merchantName) {
      qStr += `&merchantName=${merchantName}`;
    }
    if (merchantStatus) {
      qStr += `&merchantStatus=${merchantStatus}`;
    }
    if (marketStatus) {
      qStr += `&marketStatus=${marketStatus}`;
    }
    if (onBoardingCompleted) {
      qStr += `&onBoardingCompleted=${onBoardingCompleted}`;
    }
    if (merchantEmail) {
      qStr += `&merchantEmail=${merchantEmail}`;
    }
    return this.http.get(
      this.baseUrl + `merchants?from=${offset}&limit=200&token=${token}${qStr}`,
      httpOptions
    );
  }
  GetMerchantsListPost(
    token: string, merchantName?: string, merchantStatus?: MerchantStatusEnum, merchantEmail?: string, offset: number = 0,
    onBoardingCompleted?: number, marketStatus?: boolean, obj: any = {}, GMBConnFilter?: string, GMBVerifyFilter?: string
    , DDstreamConnFilter?: number, GHstreamConnFilter?: number
  ) {
    let qStr = '';
    if (merchantName) {
      qStr += `&merchantName=${merchantName}`;
    }
    if (merchantStatus) {
      qStr += `&merchantStatus=${merchantStatus}`;
    }
    if (marketStatus) {
      qStr += `&marketStatus=${marketStatus}`;
    }
    if (onBoardingCompleted) {
      qStr += `&onBoardingCompleted=${onBoardingCompleted}`;
    }
    if (merchantEmail) {
      qStr += `&merchantEmail=${merchantEmail}`;
    }
    if (GMBConnFilter) {
      qStr += `&GMBConnFilter=${GMBConnFilter}`;
    }
    if (GMBVerifyFilter) {
      qStr += `&GMBVerifyFilter=${GMBVerifyFilter}`;
    }
    if (DDstreamConnFilter) {
      qStr += `&DDstreamConnFilter=${DDstreamConnFilter}`;
    }
    if (GHstreamConnFilter) {
      qStr += `&GHstreamConnFilter=${GHstreamConnFilter}`;
    }
    return this.http.post(
      this.baseUrl + `merchants?from=${offset}&limit=200&token=${token}${qStr}`,
      obj,
      httpOptions
    );
  }

  GetMerchantsMenus(token: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/menus?&token=${token}&limit=1000`,
      httpOptions
    );
  }

  GetMerchantsNewMenus(token: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/new-menus?&token=${token}`,
      httpOptions
    );
  }

  GetVirtualRestaurants(token: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/virtual-merchant?&token=${token}`,
      httpOptions
    );
  }

  GetMerchantsMenuById(token: string, merchantId: string, menuId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/menu/${menuId}?&token=${token}`,
      httpOptions
    );
  }
  updateMenuCategories(merchantId: string, menuId: string, obj: any) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/menu/${menuId}/category`,
      obj,
      httpOptions
    );
  }
  updateMenuCategoriesMappings(merchantId: string, categoryId: string, obj: any, token: string) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/menu/${categoryId}/category-mapping?${token}`,
      obj,
      httpOptions
    );
  }
  updateMerchantMenuPlatfromMapping(
    token: string,
    obj: any,
    merchantId: string,
    menuId: string
  ) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/menu/${menuId}/mappings`,
      obj,
      httpOptions
    );
  }

  updateMerchantVirtualMenu(
    token: string,
    vMerchantId: string,
    merchantId: string,
    menuId: string,
    obj: any
  ) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/virtual-merchant/${vMerchantId}/menu/${menuId}/mappings`,
      obj,
      httpOptions
    );
  }

  removeMerchantMenuPlatform(
    platfromMappingId: any,
    merchantId: string,
    menuId: string
  ) {
    return this.http.delete(
      this.baseUrl +
      `merchant/${merchantId}/menu/${menuId}/mappings/${platfromMappingId}`,

      httpOptions
    );
  }
  updateMerchantMenu(
    token: string,
    obj: any,
    merchantId: string,
    menuId: string
  ) {
    const mData = {
      token: token,
      menu: obj,
    };
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/menu/${menuId}`,
      mData,
      httpOptions
    );
  }
  CreateMerchantMenu(token: string, obj: any, merchantId: string) {
    const mData = {
      token: token,
      menu: obj,
    };
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/menu`,
      mData,
      httpOptions
    );
  }

  deleteMerchantMenu(token: string, merchantId: string, menuId: string) {
    return this.http.delete(
      this.baseUrl + `merchant/${merchantId}/menu/${menuId}?&token=${token}`,
      httpOptions
    );
  }
  GetPdfDetial(menuId: string) {
    const httpOptionsFile = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': environment.apiKey
      })
    };
    return this.http.get(this.baseUrl + `merchant/downloadmenu/${menuId}`, httpOptionsFile)
  }
  GetCsvDetails(merchantId: string, menuId: string) {
    const httpOptionsFile = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': environment.apiKey
      })
    };
    return this.http.post(this.baseUrl + `merchant/${merchantId}/menu/${menuId}/download-csv`, httpOptionsFile, httpOptions)
  }

  AddMerchant(token: string, obj: MerchantListDto) {
    const mData = {
      token: token,
      merchant: obj,
    };
    return this.http.post(this.baseUrl + `merchant`, mData, httpOptions);
  }
  UpdateMerchant(token: string, merchantId: string, obj: MerchantListDto | any) {
    const mData = {
      token: token,
      merchant: obj,
    };
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}`,
      mData,
      httpOptions
    );
  }

  UpdateStorefrontSlug(token: string, merchantId: string, slug: any) {
    const mData = {
      token: token,
      slug: slug,
    };
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/storefront-slug-change`,
      mData,
      httpOptions
    );
  }

  UpdateStorefrontStatus(token: string, merchantId: string, status: any) {
    const mData = {
      token: token,
      storefrontStatus: status,
    };
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/storefront-status-change`,
      mData,
      httpOptions
    );
  }

  UpdateMerchantSetting(token: string, merchantId: string, obj: MerchantListDto | any) {
    const mData = {
      token: token,
      merchant: obj,
    };
    return this.http.put(
      this.baseUrl + `merchant-settings/${merchantId}`,
      mData,
      httpOptions
    );
  }
  UpdateMerchantAccountDetail(token: string, merchantId: string, obj: MerchantListDto | any) {
    const mData = {
      token: token,
      merchant: obj,
    };
    return this.http.put(
      this.baseUrl + `merchant-account/${merchantId}`,
      mData,
      httpOptions
    );
  }
  GetMerchantAccountDetail(token: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant-account-detail/${merchantId}?&token=${token}`,
      httpOptions
    );
  }

  getTransactionSummaryReport(merchantId: string, startDate: string, endDate: string, platform: string, payout_id: string | null = null) {
    const mData = {
      startDate: startDate,
      endDate: endDate,
      platform: platform,
      payout_id: payout_id
    };
    return this.http.post(
      this.Ecsbaseurl + `download-transaction-summary-report/${merchantId}`,
      mData,
      {
        responseType: 'blob', // This ensures binary data is expected
        headers: { 'Content-Type': 'application/json' }
      }

    );
  }

  OpenConnectAccount(token: string, merchantId: string) {
    const mData = {
      token: token
    };
    return this.http.put(
      this.baseUrl + `merchant-connect-stripe/${merchantId}`,
      mData,
      httpOptions
    );
  }
  UpdateMerchantBusinessInfo(token: string, merchantId: string, obj: MerchantListDto) {
    const mData = {
      token: token,
      merchant: obj,
    };
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/business-info`,
      mData,
      httpOptions
    );
  }

  saveMerchantOnBoardingInfo(obj: MerchantListDto) {

    const mData = {
      merchant: obj
    };
    return this.http.post(
      this.baseUrl + `onboardmerchant`,
      mData,
      httpOptions
    );
  }

  UpdateMerchantSubscription(merchantId: string, obj: any) {
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/subscription`,
      obj,
      httpOptions
    );
  }
  WaiveOffSubscritption(merchantId: string, waiveoffId: number, explaination: string,) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/subscription/${waiveoffId}/changestatus`,
      {
        "remarks": explaination,
        "action": "waiveoff"
      },
      httpOptions
    );
  }
  MarkPaySubscritption(merchantId: string, waiveoffId: number, explaination: string,) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/subscription/${waiveoffId}/changestatus`,
      {
        "remarks": explaination,
        "action": "markPay"
      },
      httpOptions
    );
  }
  SaveSplitSubscription(merchantId: string, splitId: number, SubscriptionSplitList) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/subscription/${splitId}/splitSubscriptionAmount`,
      {
        "SubscriptionSplitList": SubscriptionSplitList
      },
      httpOptions
    );
  }
  AddMerchantHourInfo(merchantId: string, obj: AddEditOpeningHoursDto) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/openingHour`,
      obj,
      httpOptions
    );
  }
  EditMerchantHourInfo(merchantId: string, obj: AddEditOpeningHoursDto) {
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/openingHour/${obj.openinghour.id}`,
      obj,
      httpOptions
    );
  }
  getPayoutCalculation(merchantId: string, obj: any) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/financials/create-payout-report`,
      obj,
      httpOptions
    );
  }
  getfinancepayout(merchantId: string, obj: any) {
    return this.http.post(
      this.baseUrl + `finance-payout/${merchantId}`,
      obj,
      httpOptions
    );
  }
  generatePayoutCalculationBulk(obj: any) {
    return this.http.post(
      this.baseUrl + `merchants/financials/create-bulk-payout-report`,
      obj,
      httpOptions
    );
  }
  generateNewPayoutCalculationBulk(obj: any) {
    return this.http.post(
      this.baseUrl + `merchants/financials/create-new-bulk-payout-report`,
      obj,
      httpOptions
    );
  }
  getPayoutCalculationBulk() {
    return this.http.get(
      this.baseUrl + `merchants/financials/bulk-payout`,
      httpOptions
    );
  }
  getNewPayoutCalculationBulk() {
    return this.http.get(
      this.baseUrl + `merchants/financials/new-bulk-payout`,
      httpOptions
    );
  }
  DeleteMerchantHourInfo(merchantId: string, obj: AddEditOpeningHoursDto) {
    return this.http.delete(
      this.baseUrl +
      `merchant/${merchantId}/openingHour/${obj.openinghour.id}?token=${obj.token}`,
      httpOptions
    );
  }
  GetMerchantTransfers(merchantId: string) {

    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/payouts`,
      httpOptions
    );
  }
  GetFinanceMerchantTransfers(merchantId: string) {

    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/finance-payouts`,
      httpOptions
    );
  }
  GetMerchantHoursInfo(token: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/openingHours?token=${token}`,
      httpOptions
    );
  }
  GetMerchantById(token: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}?limit=500&token=${token}`,
      httpOptions
    );
  }
  GetDocs(token: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant-document?token=${token}&merchantid=${merchantId}`,
      httpOptions
    );
  }
  DelDocs(token: string, merchantId: string, documentid: string) {
    return this.http.delete(
      this.baseUrl + `merchant-document-delete?token=${token}&merchantid=${merchantId}&documentid=${documentid}`,
      httpOptions
    );
  }
  uploadDOc(token: string, fileToUpload: File, terms_data: any) {
    let formData = new FormData();
    formData.append('document', fileToUpload, fileToUpload.name);
    formData.append('terms_data', JSON.stringify(terms_data));
    return this.http.post(
      this.baseUrl + `merchant-document-upload?token=${token}`,
      formData,
      {
        headers: new HttpHeaders({
          'x-api-key': environment.apiKey,
        }),
      }
    );
  }
  uploadtransactionfile(token: string, fileToUpload: File, terms_data: any) {
    let formData = new FormData();
    formData.append('document', fileToUpload, fileToUpload.name);
    formData.append('terms_data', JSON.stringify(terms_data));
    return this.http.post(
      this.fileUploadUrl + `transaction-csv?token=${token}`,
      formData,
      {
        headers: new HttpHeaders({
          'x-api-key': environment.apiKey,
        }),
      }
    );
  }
  GetSendGridEmailSummary(token: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/sendgridemailsummary?limit=500&token=${token}`,
      httpOptions
    );
  }
  GetMerchantByIdwithoutToken(merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchantWithoutToken/${merchantId}?limit=500`,
      httpOptions
    );
  }
  GetMerchantPayoutById(payoutId: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/payout/${payoutId}`,
      httpOptions
    );
  }
  GetPayoutType(payoutId: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/payout-detail/${payoutId}`,
      httpOptions
    );
  }
  GetNewPayout(payoutId: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/new-payout/${payoutId}`,
      httpOptions
    );
  }
  GetFinanceMerchantPayoutById(payoutId: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/finance-payout/${payoutId}`,
      httpOptions
    );
  }
  transferToBank(payoutId: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/payouts-bank-transfer/${payoutId}`,
      httpOptions
    );
  }
  transferToBankFinancePayout(payoutId: string, merchantId: string) {
    return this.http.get(
      this.Ecsbaseurl + `merchant/${merchantId}/payouts-bank-transfer-finance-payout/${payoutId}`,
      httpOptions
    );
  }
  getBankDetails(merchantId: string, payoutid: string) {
    return this.http.get(
      this.baseUrl + `merchant-bank-detail/${merchantId}/payout/${payoutid}`,
      httpOptions
    );
  }
  getBankDetailsFinancePayout(merchantId: string, payoutid: string) {
    if (payoutid) {
      return this.http.get(
        this.baseUrl + `merchant-bank-detail/${merchantId}/finance-payout/${payoutid}`,
        httpOptions
      );
    }
    else {
      return this.http.get(
        this.baseUrl + `merchant-bank-detail/${merchantId}/finance-payout`,
        httpOptions
      );
    }
  }
  GetMerchantUsers(token: string, merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/users?limit=500&token=${token}`,
      httpOptions
    );
  }
  GetMerchantPlatformPasswords(merchantId: string) {
    return this.http.get(
      this.baseUrl + `merchant/${merchantId}/platform-credentials`,
      httpOptions
    );
  }
  sendEmailPayout(merchantId: string, payoutId: string, data: any) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/payout/${payoutId}/send_payout_report`, data,
      httpOptions
    );
  }
  sendEmailPayoutFinance(merchantId: string, payoutId: string, data: any) {
    return this.http.post(
      this.Ecsbaseurl + `merchant/${merchantId}/payout/${payoutId}/send_finance_payout_report`, data,
      httpOptions
    );
  }
  AssignMerchantUSer(merchantId: string, obj: AssignMerchantUserDto) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/user`,
      obj,
      httpOptions
    );
  }
  payoutdraft(merchantId: string, obj: any) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/draftpayout`,
      obj,
      httpOptions
    );
  }
  ReverMerchantAmountTransfer(merchantId: string, payoutId: string) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/payout/${payoutId}/revert`,
      {},
      httpOptions
    );
  }
  ReverMerchantAmountTransferFinance(merchantId: string, payoutId: string) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/finance-payout/${payoutId}/revert`,
      {},
      httpOptions
    );
  }
  UnAssignMerchantUSer(merchantId: string, obj: MerchantUserListDto) {
    return this.http.delete(
      this.baseUrl +
      `merchant/${merchantId}/user/${obj.id}?token=${this.securityService.securityObject.token}`,
      httpOptions
    );
  }
  saveAutoSyncSettings(merchantId: string, platfoemId: string, setting: string) {
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/platform/${platfoemId}/synctype`,
      {
        syncType: setting,
      },
      httpOptions
    );
  }
  saveMerchantPlatformPasswords(merchantId: string, passwords: any) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/platform-credentials`,
      passwords,
      httpOptions
    );
  }
  ConnectPlatformApi(merchantId: string, FlipDishDetailsObj: FlipDishDetails) {
    return this.http
      .post(
        `${this.baseUrl}platform/${merchantId}/connect_platform`,
        FlipDishDetailsObj,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.error}, body was: `,
        error.error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(error.error);
  }
  DisonnectPlatform(merchantId: string, platformId: string) {
    return this.http.delete(
      this.baseUrl +
      `merchant/${merchantId}/platform/${platformId}/disconnect_platform`,

      httpOptions
    );
  }


  GetConnectedPlatforms(merchantId: string) {
    return this.http.get<any>(
      `${this.baseUrl}platform/${merchantId}/get_platforms`,
      httpOptions
    );
  }
  TriggerManualSync(merchantId: string, platfromId: string, downloadMenu: number = 0) {

    // 0 means clover to fonda
    return this.http.post(
      this.baseUrl +
      `merchant/${merchantId}/platform/${platfromId}/manual-sync`,
      {
        downloadMenu: downloadMenu,
        token: this.securityService.securityObject.token,
      },
      httpOptions
    );
  }
  ToggleStreamStatus(merchantId: string, status: boolean) {

    // 0 means clover to fonda
    return this.http.post(
      this.baseUrl +
      `platform/${merchantId}//update_stream_status`,
      {
        'status': status ? 1 : 0
      },
      httpOptions
    );
  }
  sendReminderEmail(merchantId: string) {
    return this.http.post(
      this.baseUrl +
      `merchant/${merchantId}/reminderEmail`,
      {
        token: this.securityService.securityObject.token,
      },
      httpOptions
    );

  }
  ConnectUbereats(data: any, merchantId: string) {
    return this.http.post(
      this.baseUrl + `platform/${merchantId}/connect_platform_ubereats`,
      data,
      httpOptions
    );
  }
  ConnectClover(data: any, merchantId: string) {
    return this.http.post(
      this.baseUrl + `platform/${merchantId}/connect_platform_clover`,
      data,
      httpOptions
    );
  }
  ConnectSquare(data: any, merchantId: string) {
    return this.http.post(
      this.baseUrl + `platform/${merchantId}/connect_platform_square`,
      data,
      httpOptions
    );
  }
  postLocations(merchantId: string, locationId: string, data: any) {
    return this.http.post(this.baseUrl + `platform/${merchantId}/connect_platform_square/${locationId}`,
      data,
      httpOptions
    )
  }
  getMenuTemplateURL(merchantId: string, itemType?: number) {

    if (itemType) {
      console.log("itemtype is ", itemType)
      return this.http.get<any>(
        `${this.baseUrl}merchant/${merchantId}/items/generate-csv?itemType=${itemType}`,
        httpOptions
      )
    }
    else {
      return this.http.get<any>(
        `${this.baseUrl}merchant/${merchantId}/items/generate-csv`,
        httpOptions
      )
    }
  }
  getMenuHours(merchantId: string, menuId: string) {
    return this.http.get<any>(
      `${this.baseUrl}merchant/${merchantId}/menu/${menuId}/service-availability`,
      httpOptions
    );
  }

  getAllConnectedPlatforms(merchantId: string) {
    return this.http.get<any>(
      `${this.baseUrl}merchant/${merchantId}/menu/get-all-connected-platforms`,
      httpOptions
    );
  }
  uploadItemsCSV(merchantId: string, fileToUpload: File, selectedPlatforms: string) {
    const endpoint = `${this.baseUrl}merchant/${encodeURIComponent(String(merchantId))}/items/upload-pricemappings`;
    let formData = new FormData();
    formData.append('csvFile', fileToUpload, fileToUpload.name);
    formData.append('platformTypes', selectedPlatforms);
    return this.http.post<any>(endpoint, formData, httpOptionsWithFile);
  }

  saveMenuHours(merchantId: string, menuId: string, hours: Object) {
    return this.http.post(
      this.baseUrl +
      `merchant/${merchantId}/menu/${menuId}/service-availability`,
      {
        serviceAvailability: hours,
      },
      httpOptions
    );
  }

  financeData(merchantId: string, data: any) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/financials/reports`,
      data,
      httpOptions
    );
  }

  getPayoutSummaryReport(merchantId: string, startDate: string, endDate: string) {
    const mData = {
      startDate: startDate,
      endDate: endDate,
    };
    return this.http.post(
      this.Ecsbaseurl + `download-payout-summary-report/${merchantId}`,
      mData,
      {
        responseType: 'blob', // This ensures binary data is expected
        headers: { 'Content-Type': 'application/json' }
      }

    );
  }

  getNegativeAndNoOrderReport(merchantId: string, startDate: string, endDate: string, platform_type: string) {
    console.log("In the function of getting negative transaction report")
    const mData = {
      startDate: startDate,
      endDate: endDate,
      merchantId: merchantId,
      platform_type: platform_type
    };
    return this.http.post(
      this.Ecsbaseurl + `negative_no_order_report`,
      mData,
      {
        responseType: 'blob', // This ensures binary data is expected
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.securityService.securityObject.token
        },

      }

    );
  }



  sendSummaryEmail(merchantId: string, data: any) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/financials/merchant_consolidate_nonconsolidate_email`,
      data,
      httpOptions
    );
  }
  sendSummaryEmailFinancepayout(merchantId: string, data: any) {
    return this.http.post(
      this.Ecsbaseurl + `merchant/${merchantId}/merchant_finance_consolidate_nonconsolidate_email`,
      data,
      httpOptions
    );
  }
  sendSummaryEmailPayoutSummary(merchantId: string, data: any) {
    return this.http.post(
      this.Ecsbaseurl + `download-payout-summary-report/${merchantId}`,
      data,
      httpOptions
    );
  }
  sendSummaryEmail_bulk_payout(data: any) {
    return this.http.post(
      this.baseUrl + `merchant/financials/merchant_consolidate_nonconsolidate_email_bulk_payout`,
      data,
      httpOptions
    );
  }
  historyReport(merchantId: string, data: any) {
    return this.http.post(this.baseUrl + `merchant/${merchantId}/transfer-history`, data, httpOptions)
  }
  getOrderTransactionData(
    merchantId: string,
    startDate: string | Date,
    endDate: string | Date,
    customerName: string,
    shortOrderId: string,
    orderSource: string,
    orderExternalReferenceNumber: string,
    downloadReport: number,
    email: any
  ): Observable<TorderTransaction[]> {
    return this.http.get<TorderTransaction[]>(
      `${this.baseUrl}getOrderTransactionReport?merchantId=${merchantId}&startDate=${startDate}&endDate=${endDate}&email=${email}&customerName=${customerName}&shortOrderId=${shortOrderId}&orderSource=${orderSource}&orderExternalReference=${orderExternalReferenceNumber}&download=${downloadReport}`,
      {
        headers: new HttpHeaders({
          'X-API-KEY': environment.apiKey,
          Authorization: 'Bearer ' + this.securityService.securityObject.token,
        }),
      }
    );
  }

  getActivityLogsData(
    merchantId: string,
    userName: string,
    eventName: string,
    orderExternalRefrence: string,
    startDate: string | Date,
    endDate: string | Date,
    offset: number
  ): Observable<ActivityLogsTypes[]> {
    return this.http.get<ActivityLogsTypes[]>(
      `${this.baseUrl}activity-logs?limit=50&offset=${offset}&merchantId=${merchantId}&userName=${userName}&eventName=${eventName}&orderExternalReference=${orderExternalRefrence}&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: new HttpHeaders({
          'X-API-KEY': environment.apiKey,
          Authorization: 'Bearer ' + this.securityService.securityObject.token,
        }),
      }
    );
  }
  getOrderLogsData(

    orderExternalRefrence: string,

  ): Observable<ActivityLogsTypes[]> {
    return this.http.get<ActivityLogsTypes[]>(
      `${this.baseUrl}order-logs?orderExternalRefrence=${orderExternalRefrence}`,
      {
        headers: new HttpHeaders({
          'X-API-KEY': environment.apiKey,
          Authorization: 'Bearer ' + this.securityService.securityObject.token,
        }),
      }
    );
  }

  getErrorLogsData(
    merchantId: string,
    userName: string,
    errorSource: string,
    startDate: string | Date,
    endDate: string | Date,
    offset: number
  ): Observable<ErrorLogsTypes[]> {
    return this.http.get<ErrorLogsTypes[]>(
      `${this.baseUrl}error-logs?limit=10&offset=${offset}&merchantId=${merchantId}&userName=${userName}&errorSource=${errorSource}&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: new HttpHeaders({
          'X-API-KEY': environment.apiKey,
          Authorization: 'Bearer ' + this.securityService.securityObject.token,
        }),
      }
    );
  }

  marketStatusData(merchantId: string, data: any) {
    return this.http.put(`${this.baseUrl}merchant/${merchantId}/market-status`, data,
      httpOptions)
  }
  StreamPlatformStatusData(merchantId: string, data: any) {
    return this.http.put(`${this.baseUrl}merchant/${merchantId}/stream-platform-status`, data,
      httpOptions)
  }
  parserSetting(token, data: any) {
    return this.http.put(`${this.baseUrl}merchant/parser-setting?token=${token}`, data,
      httpOptions)
  }
  getparserSetting() {
    return this.http.get(`${this.baseUrl}merchant/parser-setting?`,
      httpOptions)
  }
  getSubscriptionData(merchantId: string) {
    return this.http.get<SubscriptionType[]>(`${this.baseUrl}merchant/${merchantId}/get-subscription-records`,
      {
        headers: new HttpHeaders({
          'X-API-KEY': environment.apiKey,
          Authorization: 'Bearer ' + this.securityService.securityObject.token,
        }),
      })
  }

  getAuditLogs(userId: string, userName: string, merchantId: string, eventName: string, startDate: string | Date, endDate: string | Date) {
    return this.http.get<AuditLogsTypes[]>(`${this.baseUrl}audit-logs?userId=${userId}&userName=${userName}&merchantId=${merchantId}&eventName=${eventName}&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: new HttpHeaders({
          'X-API-KEY': environment.apiKey,
          Authorization: 'Bearer ' + this.securityService.securityObject.token,
        }),
      })
  }
  getTreasuryLogs(userId: string, userName: string, merchantId: string, eventName: string, startDate: string | Date, endDate: string | Date) {
    return this.http.get<AuditLogsTypes[]>(`${this.baseUrl}financial-logs?userId=${userId}&userName=${userName}&merchantId=${merchantId}&eventName=${eventName}&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: new HttpHeaders({
          'X-API-KEY': environment.apiKey,
          Authorization: 'Bearer ' + this.securityService.securityObject.token,
        }),
      })
  }

  getAuditLogsDetail(merchantId: string, payoutId: string) {
    return this.http.get(`${this.baseUrl}merchant/${merchantId}/payout/${payoutId}`,
      {
        headers: new HttpHeaders({
          'X-API-KEY': environment.apiKey,
          Authorization: 'Bearer ' + this.securityService.securityObject.token,
        }),
      }
    )
  }

  addVirtualRestaurant(data: any, merchantId: string) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/virtual-merchant`,
      data,
      httpOptions
    );
  }
  editVirtualRestaurant(data: any, merchantId: string,) {
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/virtual-merchant/${data.id}`,
      data,
      httpOptions
    );
  }
  getVirtualRestaurants(merchantId: string) {
    return this.http.get<any>(
      `${this.baseUrl}merchant/${merchantId}/virtual-merchant`,
      httpOptions
    );
  }
  virtualRestaurantStatus(data: any, merchantId: string,) {
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/virtual-merchant/${data.id}/status`,
      data,
      httpOptions
    );
  }
  getEsperList() {
    return this.http.get<any>(
      `${this.baseUrl}merchants/get-esper-devices`,
      httpOptions
    );
  }

  sendSMS(data: any, merchantId: string) {
    return this.http.post(
      this.baseUrl + `merchant/${merchantId}/send-message-twilio`,
      data,
      httpOptions
    );
  }
  connectDisconnectEsperDevice(data: any, merchantId: string) {
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/esper-device-connection`,
      data,
      httpOptions
    );
  }
  sortMenuCategories(data: any, merchantId: string, menuId: string) {
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/menu/${menuId}/sort-categories`,
      data,
      httpOptions
    );
  }
  sortCategoryItems(data: any, merchantId: string, categoryId: string) {
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/category/${categoryId}/sort-items`,
      data,
      httpOptions
    );
  }
  sortItemAddons(data: any, merchantId: string, itemId: string) {
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/item/${itemId}/sort-addons`,
      data,
      httpOptions
    );
  }
  sortAddonOptions(data: any, merchantId: string, addonId: string) {
    return this.http.put(
      this.baseUrl + `merchant/${merchantId}/addon/${addonId}/sort-options`,
      data,
      httpOptions
    );
  }
  getAllPoints(merchantId: string) {
    return this.http.get<any>(this.baseUrl + `merchant/${merchantId}/getall-loyalty-points`, httpOptions)
  }
  postAddPoints(data: any) {
    return this.http.post(this.baseUrl + `merchant/add-remove-loyalty-points`, data, httpOptions)
  }
  editPoints(token: string, obj: any) {
    return this.http.post(this.baseUrl + `merchant/update-loyalty-points`, obj, httpOptions)
  }
  deletePoints(merchantId: string, pointId: string) {
    return this.http.delete(this.baseUrl + `merchant/${merchantId}/delete-loyalty-points/${pointId}`, httpOptions)
  }
  addPromoCode(token: string, merchantId: string, data: any) {
    return this.http.post(
      this.baseUrl + `storefront/addpromo/${merchantId}?token=${token}`,
      data,
      httpOptions
    );

  }
  editPromoCode(token: string, merchantId: string, data: any) {
    return this.http.post(
      this.baseUrl + `storefront/editpromo/${merchantId}?token=${token}`,
      data,
      httpOptions
    );

  }
  deletePromoCode(merchantId: string, data: any) {
    return this.http.post(
      this.baseUrl + `storefront/deletepromo/${merchantId}`,
      data,
      httpOptions
    );

  }
  getAllPromos(token: string, merchantId, filterStatus, filterStartdate, filterEnddate) {
    return this.http.get<any>(this.baseUrl + `storefront/getallpromo/${merchantId}?token=${token}&status=${filterStatus}&startdate=${filterStartdate}&enddate=${filterEnddate}`, httpOptions)
  }
  getSinglePromo(merchantId) {
    return this.http.get<any>(this.baseUrl + `storefront/getallpromo/${merchantId}?status=active&limit=1`, storeFronthttpOptions)
  }
  getStorefrontPromo(merchantId) {
    return this.http.get<any>(this.baseUrl + `storefront/getstorefrontpromo/${merchantId}`, storeFronthttpOptions)
  }
  ActiveInactiveMenu(merchantid: string, menuid: string, obj: any) {
    return this.http.put(this.baseUrl + `merchant/${merchantid}/menu/${menuid}/status`, obj, httpOptions);
  }
  getTopItems(merchantId: string) {
    return this.http.get<any>(this.baseUrl + `merchant/${merchantId}/get_top_items`, storeFronthttpOptions)
  }
}
