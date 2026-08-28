import express from "express";

import {
    getAdLimits,
    updateAdLimits
} from "../Controllers/adLimitController.js";


const router = express.Router();


// Get Advertisement Limits
router.get(
    "/",
    getAdLimits
);


// Update Advertisement Limits
router.put(
    "/",
    updateAdLimits
);


export default router;