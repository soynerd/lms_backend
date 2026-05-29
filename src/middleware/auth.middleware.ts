import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        if (token) {

            const decoded = jwt.verify(token, env.JWT_SECRET) as {
                id: string;
                role: string;
            };

            if (
                typeof decoded !== "object" ||
                !("id" in decoded) ||
                !("role" in decoded)
            ) {
                throw new Error("Invalid token payload");
            }

            req.user = decoded;
        }

        next();
    } catch {
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};