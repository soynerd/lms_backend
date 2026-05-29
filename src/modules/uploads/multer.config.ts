import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

export const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (_req, file, cb) => {
        const allowedTypes = [
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/jpg",
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(
                new Error(
                    "Only PDF, PNG and JPG files are allowed"
                )
            );
        }

        cb(null, true);
    },
});

export const generateFileName = (
    originalName: string
) => {
    const extension = path.extname(originalName);

    return `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}${extension}`;
};