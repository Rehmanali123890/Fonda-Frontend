import { CategoryDto, VirtualMerchantsDtO } from './Cat_Product.model';
import { UserRoleEnum, UserStatusEnum } from './user.model';

/// should be renamed asonly merchant Dto as using for add and edit also
export class MerchantListDto {

  id = '';
  merchantName = '';
  firstName = '';
  lastName = '';
  language = 'en';
  email = '';
  emailDistributionList = "";
  phone = '';
  address = '';
  merchantStatus: number;
  merchantlat = '';
  merchantlong = '';
  businessNumber = '';
  legalBusinessName = '';
  businessTaxId = '';
  merchantTaxRate: number;
  businessAddressLine = '';
  businessAddressCity = '';
  businessWebsite = "";
  businessAddressState = '';
  bankAccountNumber = '';
  bankAccountRoutingNumber = '';
  zip = '';
  timezone: any;
  onBoardingCompleted: boolean = false;
  pocdob = '';
  ein = '';
  autoAcceptOrder: boolean = false;
  orderDelayTime: number;
  preparationTime: number;
  busyMode: number = 1;
  googleReviewsReply: number;
  marketStatus: boolean = false;
  AutoWaivedStatus: boolean = false;
  subscriptionStartDate: string;
  onboardingdate: string;
  nextSubscriptionChargeDate: string;
  subscriptionAmount: number;
  subscriptionFrequency: number;
  subscriptionTrialPeriod: number = 0;
  subscriptionStatus: number = 0;
  staffTipsRate: number;
  ubereatsCommission: number;
  squareCommission: number;
  doordashCommission: number;
  grubhubCommission: number;
  flipdishCommission: number;
  RevenueProcessingFeePercent: number;
  DownTimeThreshold: number;
  RevenueProcessingThreshold: number;
  minimumLifetimeRevenue: number;
  stripeAccountId: string;
  openinghours: OpeninghourDto[];
  processingFeeFixed: number = 0.30;
  processingFeePercentage: number = 3.5;
  marketplaceTaxRate: number;
  parserStatus: number = 1;
  MarketPlacePriceStatus: number = 0;
  order_creation_permission: number = 1;
  notificationTextToggle: number = 0;
  notificationText: string = "";

  stripeTrasnferStatus: number
  openStripeConnectAccount: boolean = false;
  storeFront: storeFronturl[] = [];
  virtualMerchants: virtualMerchant[] = [];
  esperDeviceId: string = ""
  acceptSpecialInstructions: number = 0;
  esperDetailObj: EsperDevices;
  storefrontStatus: boolean = false;
  slug: string = ""
  banner: string = ""
  logo: string = ""
  cardfeeType: number;
  password: string = "";
  confirmPassword: string = "";
  trasuaryAuthPhone: string = ""
  trasuaryPhoneValid: boolean = false
  pauseTime_duration: string
  has_address_error: number = 0
  caller: string
  pauseStarted_datetime: string
  pause_reason: string
  googleconnectivity: string
  googleverified: string
  is_polling_enabled: number = 0
  polling_frequency: number = 0
  is_bogo: number = 0
  platform_price_flag: number = 0
  bank_edit_emails_access: string
}

export class Bankdto {
  bankName: string;
  accountHolderName: string;
  last4: string;
  merchantlast4: string;
}
export class EsperDevices {
  id: string = null;
  device_name: string = null;
  alias_name: string = null;
  state: number = 0;
  status: number = 0;

}

export class ParserSetting {
  id: number;
  parser1: number = 1;
  parser2: number = 0;

}
export class storeFronturl {
  url: string = ""
}

export class virtualMerchant {
  id: string = "";
  marketStatus: string = "";
  merchantId: string = "";
  status: string = "";
  virtualName: string = ""
}
export enum StripeAccountStatus {

  "Transfers capability of connected account is not enabled. Check Stripe dashboard for more details" = 0,
  "Stripe connect account is ok " = 1,
  "There is an error while fetching the account details from Stripe." = 2,
  "Transfers can not be made because stripe account is not connected." = 3
}
export enum MerchantSubscriptionPackege {
  'Monthly' = 1,
  'Bianual' = 6,
  'Quarterly' = 2,
  'Anualy' = 12,

}
export enum subscriptionTrialPeriod {
  'No Trial' = 0,
  'One Month' = 1,
  'Two Month' = 2,
  'Three Month' = 3,
  'Six Month' = 6,
  'One Year' = 12,
  'Lifetime Free' = 360, // means 30 years


}
export enum TranferTypeEnum {
  'To merchant connected account' = 1,
  'From treasury to external' = 2,
  'settle outside by fonda' = 3
}

