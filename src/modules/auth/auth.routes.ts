import { Router } from "express";

import { AuthController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
    validateLogin,
    validateRegister,
} from "./auth.validation.js";

const router = Router();

router.post(
    "/register",
    validate(validateRegister),
    AuthController.register
);

router.post(
    "/login",
    validate(validateLogin),
    AuthController.login
);

export default router;