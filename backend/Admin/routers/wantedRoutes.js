import express from "express";

import {
    addWanted,
    getWanted,
    getWantedById,
    updateWanted,
    getMainImage,
    getWantedImage
} from "../Controllers/wantedController.js";


import authMiddleware from "../Middleware/authMiddleware.js";
import upload from "../Middleware/upload.js";

const adminWantedRouter = express.Router();


// =======================================================
// GET IMAGE ROUTES
// IMPORTANT: BEFORE /:id
// =======================================================

adminWantedRouter.get(
    "/main-image/:id",
    getMainImage
);

adminWantedRouter.get(
    "/image/:id",
    getWantedImage
);


// =======================================================
// GET ALL
// =======================================================

adminWantedRouter.get(
    "/",
    authMiddleware,
    getWanted
);


// =======================================================
// GET BY ID
// =======================================================

adminWantedRouter.get(
    "/:id",
    authMiddleware,
    getWantedById
);


// =======================================================
// ADD
// =======================================================

adminWantedRouter.post(
    "/add",
    upload.fields([
        {
            name: "main_image",
            maxCount: 1
        },
        {
            name: "images",
            maxCount: 9
        }
    ]),
    authMiddleware,
    addWanted
);


// =======================================================
// UPDATE
// =======================================================

adminWantedRouter.put(
    "/:id",
    upload.fields([
        {
            name: "main_image",
            maxCount: 1
        },
        {
            name: "images",
            maxCount: 9
        }
    ]),
    authMiddleware,
    updateWanted
);


export default adminWantedRouter;