export enum MerchantPlatformsEnum {
  'Apptopus' = 1,
  'Flipdish' = 2,
  'Ubereats' = 3,
  'Clover' = 4,
  'Grubhub' = 5,
  'Square' = 11,
  'Store Front' = 50,
  'Doordash' = 6,
  'GMB' = 7,
  'Stream' = 8
}
export enum MerchantPlatformsEnumNewMenu {
  'apptopus' = 1,
  'flipdish' = 2,
  'ubereats' = 3,
  'clover' = 4,
  'grubhub' = 5,
  'square' = 11,
  'storefront' = 50,
  'doordash' = 6,
  'GMB' = 7,
  'Standard Price' = 1,
  'Stream' = 8
}
export enum WeekDay {
  'Sun' = 7,
  'Mon' = 1,
  'Tues' = 2,
  'Wed' = 3,
  'Thu' = 4,
  'Fri' = 5,
  'Sat' = 6
}

export enum TCDocsTypes {
  'Fonda' = 1,
  'Doordash' = 2,
  'Grubhub' = 3,
  'UberEat' = 4,
  'Square' = 5,
  'Clover' = 6,

}
export class Platforms {
  id: '';
  platformType = '';
}
export class serviceAvailability {
  startTime: string = ''
  endTime: string = ''
  days: string = ''
}
export class MerchatMenu {
  id = '';
  merchantId = '';
  name = '';
  description = '';
  cusines: string = ""
  menuPlatforms = new Array<Platforms>();
  categories = new Array<CategoryDto>();
  virtualMerchants = new Array<virtualMerchants>();
  status: boolean
  vmerchantId = ''
}
export class TimeSlot {
  startTime: string = ''
  endTime: string = ''
  timezone: string = ''
  selectedDays: string[] = []
}
export class ItemTimeSlot {
  ids: string[] = []
  startTime: string = ''
  endTime: string = ''
  timezone: string = ''
  selectedDays: string[] = []
}
export class MerchatNewMenu {
  id: string = '';
  merchantId: string = '';
  name: string = '';
  menuPlatforms: string = ''
  serviceAvailability = new Array<serviceAvailability>()
  status: number = 0
}
export class virtualMerchants {
  id = '';
  merchantId = '';
  virtaulName = '';
  status = 0;
  marketStatus = 0;
}
export class newvirtualMerchants {
  id = '';
  merchantId = '';
  virtualName = '';
  status = 0;
  marketStatus = 0;
}

export enum MerchantStatusEnum {
  'In Active' = 0,
  Active = 1,
}
export class MerchantUserListDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: UserRoleEnum;
  userStatus: UserStatusEnum;
}
export class AssignMerchantUserDto {
  token: string;
  userid: string;
}
export class OpeninghourDto {
  id?: string = '';
  seqNo?: number;
  day?: string;
  openTime?: string;
  closeTime?: string;
  closeForBusinessFlag?: boolean = false;
}
export class CustomOpeneingHourForUi extends OpeninghourDto {
  main?: boolean;
  loading?: boolean;
}

export class AddEditOpeningHoursDto {
  token: string;
  openinghour = new OpeninghourDto();
}

//model class for signing in to a platform like flipdish from 'connect platforms' tab
export class FlipDishDetails {
  storeId: string;
  clientId: string;
  platformType: number = 2;
  accessToken: string;
  accountId: number;
  secretKey: string;
}

export class ConnectedPlatformObj {
  id: string;
  integrationstatus: number;
  merchantid: string;
  platformtype: number;
  storeid: string;
  storestatus: number;
  synctype: number;
  metadata: any;
  doordashstream: boolean
  grubhubstream: boolean
  syncstatus: number
}

export class TorderTransaction {
  merchantname: string;
  short_order_id: string;
  status: number;
  status_description: string;
  merchantid: number;
  customername: string;
  orderdatetime: string | Date;
  orderDateTime2: string;
  completion_time: number;
  ordersubtotal: number;
  ordertotal: number;
  ordertax: number;
  ordersource: string;
  created_datetime: number;
  ordertype: string;
  errorcharge: number;
  commission: number;
  Comissiontax: number;
  squarefee: number;
  marketplacetax: number;
  processingfee: number;
  stafftips: number;
  refund_amount: number;
  virtualname: string;
  promoDiscount: number
  promodiscount: number
}
export class ActivityLogsTypes {
  userid: string;
  username: string;
  merchantid: string;
  merchantname: string;
  itemid: string;
  itemname: string;
  eventtype: string;
  eventname: string;
  eventdetails: string;
  eventdatetime: string;
}
export class OrderLogsTypes {
  message: string;
  order_state: string;
  orderdatetime: string;
  gmail_message_id: string
}

