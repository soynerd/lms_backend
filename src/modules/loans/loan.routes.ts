import { Router } from "express";

import { LoanController } from "./loan.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { validateLoanApplication } from "./loan.validation.js";
import { UserRole } from "../users/user.types.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = Router();

router.post(
    "/apply",
    authenticate,
    validate(validateLoanApplication),
    LoanController.apply
);

router.get(
    "/my-loans",
    authenticate,
    LoanController.myLoans
);
router.get(
    "/applied",
    authenticate,
    LoanController.appliedLoans
);

router.get(
    "/leads",
    authenticate,
    authorize(
        UserRole.SALES,
        UserRole.ADMIN
    ),
    LoanController.leads
);

router.get(
    "/sanction",
    authenticate,
    LoanController.sanctionQueue
);

router.patch(
    "/:id/approve",
    authenticate,
    LoanController.approve
);

router.patch(
    "/:id/reject",
    authenticate,
    LoanController.reject
);

router.get(
    "/disbursement",
    authenticate,
    LoanController.disbursementQueue
);

router.patch(
    "/:id/disburse",
    authenticate,
    LoanController.disburse
);

router.get(
    "/collection",
    authenticate,
    LoanController.collectionQueue
);

export default router;