export class TransactionHistory {
    amount: number = 0
    created: Date;
    currency: string = ""
    description: string = ""
    id: string = ""
    hosted_regulatory_receipt_url: string = ""
}
export class AccountDetails {
    id: string = ""
    has_treasury_edit_access: number
    restricted_features: [] = [];
    data: dump
    status: string = "";
    balance: {
        cash: {
            usd: number | 0;
        }
    }
}
export class dump {
    financialAccountMissing: boolean = false
}