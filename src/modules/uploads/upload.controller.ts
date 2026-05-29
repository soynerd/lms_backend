import type { Request, Response } from "express";

import { UploadService } from "./upload.service.js";

export class UploadController {
    static async upload(
        req: Request,
        res: Response
    ) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "File is required",
                });
            }

            const url =
                await UploadService.uploadSalarySlip(
                    req.file
                );

            res.status(200).json({
                success: true,
                data: {
                    url,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Upload failed",
            });
        }
    }
}