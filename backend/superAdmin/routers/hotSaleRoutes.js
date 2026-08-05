import express from "express";

import {
    addHotSale,
    getHotSales,
    updateHotSale,
    deleteHotSale,
    updatePropertyStatus
} from "../Controllers/hotsalesController.js";

import upload from "../Middleware/upload.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import db from "../../configuration/db.js";

const hotSaleRouter = express.Router();


// ============================================================
// POST / — Add Hot Sale (frontend calls POST /properties/hot-sales)
// ============================================================
hotSaleRouter.post(
    "/",
    addHotSale
);

hotSaleRouter.post(
    "/add",
    addHotSale
);


// ============================================================
// GET / — Get All Hot Sales (frontend calls basePath directly)
// ============================================================
hotSaleRouter.get(
    "/",
    getHotSales
);

// Keep old /show route for backward compatibility
hotSaleRouter.get(
    "/show",
    authMiddleware,
    getHotSales
);


// ============================================================
// GET /status/:status — Filter by status
// ============================================================
hotSaleRouter.get(
    "/status/:status",
    authMiddleware,
    async (req, res) => {
        try {
            const { status } = req.params;
            const [rows] = await db.query(
                `SELECT id, title, description, price, property_type, city, status, created_at
                 FROM hot_sales WHERE status = ? ORDER BY created_at DESC`,
                [status]
            );
            res.status(200).json({ success: true, data: rows });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    }
);


// ============================================================
// GET /search?search=... — Search listings
// ============================================================
hotSaleRouter.get(
    "/search",
    authMiddleware,
    async (req, res) => {
        try {
            const { search = "" } = req.query;
            const like = `%${search}%`;
            const [rows] = await db.query(
                `SELECT id, title, description, price, property_type, city, status, created_at
                 FROM hot_sales
                 WHERE title LIKE ? OR city LIKE ? OR property_type LIKE ?
                 ORDER BY created_at DESC`,
                [like, like, like]
            );
            res.status(200).json({ success: true, data: rows });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    }
);


// ============================================================
// PUT /:id — Update Hot Sale
// ============================================================
hotSaleRouter.put(
    "/:id",
    authMiddleware,
    upload.fields([
        { name: "main_image", maxCount: 1 },
        { name: "images", maxCount: 10 }
    ]),
    updateHotSale
);


// ============================================================
// DELETE /:id — Delete Hot Sale
// ============================================================
hotSaleRouter.delete(
    "/:id",
    authMiddleware,
    deleteHotSale
);


// ============================================================
// PATCH /:id/status — Update status (frontend: /:id/status)
// OLD was: /status/:id — kept for compatibility
// ============================================================
hotSaleRouter.patch(
    "/:id/status",
    authMiddleware,
    updatePropertyStatus
);

// Keep old route for compatibility
hotSaleRouter.patch(
    "/status/:id",
    authMiddleware,
    updatePropertyStatus
);


export default hotSaleRouter;