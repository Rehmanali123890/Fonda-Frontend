export class UserDto {
  address: string;
  email: string;
  username: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string;
  role: number;
  userStatus: UserStatusEnum;
  password: string;
  withSSO: number;
  is_jwt_token: number
}

export enum UserStatusEnum {
  'In Active' = 0,
  Active = 1,
}
export enum UserRoleEnum {
  'Dashboard Admin' = 1,
  'Dashboard Standard User' = 2,
  'Merchant Admin' = 3,
  'Merchant Standard User' = 4,
}
