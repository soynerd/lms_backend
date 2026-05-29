import { Router } from "express";

import { PaymentController } from "./payment.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { validatePayment } from "./payment.validation.js";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize("COLLECTION", "ADMIN"),
    validate(validatePayment),
    PaymentController.create
);

router.get(
    "/:loanId",
    authenticate,
    authorize(
        "COLLECTION",
        "ADMIN",
        "SANCTION",
        "DISBURSEMENT",
        "BORROWER"
    ),
    PaymentController.getLoanPayments
);

export default router;