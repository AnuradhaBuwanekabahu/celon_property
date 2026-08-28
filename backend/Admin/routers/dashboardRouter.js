import express from "express";


import { getDashboard } from "../Controllers/dashboardController.js";
import authMiddleware from "../Middleware/authMiddleware.js";



const adminDashboardRouter = express.Router();


// GET DASHBOARD
adminDashboardRouter.get(
    "/",
    authMiddleware,
    getDashboard
);


export default adminDashboardRouter;