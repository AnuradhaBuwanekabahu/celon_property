
import express from "express";
import {
    addStayToBuy,
    getAllStayToBuy,
    updateStayToBuy,
    deleteStayToBuy,
    getStayToBuyById
} from "../Controllers/salestobuyController.js";

import upload from "../Middleware/upload.js";

const staystobuyrouter = express.Router();

// Add Stay To Buy
staystobuyrouter.post(
    "/add",
    upload.fields([
        {
            name: "main_image",
            maxCount: 1
        },
        {
            name:"main_video",
            maxCount:1
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

staystobuyrouter.get(
    "/show/:id",
    getStayToBuyById
);

// Delete Stay To Buy
staystobuyrouter.delete(
    "/delete/:id",
    deleteStayToBuy
);

export default staystobuyrouter;
