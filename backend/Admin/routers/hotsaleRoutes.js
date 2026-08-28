
import express from "express";

import {
    addHotSale,
    getHotSales,
    getHotSaleById,
    editHotSale,
    deleteHotSale,
    getMainImage,
    getHotSaleImage,
    getMainVideo
} from "../Controllers/hotsalesController.js";

import upload from "../middleware/upload.js";
import authMiddleware from "../Middleware/authMiddleware.js";


const adminHotsalesRouter = express.Router();


// =======================================================
// GET ALL HOT SALES
// GET /api/hotsales
// =======================================================

adminHotsalesRouter.get(
    "/",
    authMiddleware,
    getHotSales
);


// =======================================================
// ADD HOT SALE
// POST /api/hotsales/add
// =======================================================

adminHotsalesRouter.post(
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
            maxCount: 9
        }
    ]),
    authMiddleware,

    addHotSale
);


// =======================================================
// MAIN IMAGE
// GET /api/hotsales/main-image/:id
// =======================================================

adminHotsalesRouter.get(
    "/main-image/:id",
    
    getMainImage
);


// =======================================================
// GALLERY IMAGE
// GET /api/hotsales/image/:id
// =======================================================

adminHotsalesRouter.get(
    "/image/:id",
    getHotSaleImage
);


// =======================================================
// MAIN VIDEO
// GET /api/hotsales/main-video/:id
// =======================================================

adminHotsalesRouter.get(
    "/main-video/:id",
    getMainVideo
);


// =======================================================
// GET SINGLE HOT SALE
// GET /api/hotsales/:id
// =======================================================

adminHotsalesRouter.get(
    "/:id",
    authMiddleware,
    getHotSaleById
);


// =======================================================
// UPDATE HOT SALE
// PUT /api/hotsales/:id
// =======================================================

adminHotsalesRouter.put(
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
            maxCount: 9
        }
    ]),
    authMiddleware,
    

    editHotSale
);


// =======================================================
// DELETE HOT SALE
// DELETE /api/hotsales/:id
// =======================================================

adminHotsalesRouter.delete(
    "/:id",
    authMiddleware,
    deleteHotSale
);


export default adminHotsalesRouter;
