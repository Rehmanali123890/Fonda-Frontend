
// Account details screen

// Merchant Settings
export const businessAddressDescription = 'Restaurant address where it is physically situated or operates.';
export const timezoneDescription = 'Standard time offset for location; affects Orders scheduling and coordination.';
export const emailDescription = 'Email address of the restaurants owner or manager. It is saved for reference only';
export const dobDescription = 'Date of Birth of the restaurants owner';
export const phoneDescription = 'Restaurants Owner or Managers Mobile number where the Fonda dashboards alerts / notification will be sent';
export const onboardingCompletedDescription = 'Indicates successful completion of onboarding process of the restaurant.';

// Business Info
export const legalBusinessNameDescription = 'The official registered name of the restaurant legal entity.';
export const einNumberDescription = 'Restaurants business identification number for the tax purposes.';
export const businessWebsiteDescription = 'Restaurants website address';
export const businessAddressLineDescription = 'Restaurants legal entitiy registered address';
export const cityDescription = 'Restaurants legal entitiy registered city';
export const stateDescription = 'Restaurants legal entitiy registered state';
export const zipCodeDescription = 'Restaurants legal entitiy registered zipcode';
export const businessNumberDescription = 'Registration number for the restaurants business entity.';
export const bankAccountNumberDescription = 'Restaurants Bank Account number for the purposes of Payouts/Stripe connect account';
export const bankAccountRoutingNumberDescription = 'Restaurants Branch  number for the purposes of Payouts/Stripe connect account';

// Tax and Commission Setup screen

// Tax and Commission Setup
export const businessTaxDescription = "Business Tax % of the Restaurant indicates the percentage of a company's income subject to taxation, influencing overall financial planning and compliance";
export const staffTipDescription = "Staff Tip % is the percentage of the bill that customers leave as a gratuity for the service staff, typically ranging from 15% to 20%.";
export const ubereatsCommissionDescription = "UberEats Commission % charged to the restaurants revenue. This is deducted from the Restaurants Total Revenue";
export const doordashCommissionDescription = "Doordash Commission % charged to the restaurant's revenue. This is deducted from the Restaurants Total Revenue";
export const grubhubCommissionDescription = "Grubhub Commission % charged to the restaurant's revenue. This is deducted from the Restaurants Total Revenue";
export const flipdishCommissionDescription = "Flipdish Commission % charged to the restaurant's revenue. This is deducted from the Restaurants Total Revenue"
export const processingfeeDescription = "Card Processing Fee % charged during the Fonda direct order";
export const processingFeeFixedAmountDescription = "Card Processing fixed amount charged during the Fonda direct order";
export const marketPlaceDescription = "Marketplace Facilitator Tax (Uber Eats %) is the percentage of sales that Uber Eats collects and remits on behalf of restaurants to cover sales tax obligations. The specific percentage can vary by location.";
export const squareProcessingFeeDescription = "Square Processing Fee % is the percentage of a transaction amount that Square charges for its payment processing services, typically around 2.6% to 2.9%.";

// Automatic Revenue Processing Fee Calculation Settings
export const automaticRevenueProcessingFeeThresholdDescription = " Enter the minimum revenue amount that triggers automatic processing fees. This threshold helps manage fee calculations and ensures accurate revenue tracking.";
export const revenueProcessingFeePercentageDescription = "Specify the percentage rate for processing fees applied to revenue transactions.";

// Auto-Subscription Charges Waiver Settings
export const minimumRevenueForSubscriptionDescription = "Minimum Revenue for Subscription Calculation is the lowest amount a business must earn in order for Fonda to charge the subscription fees";
export const downtimePercentageDescription = "Define the allowable percentage of system downtime before triggering alerts or maintenance actions."


