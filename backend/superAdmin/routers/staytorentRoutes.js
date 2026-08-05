import express from "express";
import {
    addStayToRent,
    getAllStayToRent,
    getStayToRentById,
    updateStayToRent,
    deleteStayToRent,
    updateStayToRentStatus
} from "../Controllers/staytorentController.js";

const stayToRentRouter = express.Router();

stayToRentRouter.post("/", addStayToRent);
stayToRentRouter.get("/", getAllStayToRent);
stayToRentRouter.get("/status/:status", getAllStayToRent);
stayToRentRouter.get("/search", getAllStayToRent);
stayToRentRouter.get("/:id", getStayToRentById);
stayToRentRouter.put("/:id", updateStayToRent);
stayToRentRouter.patch("/:id/status", updateStayToRentStatus);
stayToRentRouter.delete("/:id", deleteStayToRent);

export default stayToRentRouter;
