import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import uploadRoutes from "./modules/uploads/upload.routes.js";
import loanRoutes from "./modules/loans/loan.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/uploads", uploadRoutes);


app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
});
app.use(errorHandler);

export default app;