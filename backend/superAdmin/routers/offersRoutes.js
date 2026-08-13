import express from "express";
import {
    getOffers,
    getOfferById,
    addOffer,
    updateOffer,
    updateOfferStatus,
    deleteOffer,
    verifyPromoCode
} from "../Controllers/offersController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const offersRouter = express.Router();

// GET / — All offers (Super Admin)
offersRouter.get("/", authMiddleware, getOffers);

// GET /verify/:code — Verify promo code (Public - for client use)
offersRouter.get("/verify/:code", verifyPromoCode);

// GET /:id — Get single offer
offersRouter.get("/:id", authMiddleware, getOfferById);

// POST / — Create offer
offersRouter.post("/", authMiddleware, addOffer);

// PUT /:id — Update offer
offersRouter.put("/:id", authMiddleware, updateOffer);

// PATCH /:id/status — Update status only
offersRouter.patch("/:id/status", authMiddleware, updateOfferStatus);

// DELETE /:id — Delete offer
offersRouter.delete("/:id", authMiddleware, deleteOffer);

export default offersRouter;
