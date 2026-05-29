import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        loanId: {
            type: Schema.Types.ObjectId,
            ref: "Loan",
            required: true,
        },

        utrNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
        },

        paymentDate: {
            type: Date,
            required: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Payment = mongoose.model(
    "Payment",
    paymentSchema
);