import express from "express";
import upload from "../Middleware/upload.js";

import {
    getLands,
    getLandById,
    updateLand,
    deleteLand,
    getLandGalleryImage,
    getLandMainVideo,
    addLands,
    getLandMainImage
} from "../Controllers/landsController.js";

import authMiddleware from "../Middleware/authMiddleware.js";

const adminLandsRouter = express.Router();

// ==========================================
// ADD LAND
// ==========================================

adminLandsRouter.post(
    "/",
    authMiddleware,
    upload.fields([
        {
            name: "main_image",
            maxCount: 1
        },
        {
            name: "main_video",
            maxCount: 1
        },
        {
            name: "images",
            maxCount: 10
        }
    ]),
    addLands
);

// ==========================================
// GET ALL LANDS
// ==========================================

adminLandsRouter.get(
    "/",
    authMiddleware,
    getLands
);

// ==========================================
// IMAGE ROUTES
// IMPORTANT: BEFORE /:id
// ==========================================

adminLandsRouter.get(
    "/image/:id",
    getLandMainImage
);

adminLandsRouter.get(
    "/gallery-image/:id",
    getLandGalleryImage
);

adminLandsRouter.get(
    "/video/:id",
    getLandMainVideo
);

// ==========================================
// GET SINGLE LAND
// ==========================================

adminLandsRouter.get(
    "/:id",
    authMiddleware,
    getLandById
);

// ==========================================
// UPDATE LAND
// ==========================================

adminLandsRouter.put(
    "/:id",
    authMiddleware,
    upload.fields([
        {
            name: "main_image",
            maxCount: 1
        },
        {
            name: "main_video",
            maxCount: 1
        },
        {
            name: "images",
            maxCount: 10
        }
    ]),
    updateLand
);

// ==========================================
// DELETE LAND
// ==========================================

adminLandsRouter.delete(
    "/:id",
    authMiddleware,
    deleteLand
);

export default adminLandsRouter;