import { Payment } from "./payment.model.js";
import { Loan } from "../loans/loan.model.js";
import { LoanStatus } from "../loans/loan.types.js";

export class PaymentService {
    static async createPayment(
        loanId: string,
        utrNumber: string,
        amount: number,
        paymentDate: Date,
        createdBy: string
    ) {
        try {
            console.log("hello2")
            const loan = await Loan.findById(loanId);

            if (!loan) {
                throw new Error("Loan not found");
            }

            if (loan.status !== LoanStatus.DISBURSED) {
                throw new Error(
                    "Payments can only be made on disbursed loans"
                );
            }

            const totalPaidResult = await Payment.aggregate([
                {
                    $match: {
                        loanId: loan._id,
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
            ]);

            const totalPaid =
                totalPaidResult[0]?.total ?? 0;

            const outstanding =
                loan.totalRepayment - totalPaid;

            if (amount > outstanding) {
                throw new Error(
                    "Payment exceeds outstanding balance"
                );
            }

            const payment = await Payment.create({
                loanId,
                utrNumber,
                amount,
                paymentDate,
                createdBy,
            });

            const updatedPaid = totalPaid + amount;

            if (updatedPaid >= loan.totalRepayment) {
                loan.status = LoanStatus.CLOSED;
                await loan.save();
            }

            return payment;
        } catch (error) {
            console.error((error as Error).message);
            throw error;
        }
    }

    static async getLoanPayments(
        loanId: string
    ) {
        return Payment.find({ loanId }).sort({
            paymentDate: -1,
        });
    }
}