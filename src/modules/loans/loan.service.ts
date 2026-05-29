import { User } from "../users/user.model.js";
import { UserRole } from "../users/user.types.js";
import { Loan } from "./loan.model.js";
import { LoanStatus } from "./loan.types.js";

export class LoanService {
    static calculateLoan(
        amount: number,
        tenureDays: number
    ) {
        const interestRate = 12;

        const interestAmount =
            (amount * interestRate * tenureDays) /
            (365 * 100);

        const totalRepayment =
            amount + interestAmount;

        return {
            interestRate,
            interestAmount,
            totalRepayment,
        };
    }

    static async createLoan(data: any) {
        return Loan.create(data);
    }

    static async getMyLoans(userId: string) {
        return Loan.find({
            borrowerId: userId,
        }).sort({
            createdAt: -1,
        });
    }

    static async getAppliedLoans() {
        return Loan.find({
            status: LoanStatus.APPLIED,
        });
    }

    static async sanctionLoan(
        loanId: string,
        sanctionedBy: string
    ) {
        return Loan.findByIdAndUpdate(
            loanId,
            {
                status: LoanStatus.SANCTIONED,
                sanctionedBy,
            },
            { new: true }
        );
    }

    static async rejectLoan(
        loanId: string,
        reason: string
    ) {
        return Loan.findByIdAndUpdate(
            loanId,
            {
                status: LoanStatus.REJECTED,
                rejectionReason: reason,
            },
            { new: true }
        );
    }

    static async disburseLoan(
        loanId: string,
        disbursedBy: string
    ) {
        return Loan.findByIdAndUpdate(
            loanId,
            {
                status: LoanStatus.DISBURSED,
                disbursedBy,
                disbursedAt: new Date(),
            },
            { new: true }
        );
    }

    static async getSanctionedLoans() {
        return Loan.find({
            status: LoanStatus.SANCTIONED,
        });
    }

    static async getDisbursedLoans() {
        return Loan.find({
            status: LoanStatus.DISBURSED,
        });
    }

    static async getLeads() {
        const borrowers = await User.find({
            role: UserRole.BORROWER,
        });

        const loans = await Loan.find({}, "borrower");

        const appliedUsers = new Set(
            loans.map((loan) => loan.borrowerId)
        );

        return borrowers.filter(
            (user) => !appliedUsers.has(user._id)
        );
    }
}