

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
import authMiddleware from "../Middleware/authMiddleware.js";

const adminClientsRouter = express.Router();

// Register with optional avatar
adminClientsRouter.post(
    "/register",
    upload.single("avatar"),
    registerClient
);

// Login
adminClientsRouter.post(
    "/login",
    loginClient
);

// Get all clients
adminClientsRouter.get(
    "/",
    authMiddleware,
    getClients
);

// Get client by ID
adminClientsRouter.get(
    "/:id",
    authMiddleware,
    getClientById
);

// Get client avatar
adminClientsRouter.get(
    "/:id/avatar",

    getClientAvatar
);

// Update client with optional avatar
adminClientsRouter.put(
    "/:id",
    upload.single("avatar"),
    authMiddleware,
    updateClient
);

// Update client active status
adminClientsRouter.put(
    "/:id/status",
    authMiddleware,
    updateClientStatus
);

export default adminClientsRouter;
