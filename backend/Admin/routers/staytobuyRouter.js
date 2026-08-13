
import express from "express";

import upload from "../Middleware/upload.js";

import {
    addStayToBuy,
    getStayToBuy,
    getAllStayToBuy,
    getStayToBuyById,
    getStayToBuyImage,
    getStayToBuyVideo,
    getStayToBuyGallery,
    getStayToBuyGalleryImage,
    updateStayToBuy,
    deleteStayToBuy
} from "../Controllers/salestobuyController.js";

const stayToBuyRouter = express.Router();

// ======================================================
// ADD STAY TO BUY
// ======================================================

stayToBuyRouter.post(
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
    addStayToBuy
);

// ======================================================
// GET ALL STAY TO BUY
// ======================================================

stayToBuyRouter.get(
    "/",
    getStayToBuy
);

// ======================================================
// GET MAIN IMAGE
// ======================================================

stayToBuyRouter.get(
    "/image/:id",
    getStayToBuyImage
);

// ======================================================
// GET MAIN VIDEO
// ======================================================

stayToBuyRouter.get(
    "/video/:id",
    getStayToBuyVideo
);

// ======================================================
// GET GALLERY LIST
// ======================================================

stayToBuyRouter.get(
    "/gallery/:id",
    getStayToBuyGallery
);

// ======================================================
// GET SINGLE GALLERY IMAGE
// ======================================================

stayToBuyRouter.get(
    "/gallery-image/:id",
    getStayToBuyGalleryImage
);

// ======================================================
// GET SINGLE STAY TO BUY
// IMPORTANT: Keep this AFTER /image, /video,
// /gallery and /gallery-image routes.
// ======================================================

stayToBuyRouter.get(
    "/:id",
    getStayToBuyById
);

// ======================================================
// UPDATE STAY TO BUY
// ======================================================

stayToBuyRouter.put(
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
    updateStayToBuy
);

// ======================================================
// DELETE STAY TO BUY
// ======================================================

stayToBuyRouter.delete(
    "/:id",
    deleteStayToBuy
);

export default stayToBuyRouter;

