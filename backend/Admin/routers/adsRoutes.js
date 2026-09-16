import express from "express";

import {
    addAds,
    getAdImage,
    editAds,
    getAds,
    getAdById,
    showAllAds,
    deleteAds
} from "../Controllers/adsController.js";

import upload from "../Middleware/upload.js"


const adsrouter = express.Router();



// Add ad with image

adsrouter.post( "/add", upload.single("image"), addAds);



// Display image

adsrouter.get("/image/:id", getAdImage);

adsrouter.put(
    "/ads/:id",
    upload.single("image"),
    editAds
);

adsrouter.get(
    "/ads",
    getAds
);

adsrouter.get(
    "/ads/:id",
    getAdById
);

adsrouter.get(
    "/showall",
    showAllAds
);

// Delete ad
adsrouter.delete('/delete/:id', deleteAds);

export default adsrouter;