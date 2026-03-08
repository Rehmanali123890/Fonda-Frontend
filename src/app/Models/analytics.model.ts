export class TimeReport {
	date: string;
	orders: number;
	revenue: number;
}
export class revenueTimeReport {
	date: string;
	revenue: number;
	net_earning: number;
}
export class revenueByDay {
	friday: number;
	monday: number
	saturday: number
	sunday: number
	thursday: number
	tuesday: number
	wednesday: number
}
export class MerchantReportDto {
	merchantId: string;
	totalRevenue: number;
	totalOrders: number;
	averageOrderSize: number;
	timeReport: TimeReport[] = [];
	revenueByDay: revenueByDay;
	totalOrderSubtotal: number
	totalStaffTips: number;
	totalComission: number;
	totalProcessingFee: number;
	totalErrorCharges: number;
	totalOrderAdjustments: number;
	totalMarketPlaceUbereats: number;
	totalTax: number;
	totalSquareFee: number;
	downtime: number;
	totalPromo: number = 0
}


export class revenueReportDto {
	merchantId: string;
	timeReport: revenueTimeReport[] = [];
	revenueByDay: revenueByDay;
	trendRevenue: number[] = [];
	trendNetEarning: number[] = [];
}

export class Product {
	productId: string;
	productName: string;
	productPrice: number;
	quantitySold: number;
	salesRevenue: number;
}

export class MerchantProductOverViewDto {
	merchantId: string;
	products: Product[] = [];
}

export class RevenusByPlatform {
	count: string;
	source: string;
	revenue: number
	totalOrderSubtotal: number
	totalStaffTips: number;
	totalComission: number;
	totalProcessingFee: number;
	totalErrorCharges: number;
	totalOrderAdjustments: number;
	totalMarketPlaceUbereats: number;
	totalTax: number;
	totalSquareFee: number;
	totalPromo: number = 0
}