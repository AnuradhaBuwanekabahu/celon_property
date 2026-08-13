import express from "express";
import upload from "../Middleware/upload.js";

import {
    addAd,
    getAds,
    getAdById,
    getAdImage,
    updateAd,
    deleteAd
} from "../Controllers/adsController.js";

const adsrouter = express.Router();


// =======================================================
// GET ALL ADS
// GET /api/ads
// =======================================================

adsrouter.get(
    "/",
    getAds
);


// =======================================================
// GET AD IMAGE
// GET /api/ads/image/:id
// IMPORTANT: Must be BEFORE /:id
// =======================================================

adsrouter.get(
    "/image/:id",
    getAdImage
);


// =======================================================
// GET SINGLE AD
// GET /api/ads/:id
// =======================================================

adsrouter.get(
    "/:id",
    getAdById
);


// =======================================================
// ADD AD
// POST /api/ads
// =======================================================

adsrouter.post(
    "/",
    upload.single("image"),
    addAd
);


// =======================================================
// UPDATE AD
// PUT /api/ads/:id
// =======================================================

adsrouter.put(
    "/:id",
    upload.single("image"),
    updateAd
);


// =======================================================
// DELETE AD
// DELETE /api/ads/:id
// =======================================================

adsrouter.delete(
    "/:id",
    deleteAd
);


export default adsrouter;