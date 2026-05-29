import type { Request, Response } from "express";

import { LoanService } from "./loan.service.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import { runBRE } from "../../utils/bre.js";

export class LoanController {
    static async apply(
        req: AuthRequest,
        res: Response
    ) {
        try {
            const {
                personalDetails,
                salarySlipUrl,
                amount,
                tenureDays,
            } = req.body;

            runBRE(personalDetails);

            const calculation =
                LoanService.calculateLoan(
                    amount,
                    tenureDays
                );

            const loan =
                await LoanService.createLoan({
                    borrowerId: req.user!.id,
                    personalDetails,
                    salarySlipUrl,
                    amount,
                    tenureDays,
                    ...calculation,
                });

            res.status(201).json({
                success: true,
                data: loan,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message,
            });
        }
    }

    static async myLoans(
        req: AuthRequest,
        res: Response
    ) {
        const loans =
            await LoanService.getMyLoans(
                req.user!.id
            );

        res.json({
            success: true,
            data: loans,
        });
    }

    static async appliedLoans(
        _req: Request,
        res: Response
    ) {
        const loans =
            await LoanService.getAppliedLoans();

        res.json({
            success: true,
            data: loans,
        });
    }

    static async sanctionQueue(
        _req: Request,
        res: Response
    ) {
        const loans =
            await LoanService.getAppliedLoans();

        res.json({
            success: true,
            data: loans,
        });
    }

    static async approve(
        req: AuthRequest,
        res: Response
    ) {
        const loanId = req.params.id as string;

        const loan =
            await LoanService.sanctionLoan(
                loanId,
                req.user!.id
            );

        res.json({
            success: true,
            data: loan,
        });
    }

    static async reject(
        req: AuthRequest,
        res: Response
    ) {
        const loan =
            await LoanService.rejectLoan(
                req.params.id as string,
                req.body.reason
            );

        res.json({
            success: true,
            data: loan,
        });
    }

    static async disbursementQueue(
        _req: Request,
        res: Response
    ) {
        const loans =
            await LoanService.getSanctionedLoans();

        res.json({
            success: true,
            data: loans,
        });
    }

    static async disburse(
        req: AuthRequest,
        res: Response
    ) {
        const loan =
            await LoanService.disburseLoan(
                req.params.id as string,
                req.user!.id
            );

        res.json({
            success: true,
            data: loan,
        });
    }

    static async collectionQueue(
        _req: Request,
        res: Response
    ) {
        const loans =
            await LoanService.getDisbursedLoans();

        res.json({
            success: true,
            data: loans,
        });
    }

    static async leads(
        _req: Request,
        res: Response
    ) {
        const leads =
            await LoanService.getLeads();

        res.json({
            success: true,
            data: leads,
        });
    }
}