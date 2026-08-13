import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import upload from "../Middleware/upload.js";
import { registerClient, loginClient, getClientData, updateClientProfile, changeClientPassword } from "../Controllers/clientController.js";

const clientrouter = express.Router();


clientrouter.post("/register", registerClient);
clientrouter.post("/login", loginClient);
clientrouter.get("/:id", getClientData);
clientrouter.put("/:id", authMiddleware, upload.single("avatar"), updateClientProfile);
clientrouter.put("/:id/change-password", authMiddleware, changeClientPassword);

export default clientrouter;