export class CustomerDto {
  id: string;
  merchantID: string;
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  address = '';
}

export class CustomerNewDto {
  id: string;
  merchantID: string;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  createdBy: string = '';
  createdDatetime: string = '';
  updatedBy: string | null = null;
  updatedDatetime: string | null = null;
  
  // New fields
  order_ratings: number | null = null;
  service_ratings: number | null = null;
  comments: string = '';
  utm_source: string | null = null;
}

