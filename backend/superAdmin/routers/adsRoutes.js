import express from "express";


import {
    createAd,
    getAdImage,
    updateAd,
    getAds,
    deleteAd,
    toggleAdStatus
} from "../Controllers/adsController.js";


import upload from "../Middleware/upload.js";

import authMiddleware from "../Middleware/authMiddleware.js";


const adsRouter = express.Router();



// Add Advertisement
adsRouter.post(
    "/",
    authMiddleware,
    upload.single("image"),
    createAd
);

adsRouter.post(
    "/add",
    authMiddleware,
    upload.single("image"),
    createAd
);



// Display Advertisement Image
adsRouter.get(
    "/image/:id",
    getAdImage
);



// Update Advertisement
adsRouter.put(
    "/:id",
    authMiddleware,
    upload.single("image"),
    updateAd
);



// Get All Ads
adsRouter.get(
    "/",
    authMiddleware,
    getAds
);



// Delete Advertisement
adsRouter.delete(
    "/:id",
    authMiddleware,
    deleteAd
);



// Change Advertisement Status
adsRouter.patch(
    "/:id/toggle",
    authMiddleware,
    toggleAdStatus
);

adsRouter.patch(
    "/status/:id",
    authMiddleware,
    toggleAdStatus
);



export default adsRouter;