import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import upload from "../Middleware/upload.js";
import {
    registerClient,
    verifyRegistrationOtp,
    resendOtp,
    loginClient,
    loginClientWithGoogle,
    getClientData,
    updateClientProfile,
    changeClientPassword
} from "../Controllers/clientController.js";
import { showClientLimitOptions } from "../Controllers/LimitsController.js";

const clientrouter = express.Router();


clientrouter.post("/register", registerClient);
clientrouter.post("/verify-otp", verifyRegistrationOtp);
clientrouter.post("/resend-otp", resendOtp);
clientrouter.post("/login", loginClient);
clientrouter.post("/google", loginClientWithGoogle);
clientrouter.get("/limits/:id", showClientLimitOptions);
clientrouter.get("/:id", getClientData);
clientrouter.put("/:id", authMiddleware, upload.single("avatar"), updateClientProfile);
clientrouter.put("/:id/change-password", authMiddleware, changeClientPassword);

export default clientrouter;