import express from "express";


import { getDashboard } from "../Controllers/dashboardController.js";
import authMiddleware from "../Middleware/authMiddleware.js";



const dashboardrouter = express.Router();


// GET DASHBOARD
dashboardrouter.get(
    "/",
    authMiddleware,
    getDashboard
);


export default dashboardrouter;