// setting screen
export const acceptSpecialInstructionsDescription = "Accept Special Instructions in Order refers to a feature that allows customers to provide specific, customized requests or preferences for their orders, enhancing their experience";
export const autoAcceptUbereatsOrdersDescription = "Auto Accept UberEats And Stream Orders (Yes/No) is a preference setting that determines whether incoming UberEats orders are automatically accepted by the restaurant (Yes) or if manual confirmation is required (No).";
export const connectedDeviceIdDescription = "Connected Device ID is a unique identifier associated with a connected Android tablet ID thru Esper.";
export const pauseResumeParserDescription = "Pause/Resume Parser is a control or function that enables the temporary interruption (pause) and subsequent continuation (resume) of Order parsing or processing. It is related to Parseur Service";
export const pauseResumeFondaParserDescription = "Pause/Resume Parser is a control or function that enables the temporary interruption (pause) and subsequent continuation (resume) of Order parsing or processing. It is related to Fonda Parser Service. This service is not used currently";
export const busyModeDescription = "Busy Mode is a status setting that indicates restaurant busy status, so the additional time is added to the order ready countdown.";
export const orderPreparationTimeDescription = "Order Preparation Time (in minutes) is the estimated amount of time required by restaurant to prepare the order";
export const orderDelayTimeDescription = "Order Delay Time (in minutes) is the additional time beyond the estimated preparation time that a customer may need to wait for their order to be ready due to busy mode";
export const allowGoogleReviewsReplyDescription = "Allow Google Reviews Reply is a setting that permits or restricts the ability of restaurant to reply to the feedback thru Fonda Dashboard";
export const storefrontChargeCardFeesDescription = "Storefront - Charge Card Fees to Customer refers to a policy or setting that allows a business to pass on the fees associated with credit card transactions to the customer, indicating whether or not customers will incur these additional charges.";
export const merchantEmailDistributionListDescription = "Merchant Email Distribution List is a list of email addresses for merchants or business owners used for distributing information, updates, or communications relevant to their operations or services.";

// Payout screen
export const numberOfOrdersDescription = "Total number of completed orders within the period considered for the payout calculation";
export const subTotalDescription = "The calculated sum of the costs of individual items or services in an order before the application of taxes, discounts, or additional charges. It represents the initial cost of the selected items.";
export const taxDescription = "Total sum of business tax applied on the orders for the payout period";
export const commissionDescription = "Is a fee or percentage of a transaction amount that fonda earns as compensation for facilitating or completing service.";
export const commissionAdjustmentsDescription = "It refers to changes or modifications made to the standard commission rate, often used to account for special circumstances, incentives, or corrections in sales or service agreements.";
export const squareFeeDescription = "Fee charged by the Square payment processing service for handling transactions. It includes a percentage of the transaction amount along with a fixed fee, covering the cost of payment processing.";
export const processingFeeDescription = "Charge associated with handling and facilitating transactions, consisting of a percentage of the transaction amount . We can add this fee in merchant settings";
export const errorChargesDescription = "It refers to additional fees or penalties imposed due to errors, mistakes, or violations in a transaction or business process, serving as a corrective measure.";
export const staffTipsDescription = "Total Staff Tips paid by customers through Fonda Direct orders";
export const orderAdjustmentsDescription = "Typically refer to changes, modifications, or corrections made to an existing customer order, whether it's adjusting items, quantities, or prices to ensure accuracy and customer satisfaction.";
export const marketPlaceFacilitatorTaxUbereatsDescription = "Is the tax collected and remitted by Uber Eats on behalf of restaurants to cover sales tax obligations. The specific tax rate and details can vary by location and tax regulations.";
export const promoDiscountDescription = "It is a reduction in the price of a product or service applied as a result of a promotional offer, coupon code, or marketing campaign, allowing customers to pay less for their order";
export const subscriptionAdjustmentsDescription = "Any adjustments you want to make against the subscription amount";
export const revenueProcessingFeeDescription = "Fonda's Revenue sharing % applied to the total order value as agreed as per T&Cs.";
export const marketingFeeDescription = "Charge imposed by a platforms towards restaurant marketing in the marketplaces like Doordash";
export const payoutAdjustmentsDescription = "Any positive or negative adjustments you want to make to the final payout amount";
export const netPayoutDescription = "The final amount that a restaurant will receives after all deductions, fees, and adjustments have been taken into account from the total revenue. It represents the actual funds to be send.";

// Store front screen
export const uRLSlugDescription = "It is used to update url of Fonda storefront";
export const uploadLogoDescription = "We can upload the logo of our restaurant maximum size allowed 1.7 MB";
export const uploadBannerDescription = "We can upload the banner of our restaurant Image Size Max allowed 1.5 MB and Video 21 MB";
