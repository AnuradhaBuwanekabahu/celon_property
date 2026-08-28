import express from "express";
import upload from "../Middleware/upload.js";

import {
    addAd,
    getAds,
    getAdById,
    getAdImage,
    updateAd,
    deleteAd
} from "../controllers/adsController.js";
import authMiddleware from "../Middleware/authMiddleware.js";


const adminAdsRouter = express.Router();


// =======================================================
// GET ALL ADS
// GET /api/ads
// =======================================================

adminAdsRouter.get(
    "/",
    authMiddleware,
    getAds
);


// =======================================================
// GET AD IMAGE
// GET /api/ads/image/:id
// IMPORTANT: Must be BEFORE /:id
// =======================================================

adminAdsRouter.get(
    "/image/:id",
    
    getAdImage
);


// =======================================================
// GET SINGLE AD
// GET /api/ads/:id
// =======================================================

adminAdsRouter.get(
    "/:id",
    authMiddleware,
    getAdById
);


// =======================================================
// ADD AD
// POST /api/ads
// =======================================================

adminAdsRouter.post(
    "/",
     
    upload.single("image"),
    authMiddleware,
    
    addAd
);


// =======================================================
// UPDATE AD
// PUT /api/ads/:id
// =======================================================

adminAdsRouter.put(
    "/:id",
     
    upload.single("image"),
    authMiddleware,
    updateAd
);


// =======================================================
// DELETE AD
// DELETE /api/ads/:id
// =======================================================

adminAdsRouter.delete(
    "/:id",
   authMiddleware,
    deleteAd
);


export default adminAdsRouter;