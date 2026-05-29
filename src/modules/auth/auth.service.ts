import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../users/user.model.js";
import { UserRole } from "../users/user.types.js";
import { env } from "../../config/env.js";

export class AuthService {
    static async register(
        name: string,
        email: string,
        password: string
    ) {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "BORROWER" as UserRole,
        });

        return user;
    }

    static async login(email: string, password: string) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
}