import express from "express";
import db from "../../configuration/db.js";

import {
    addStayToBuy,
    getAllStayToBuy,
    getStayToBuyById,
    updateStayToBuy,
    deleteStayToBuy
} from "../Controllers/staytobuyController.js";


const stayToBuyRouter = express.Router();


// ==========================
// Add Stay To Buy Property
// ==========================
stayToBuyRouter.post(
    "/",
    addStayToBuy
);

stayToBuyRouter.post(
    "/add",
    addStayToBuy
);


// ==========================
// Get All Stay To Buy Properties
// ==========================
stayToBuyRouter.get(
    "/",
    getAllStayToBuy
);

stayToBuyRouter.get(
    "/status/:status",
    getAllStayToBuy
);

stayToBuyRouter.get(
    "/search",
    getAllStayToBuy
);


// ==========================
// Get Single Property
// ==========================
stayToBuyRouter.get(
    "/:id",
    getStayToBuyById
);


// ==========================
// Update Property
// ==========================
stayToBuyRouter.put(
    "/:id",
    updateStayToBuy
);

stayToBuyRouter.patch(
    "/:id/status",
    async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await db.query("UPDATE stays_to_buy SET status = ? WHERE id = ?", [status, id]);
            res.json({ success: true, data: { id, status } });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);


// ==========================
// Delete Property
// ==========================
stayToBuyRouter.delete(
    "/:id",
    deleteStayToBuy
);


export default stayToBuyRouter;