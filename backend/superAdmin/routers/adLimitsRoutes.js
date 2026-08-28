import express from "express";
import { getAdLimits, updateAdLimits } from "../Controllers/adLimitsController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const adLimitsRouter = express.Router();

// GET /api/super-admin/ad-limits  — fetch current limits
adLimitsRouter.get("/", authMiddleware, getAdLimits);

// PUT /api/super-admin/ad-limits  — update limits
adLimitsRouter.put("/", authMiddleware, updateAdLimits);

export default adLimitsRouter;
