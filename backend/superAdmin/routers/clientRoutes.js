import express from "express";

import {
    getAllClients,
    getClientsByStatus,
    searchClients,
    updateClient,
    deleteClient
} from "../Controllers/clientController.js";

const clientRouter = express.Router();

// Get all clients
clientRouter.get("/", getAllClients);

// Get clients by status
clientRouter.get("/status/:status", getClientsByStatus);

// Search clients
clientRouter.get("/search", searchClients);

// Update client
clientRouter.put("/:id", updateClient);

// Delete client
clientRouter.delete("/:id", deleteClient);

export default clientRouter;