import mongoose, { Schema } from "mongoose";

import {
    EmploymentMode,
    LoanStatus,
} from "./loan.types.js";

const loanSchema = new Schema(
    {
        borrowerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        personalDetails: {
            fullName: {
                type: String,
                required: true,
            },

            pan: {
                type: String,
                required: true,
                uppercase: true,
            },

            dob: {
                type: Date,
                required: true,
            },

            monthlySalary: {
                type: Number,
                required: true,
            },

            employmentMode: {
                type: String,
                enum: Object.values(EmploymentMode),
                required: true,
            },
        },

        salarySlipUrl: {
            type: String,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        tenureDays: {
            type: Number,
            required: true,
        },

        interestRate: {
            type: Number,
            default: 12,
        },

        interestAmount: {
            type: Number,
            required: true,
        },

        totalRepayment: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(LoanStatus),
            default: LoanStatus.APPLIED,
        },

        rejectionReason: String,

        sanctionedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        disbursedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        disbursedAt: Date,
    },
    {
        timestamps: true,
    }
);

export const Loan = mongoose.model(
    "Loan",
    loanSchema
);