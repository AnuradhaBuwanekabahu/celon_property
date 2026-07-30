import express from "express";

import {
    registerClient,
    loginClient
} from "../controllers/clientController.js";


const clientRouter = express.Router();



// Client Register

clientRouter.post(
    "/register",
    registerClient
);



// Client Login

clientRouter.post(
    "/login",
    loginClient
);



export default clientRouter;