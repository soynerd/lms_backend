import type { Request, Response, NextFunction } from "express";

export const validate =
    (validator: (body: any) => { error?: { message: string } }) =>
        (req: Request, res: Response, next: NextFunction): void => {
            const { error } = validator(req.body);

            if (error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            next();
        };