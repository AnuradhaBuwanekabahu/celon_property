

import express from "express";
import upload from "../Middleware/upload.js";

import {
    registerClient,
    loginClient,
    getClients,
    getClientById,
    
    updateClient,
    updateClientStatus,
    getClientAvatar
} from "../Controllers/clientController.js";

const clientRouter = express.Router();

// Register with optional avatar
clientRouter.post(
    "/register",
    upload.single("avatar"),
    registerClient
);

// Login
clientRouter.post(
    "/login",
    loginClient
);

// Get all clients
clientRouter.get(
    "/",
    getClients
);

// Get client by ID
clientRouter.get(
    "/:id",
    getClientById
);

// Get client avatar
clientRouter.get(
    "/:id/avatar",
    getClientAvatar
);

// Update client with optional avatar
clientRouter.put(
    "/:id",
    upload.single("avatar"),
    updateClient
);

// Update client active status
clientRouter.put(
    "/:id/status",
    updateClientStatus
);

export default clientRouter;
