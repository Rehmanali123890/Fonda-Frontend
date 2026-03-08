import { ItemDto } from './item.model';

export class CategoryDto {
	id: string;
	categoryName = '';
	posName = '';
	categoryDescription = '';
	categoryStatus: number;
	selected: boolean = false;
}

export class VirtualMerchantsDtO {
	id: string;
	status: number;
	virtaulName: string;
}
export class CategoryWithOptDto {
	id: string;
	categoryName = '';
	posName = '';
	categoryDescription = '';
	selected: boolean = false;
	categoryStatus: number;
	items = new Array<ItemDto>();
	sortId: number
}
export class ProductListDto {
	id: string;
	productName: string;
	productUnitPrice: number;
	productDescription: string;
	productStatus: number;
}
export enum ProductStatusEnum {
	'In Active' = 0,
	Active = 1,
}
export enum CategoryStatusEnum {
	'In Active' = 0,
	Active = 1,
}
export enum AddonStatusEnum {
	'In Active' = 0,
	Active = 1,
}
export enum AddonOptionStatusEnum {
	'In Active' = 0,
	Active = 1,
}

export class AddCategoryDto {
	token: string;
	category = new CategoryDto();
}
export class ProductDto {
	id: string;
	// categoryId: string;
	productName: string = '';
	productDescription: string = '';
	productUnitPrice: number;
	productStatus: number;
}

export class AddEditProductDto {
	token: string;
	item = new ItemDto();
}
export class AddonDto {
	id: string;
	addonName: string = '';
	posName: string = '';
	addonDescription: string = '';
	minPermitted: number;
	maxPermitted: number;
	status: number = 1
	// addonUnitPrice: number;
	// addonStatus: number;
}
export class AddonDtoWithOptions {
	id: string;

	addonName: string;
	posName: string = '';
	addonDescription: string;
	minPermitted: number;
	maxPermitted: number;

	addonOptions: AddonOptionDto[] = [];
	addonItems: AddonItemDto[] = []
	selected: boolean = true;
	itemcount: number = 0
	status: number = 0
	// addonUnitPrice: number;
	// addonStatus: number;
}
export class AddonDtoWithoutOptions {
	id: string;

	addonName: string;
	posName: string = '';
	addonDescription: string;
	minPermitted: number;
	maxPermitted: number;
	addonItems: AddonItemDto[] = []
	selected: boolean = true;
	itemcount: number = 0
	addoncount: number = 0
	status: number = 0
	// addonUnitPrice: number;
	// addonStatus: number;
}
export class AddEditAddonDto {
	token: string;
	addon = new AddonDto();
}
export class AddonOptionDto {
	id: string;
	addonOptionName: string;
	addonOptionSKU: string;
	addonOptionDescription: string;
	addonOptionPrice: number;
	addonOptionStatus: AddonOptionStatusEnum;
}
export class AddonItemDto {
	id: string;
	addonItemName: string;
	addonItemSKU: string;
	addonItemDescription: string;
	addonItemPrice: number;
	addonItemStatus: AddonOptionStatusEnum;
}


export class Location {
	merchantname: string;
}

export class CatMenu {
	id: string;
	name: string;
	cuisine: string;
	location: Location[];
}