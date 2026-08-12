import express from "express";

import upload from "../Middleware/upload.js";
import {  addWanted, getWanted, getWantedById, updateWanted } from "../Controllers/wantedController.js";



const wantedRouter=express.Router();

wantedRouter.post(
    "/",
    upload.fields([
        {
            name: "main_image",
            maxCount: 1
        },
        {
            name: "images",
            maxCount: 10
        }
    ]),
    addWanted
);

wantedRouter.get(
    "/",
    getWanted
);

wantedRouter.get(
    "/:id",
    getWantedById
);

wantedRouter.put(
    "/:id",
    upload.fields([
        {
            name: "main_image",
            maxCount: 1
        },
        {
            name: "images",
            maxCount: 10
        }
    ]),
    updateWanted
);



export default wantedRouter;