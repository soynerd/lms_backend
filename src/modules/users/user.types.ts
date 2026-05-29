export enum UserRole {
    ADMIN = "ADMIN",
    SALES = "SALES",
    SANCTION = "SANCTION",
    DISBURSEMENT = "DISBURSEMENT",
    COLLECTION = "COLLECTION",
    BORROWER = "BORROWER",
}

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}