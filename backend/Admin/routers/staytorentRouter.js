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

const stayToRentRouter = express.Router();

// ==========================================
// ADD STAY TO RENT
// ==========================================

stayToRentRouter.post(
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
    addStayToRent
);

// ==========================================
// GET ALL STAY TO RENT
// ==========================================

stayToRentRouter.get(
    "/",
    getStayToRent
);

// ==========================================
// GET MAIN IMAGE
// ==========================================

stayToRentRouter.get(
    "/image/:id",
    getStayToRentImage
);

// ==========================================
// GET MAIN VIDEO
// ==========================================

stayToRentRouter.get(
    "/video/:id",
    getStayToRentVideo
);

// ==========================================
// GET GALLERY LIST
// ==========================================

stayToRentRouter.get(
    "/gallery/:id",
    getStayToRentGallery
);

// ==========================================
// GET SINGLE GALLERY IMAGE
// ==========================================

stayToRentRouter.get(
    "/gallery-image/:id",
    getStayToRentGalleryImage
);

// ==========================================
// GET SINGLE STAY TO RENT
// ==========================================

stayToRentRouter.get(
    "/:id",
    getStayToRentById
);

// ==========================================
// UPDATE STAY TO RENT
// ==========================================

stayToRentRouter.put(
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
    updateStayToRent
);

// ==========================================
// DELETE STAY TO RENT
// ==========================================

stayToRentRouter.delete(
    "/:id",
    deleteStayToRent
);

export default stayToRentRouter;