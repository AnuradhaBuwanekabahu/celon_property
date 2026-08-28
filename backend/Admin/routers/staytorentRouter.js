import express from "express";

import upload from "../Middleware/upload.js";

import {
    addStayToRent,
    getStayToRent,
    getAllStayToRent,
    getStayToRentById,
    getStayToRentImage,
    getStayToRentVideo,
    getStayToRentGallery,
    getStayToRentGalleryImage,
    updateStayToRent,
    deleteStayToRent
} from "../Controllers/staystorentController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const adminStayToRentRouter = express.Router();

// ==========================================
// ADD STAY TO RENT
// ==========================================

adminStayToRentRouter.post(
    "/",
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
    authMiddleware,
    addStayToRent
);

// ==========================================
// GET ALL STAY TO RENT
// ==========================================

adminStayToRentRouter.get(
    "/",
    authMiddleware,
    getStayToRent
);

// ==========================================
// GET MAIN IMAGE
// ==========================================

adminStayToRentRouter.get(
    "/image/:id",
    getStayToRentImage
);

// ==========================================
// GET MAIN VIDEO
// ==========================================

adminStayToRentRouter.get(
    "/video/:id",
    getStayToRentVideo
);

// ==========================================
// GET GALLERY LIST
// ==========================================

adminStayToRentRouter.get(
    "/gallery/:id",
    getStayToRentGallery
);

// ==========================================
// GET SINGLE GALLERY IMAGE
// ==========================================

adminStayToRentRouter.get(
    "/gallery-image/:id",
    getStayToRentGalleryImage
);

// ==========================================
// GET SINGLE STAY TO RENT
// ==========================================

adminStayToRentRouter.get(
    "/:id",
    authMiddleware,
    getStayToRentById
);

// ==========================================
// UPDATE STAY TO RENT
// ==========================================

adminStayToRentRouter.put(
    "/:id",
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
    authMiddleware,
    updateStayToRent
);

// ==========================================
// DELETE STAY TO RENT
// ==========================================

adminStayToRentRouter.delete(
    "/:id",
    authMiddleware,
    deleteStayToRent
);

export default adminStayToRentRouter;