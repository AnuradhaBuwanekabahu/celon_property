import express from "express";

import {
    addStayToBuy,
    getAllStayToBuy,
    getStayToBuyById,
    updateStayToBuy,
    deleteStayToBuy
} from "../controllers/staytobuyController.js";


const stayToBuyRouter = express.Router();


// ==========================
// Add Stay To Buy Property
// POST /api/superadmin/stays-to-buy/add
// ==========================
stayToBuyRouter.post(
    "/add",
    addStayToBuy
);



// ==========================
// Get All Stay To Buy Properties
// GET /api/superadmin/stays-to-buy
// ==========================
stayToBuyRouter.get(
    "/",
    getAllStayToBuy
);



// ==========================
// Get Single Property
// GET /api/superadmin/stays-to-buy/:id
// ==========================
stayToBuyRouter.get(
    "/:id",
    getStayToBuyById
);



// ==========================
// Update Property
// PUT /api/superadmin/stays-to-buy/:id
// ==========================
stayToBuyRouter.put(
    "/:id",
    updateStayToBuy
);



// ==========================
// Delete Property
// DELETE /api/superadmin/stays-to-buy/:id
// ==========================
stayToBuyRouter.delete(
    "/:id",
    deleteStayToBuy
);



export default stayToBuyRouter;