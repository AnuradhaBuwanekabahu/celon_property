import express from "express";
import upload from "../Middleware/upload.js";

import {
    addStayToRent,
    getAllStayToRent,
    getStayToRentById,
    updateStayToRent,
    deleteStayToRent,
    updateStayToRentStatus
} from "../Controllers/staytorentController.js";

const stayToRentRouter = express.Router();

const uploadFields = upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "main_video", maxCount: 1 },
    { name: "images",     maxCount: 9 }
]);

stayToRentRouter.post("/",    uploadFields, addStayToRent);
stayToRentRouter.get("/",                  getAllStayToRent);
stayToRentRouter.get("/status/:status",    getAllStayToRent);
stayToRentRouter.get("/search",            getAllStayToRent);
stayToRentRouter.get("/:id",               getStayToRentById);
stayToRentRouter.put("/:id",   uploadFields, updateStayToRent);
stayToRentRouter.patch("/:id/status",      updateStayToRentStatus);
stayToRentRouter.delete("/:id",            deleteStayToRent);

export default stayToRentRouter;
