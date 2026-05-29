import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { generateFileName } from "./multer.config.js";
import { env } from "../../config/env.js";

const s3 = new S3Client({
    region: "auto",

    endpoint: env.R2_ENDPOINT,

    credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
});

export class UploadService {
    static async uploadSalarySlip(
        file: Express.Multer.File
    ) {
        const fileName = generateFileName(
            file.originalname
        );

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            })
        );

        return `${process.env.R2_PUBLIC_URL}/lms/${fileName}`;
    }
}