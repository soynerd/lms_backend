import mongoose, { Schema } from "mongoose";
import type { InferSchemaType } from "mongoose";

import { UserRole, type IUser } from "./user.types.js";

const userSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.BORROWER,
        },
    },
    {
        timestamps: true,
    }
);

export type UserDocument = InferSchemaType<typeof userSchema>;

export const User = mongoose.model("User", userSchema);