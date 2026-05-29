import type { Request, Response } from "express";

import { AuthService } from "./auth.service.js";

export class AuthController {
    static async register(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            const { name, email, password } = req.body;

            const user = await AuthService.register(
                name,
                email,
                password
            );

            res.status(201).json({
                success: true,
                data: user,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Registration failed",
            });
        }
    }

    static async login(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            const { email, password } = req.body;

            const data = await AuthService.login(
                email,
                password
            );

            res.status(200).json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Login failed",
            });
        }
    }
}