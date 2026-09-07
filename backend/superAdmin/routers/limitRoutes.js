import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";

import {
    addLimit,
    getAllLimits,
    getLimitById,
    updateLimit,
    deleteLimit,
} from "../Controllers/limitController.js";

const router = express.Router();

router.use(authMiddleware);

// ======================================================
// LIMIT ROUTES
// ======================================================

// Add new limit
router.post("/", addLimit);

// Get all limits
router.get("/", getAllLimits);

// Get one limit
router.get("/:id", getLimitById);

// Update limit
router.put("/:id", updateLimit);

// Delete limit
router.delete("/:id", deleteLimit);

export default router;