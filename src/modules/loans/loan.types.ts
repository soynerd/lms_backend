export enum LoanStatus {
    APPLIED = "APPLIED",
    SANCTIONED = "SANCTIONED",
    REJECTED = "REJECTED",
    DISBURSED = "DISBURSED",
    CLOSED = "CLOSED",
}

export enum EmploymentMode {
    SALARIED = "SALARIED",
    SELF_EMPLOYED = "SELF_EMPLOYED",
    UNEMPLOYED = "UNEMPLOYED",
}

export interface ILoan {
    borrowerId: string;

    personalDetails: {
        fullName: string;
        pan: string;
        dob: Date;
        monthlySalary: number;
        employmentMode: EmploymentMode;
    };

    salarySlipUrl: string;

    amount: number;
    tenureDays: number;

    interestRate: number;
    interestAmount: number;
    totalRepayment: number;

    status: LoanStatus;

    rejectionReason?: string;

    sanctionedBy?: string;
    disbursedBy?: string;
    disbursedAt?: Date;

    createdAt?: Date;
    updatedAt?: Date;
}