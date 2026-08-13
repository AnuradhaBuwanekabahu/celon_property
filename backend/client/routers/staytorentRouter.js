import express from "express";

import {
    addStayToRent,
    getAllStayToRent,
    showAllStayToRent,
    updateStayToRent,
    deleteStayToRent,
    getStayToRentById
} from "../Controllers/staystorentController.js";

import upload from "../Middleware/upload.js";


const staystorentrouter = express.Router();


// ==========================
// Add Stay To Rent
// ==========================

staystorentrouter.post(
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
    addStayToRent
);



// ==========================
// Get All Stay To Rent
// ==========================

staystorentrouter.get(
    "/show",
    getAllStayToRent
);

staystorentrouter.get(
    "/showall",
    showAllStayToRent
);



// ==========================
// Get Single Stay To Rent
// ==========================

staystorentrouter.get(
    "/show/:id",
    getStayToRentById
);



// ==========================
// Update Stay To Rent
// ==========================

staystorentrouter.put(
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
    updateStayToRent
);



// ==========================
// Delete Stay To Rent
// ==========================

staystorentrouter.delete(
    "/delete/:id",
    deleteStayToRent
);



export default staystorentrouter;