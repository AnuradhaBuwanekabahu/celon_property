import express from "express";


import {

    getHotSales,
    updateHotSale,
    deleteHotSale,
    updatePropertyStatus

} from "../Controllers/hotsalesController.js";


import upload from "../Middleware/upload.js";

import authMiddleware from "../Middleware/authMiddleware.js";


const hotSaleRouter = express.Router();



// Get All Hot Sales

hotSaleRouter.get(

    "/show",

    authMiddleware,

    getHotSales

);




// Update Hot Sale

hotSaleRouter.put(

    "/:id",

    authMiddleware,

    upload.fields([

        {
            name:"main_image",
            maxCount:1
        },

        {
            name:"images",
            maxCount:10
        }

    ]),

    updateHotSale

);




// Delete Hot Sale

hotSaleRouter.delete(

    "/:id",

    authMiddleware,

    deleteHotSale

);




// Approve / Reject Property

hotSaleRouter.patch(

    "/status/:id",

    authMiddleware,

    updatePropertyStatus

);



export default hotSaleRouter;