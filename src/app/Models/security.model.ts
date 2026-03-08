export class LoginDto {
	email: string;
	password: string;
}

export class User {
	address: string;
	email: string;
	firstName: string;
	id: string;
	lastName: string;
	phone: string;
	role: number;
	userStatus: number;
	showtreasury: boolean = false
	withSSO: number
	SSOId: string
}

export class SecurityObjDto {
	token: string;

	user: User;
	merchantid: string
}
