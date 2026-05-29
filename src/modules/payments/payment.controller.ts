import type { Response } from "express";

import { PaymentService } from "./payment.service.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class PaymentController {
    static async create(
        req: AuthRequest,
        res: Response
    ) {
        try {
            const {
                loanId,
                utrNumber,
                amount,
                paymentDate,
            } = req.body;

            const payment =
                await PaymentService.createPayment(
                    loanId,
                    utrNumber,
                    amount,
                    new Date(paymentDate),
                    req.user!.id
                );
            res.status(201).json({
                success: true,
                data: payment,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Payment failed",
            });
        }
    }

    static async getLoanPayments(
        req: AuthRequest,
        res: Response
    ) {
        const { loanId } = req.params;

        if (!loanId || Array.isArray(loanId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing loanId parameter",
            });
        }

        const payments = await PaymentService.getLoanPayments(loanId);

        res.json({ success: true, data: payments });
    }
}