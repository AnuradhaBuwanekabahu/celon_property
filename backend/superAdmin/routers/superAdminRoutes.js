import express from "express";
import { getSystemStats, getRecentActivity } from "../Controllers/dashboardController.js";
import adminRouter from "./adminRoutes.js";
import adsRouter from "./adsRoutes.js";
import clientRouter from "./clientRoutes.js";
import hotSaleRouter from "./hotSaleRoutes.js";
import landsRouter from "./landsRoutes.js";
import paymentRouter from "./paymentRoutes.js";
import staytobuyRouter from "./staytobuyRoutes.js";
import staytorentRouter from "./staytorentRoutes.js";
import wantedRouter from "./wantedRoutes.js";
import offersRouter from "./offersRoutes.js";
import adLimitsRouter from "./adLimitsRoutes.js";

const superAdminRouter = express.Router();

// Dashboard Stats
superAdminRouter.get("/system-stats", getSystemStats);
superAdminRouter.get("/recent-activity", getRecentActivity);

// Mount Admin Specific Resources
superAdminRouter.use("/admin", adminRouter);
superAdminRouter.use("/ads", adsRouter);
superAdminRouter.use("/clients", clientRouter);
superAdminRouter.use("/payments", paymentRouter);

// Property routes — mounted under BOTH old paths and new /properties/* paths
// Old paths (keep for backward compatibility)
superAdminRouter.use("/hotsales", hotSaleRouter);
superAdminRouter.use("/lands", landsRouter);
superAdminRouter.use("/staytobuy", staytobuyRouter);

// New /properties/* paths (frontend sidebar uses these)
superAdminRouter.use("/properties/hot-sales", hotSaleRouter);
superAdminRouter.use("/properties/land", landsRouter);
superAdminRouter.use("/properties/stays-to-buy", staytobuyRouter);
superAdminRouter.use("/properties/stays-to-rent", staytorentRouter);
superAdminRouter.use("/properties/wanted", wantedRouter);

// Offers routes
superAdminRouter.use("/offers", offersRouter);

// Ad limits settings
superAdminRouter.use("/ad-limits", adLimitsRouter);

export default superAdminRouter;
