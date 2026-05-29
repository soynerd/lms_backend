import { Router } from "express";

import { UploadController } from "./upload.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { upload } from "./multer.config.js";

const router = Router();

router.post(
    "/salary-slip",
    authenticate,
    upload.single("file"),
    UploadController.upload
);

export default router;