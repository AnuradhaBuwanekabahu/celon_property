import express from "express";

import {
    addLands,
    getAllLands,
    showAllLands,
    updateLand,
    deleteLand,
    getLandById,
    getLandMainImage,
    getLandMainVideo,
    getLandImage
} from "../Controllers/landsController.js";

import upload from "../Middleware/upload.js";


const landsrouter = express.Router();


// ==========================
// Add Land
// ==========================

landsrouter.post(
    "/add",
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



// ==========================
// Get All Lands
// ==========================

landsrouter.get(
    "/show",
    getAllLands
);



// ==========================
// Get Single Land
// ==========================

landsrouter.get(
    "/show/:id",
    getLandById
);

landsrouter.get(
    "/main-image/:id",
    getLandMainImage
);

landsrouter.get(
    "/main-video/:id",
    getLandMainVideo
);

landsrouter.get(
    "/image/:id",
    getLandImage
);



// ==========================
// Update Land
// ==========================

landsrouter.put(
    "/edit/:id",
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



// ==========================
// Delete Land
// ==========================

landsrouter.delete(
    "/delete/:id",
    deleteLand
);



export default landsrouter;