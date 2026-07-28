
import express from "express";
import {
    addStayToBuy,
    getAllStayToBuy,
    updateStayToBuy,
    deleteStayToBuy
} from "../Controllers/staysToBuyController.js";

import upload from "../Middleware/upload.js";

const staystobuyrouter = express.Router();

// Add Stay To Buy
staystobuyrouter.post(
    "/stays-to-buy",
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
    addStayToBuy
);

// Get All Stay To Buy
staystobuyrouter.get(
    "/show",
    getAllStayToBuy
);

// Update Stay To Buy
staystobuyrouter.put(
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
    updateStayToBuy
);

// Delete Stay To Buy
staystobuyrouter.delete(
    "/:id",
    deleteStayToBuy
);

export default staystobuyrouter;
