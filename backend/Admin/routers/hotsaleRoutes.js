
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


const hotsalerouter = express.Router();


// =======================================================
// GET ALL HOT SALES
// GET /api/hotsales
// =======================================================

hotsalerouter.get(
    "/",
    getHotSales
);


// =======================================================
// ADD HOT SALE
// POST /api/hotsales/add
// =======================================================

hotsalerouter.post(
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

    addHotSale
);


// =======================================================
// MAIN IMAGE
// GET /api/hotsales/main-image/:id
// =======================================================

hotsalerouter.get(
    "/main-image/:id",
    getMainImage
);


// =======================================================
// GALLERY IMAGE
// GET /api/hotsales/image/:id
// =======================================================

hotsalerouter.get(
    "/image/:id",
    getHotSaleImage
);


// =======================================================
// MAIN VIDEO
// GET /api/hotsales/main-video/:id
// =======================================================

hotsalerouter.get(
    "/main-video/:id",
    getMainVideo
);


// =======================================================
// GET SINGLE HOT SALE
// GET /api/hotsales/:id
// =======================================================

hotsalerouter.get(
    "/:id",
    getHotSaleById
);


// =======================================================
// UPDATE HOT SALE
// PUT /api/hotsales/:id
// =======================================================

hotsalerouter.put(
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

    editHotSale
);


// =======================================================
// DELETE HOT SALE
// DELETE /api/hotsales/:id
// =======================================================

hotsalerouter.delete(
    "/:id",
    deleteHotSale
);


export default hotsalerouter;
