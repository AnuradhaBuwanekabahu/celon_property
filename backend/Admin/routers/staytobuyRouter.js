
import express from "express";

import upload from "../Middleware/upload.js";

import {
    addStayToBuy,
    
    getAllStayToBuy,
    getStayToBuyById,
    getStayToBuyImage,
    getStayToBuyVideo,
    getStayToBuyGallery,
    getStayToBuyGalleryImage,
    updateStayToBuy,
    deleteStayToBuy,
    getStayToBuy
} from "../Controllers/salestobuyController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const adminStayToBuyRouter = express.Router();

// ======================================================
// ADD STAY TO BUY
// ======================================================

adminStayToBuyRouter.post(
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
    addStayToBuy
);

// ======================================================
// GET ALL STAY TO BUY
// ======================================================

adminStayToBuyRouter.get(
    "/",
    authMiddleware,
    getStayToBuy
);

// ======================================================
// GET MAIN IMAGE
// ======================================================

adminStayToBuyRouter.get(
    "/image/:id",
    getStayToBuyImage
);

// ======================================================
// GET MAIN VIDEO
// ======================================================

adminStayToBuyRouter.get(
    "/video/:id",
    getStayToBuyVideo
);

// ======================================================
// GET GALLERY LIST
// ======================================================

adminStayToBuyRouter.get(
    "/gallery/:id",
    getStayToBuyGallery
);

// ======================================================
// GET SINGLE GALLERY IMAGE
// ======================================================

adminStayToBuyRouter.get(
    "/gallery-image/:id",
    getStayToBuyGalleryImage
);

// ======================================================
// GET SINGLE STAY TO BUY
// IMPORTANT: Keep this AFTER /image, /video,
// /gallery and /gallery-image routes.
// ======================================================

adminStayToBuyRouter.get(
    "/:id",
    authMiddleware,
    getStayToBuyById
);

// ======================================================
// UPDATE STAY TO BUY
// ======================================================

adminStayToBuyRouter.put(
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
    updateStayToBuy
);

// ======================================================
// DELETE STAY TO BUY
// ======================================================

adminStayToBuyRouter.delete(
    "/:id",
    authMiddleware,
    deleteStayToBuy
);

export default adminStayToBuyRouter;