export class SubscriptionType {
  merchantid: string;
  amount: number;
  createddatetime: string;
  date: string | Date;
  id: number;
  status: number;
  payoutId: string
  istrail: number;
  frequency: number;
  waiveoff_username: string;
  waiveoff_remarks: string;
  waiveoff_datetime: string;
}
export class SubscriptionSplit {
  splitDate: string;
  splitAmount: number;
  disable: boolean

}
export class ErrorLogsTypes {
  username: string;
  merchantid: string;
  merchantname: string;
  errorstatus: string;
  errorsource: string;
  errorname: string;
  errordetails: string;
  errordatetime: string;
  orderExternalReference: string;
}
export class sendgridemailobj {
  [x: string]: any;
  id: string;
  merchantId: string;
  msg_id: string;
  to_email: string;
  event: string;
  datetime: string;
  subject: string;
  processed_datetime: string;

}

export class PayoutCalculations {
  payouttype: number
  checked: boolean = false;
  merchantName: string;
  merchantId: string;
  orderAdjustments: number;
  commission: number;
  squarefee: number;
  errorCharges: number;
  marketplaceTax: number;
  netPayout: number = 0;
  numberOfOrders: number;
  processingFee: number;
  staffTips: number;
  subTotal: number;
  subscriptionAdjustments: number;
  tax: number;
  id: string;
  status: string;
  subscriptions: SubscriptionType[];
  startDate: string;
  endDate: string;
  message: string
  created_datetime: string
  revertedByName: string = ""
  revertedDateTime: string = ""
  doneByUser: string = ""
  payoutType: number = 1
  payoutAdjustments: number = 0
  marketingFee: number = 0
  doordash: number = 0
  ubereats: number = 0
  grubhub: number = 0
  storefront: number = 0
  marketiothersngFee: number = 0
  commisionAdjustment: number = 0
  promoDiscount: number = 0
  others: number = 0
  remarks: string = ""
  transferredToBankBy: string = ""
  transferredToBankTime: string = ""
  transferType: number
  RevenueProcessingFee: number
  lifetime_total_revenue: number;
  Revenue_processing_fee_Reason: string
  RevenueProcessingThreshold: number
  TotalRevenue: number
  TotalFondaPayout: number
  FondaRevenue: number
  FondaRevenuePercentage: number
  bankName: string;
  accountHolderName: string;
  last4: string;
  FondaShare: number = 0;
  totalEarning: number = 0
  internalNote: string

}

export enum SubscriptionDescription {

  "Transferred" = 1,
  "Reverted" = 2,
  "Paid out to Bank" = 3,
  "Yet to Transfer" = 0
}
export enum SubscriptionStatusEnum {
  "Paid" = 1,
  "Unpaid" = 0,
  "Waived Off" = 2,
  "Marked as paid" = 3,
  "Waived Off " = 4,
  "Splitted" = 5

}
export enum PayoutTypeDescription {
  "Include all the unpaid subscriptions" = 1,
  "Include subscriptions within the specified date range" = 2,
  "Do not include subscription in payout" = 3
}
export class AuditLogsTypes {
  eventdatetime: string;
  eventdetails: string;
  eventname: string;
  id: string;
  merchantid: string;
  merchantname: string;
  userid: string;
  username: string;
  payoutid: string;
}

export enum SubscriptionFrequency {
  "Anual" = 12,
  "Bianual" = 6,
  "Quaterly" = 3,
  "Monthly" = 1
}

export class BulkPayouts {
  startDate: string;
  endDate: string;
  active_merchants_counts: number
  payouts: PayoutCalculations[]
}

export class NewBulkPayouts {
  startDate: string;
  endDate: string;
  all_merchants_counts: number
  payouts: PayoutCalculations[]
}

export class VirtualRestaurant {
  id: string
  merchantId: string
  virtualName: string = ''
  status: number
  marketStatus: number
  expanded: boolean = false
}
export class EditLoaltyPoints {
  id: string;
  remarks: string;
  point: string;
  pointId: string;
}
