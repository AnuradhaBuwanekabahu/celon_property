import express from "express";

import upload from "../Middleware/upload.js";

import {
    
    getLands,
    getLandById,
    updateLand,
    deleteLand,
    getLandMainImage,
    getLandGalleryImage,

    getLandMainVideo,
    addLands
} from "../Controllers/landsController.js";


const landsRouter = express.Router();


// ==========================================
// ADD LAND
// ==========================================

landsRouter.post(
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
    addLands
);


// ==========================================
// GET ALL LANDS
// ==========================================

landsRouter.get(
    "/",
    getLands
);


// ==========================================
// GET MAIN IMAGE
// ==========================================

landsRouter.get(
    "/image/:id",
    getLandMainImage
);


// ==========================================
// GET GALLERY IMAGE
// ==========================================

landsRouter.get(
    "/gallery-image/:id",
    getLandGalleryImage
);


// ==========================================
// GET MAIN VIDEO
// ==========================================

landsRouter.get(
    "/video/:id",
    getLandMainVideo
);


// ==========================================
// GET SINGLE LAND
// ==========================================

landsRouter.get(
    "/:id",
    getLandById
);


// ==========================================
// UPDATE LAND
// ==========================================

landsRouter.put(
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
    updateLand
);


// ==========================================
// DELETE LAND
// ==========================================

landsRouter.delete(
    "/:id",
    deleteLand
);


export default landsRouter;