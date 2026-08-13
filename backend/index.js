import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./configuration/db.js";

// Client Routers
import clientrouter from "./client/routers/clientRoutes.js";
import userrouter from "./client/routers/userRoutes.js";
import adsrouter from "./client/routers/adsRoutes.js";
import hotsalerouter from './client/routers/hotsaleRoutes.js';
import paymentrouter from "./client/routers/paymentRoutes.js";
import StayToBuyRouter from "./client/routers/staytobuyRouter.js";
import staystorentrouter from "./client/routers/staytorentRouter.js";
import landsrouter from "./client/routers/landsRoute.js";

// Super Admin Routers
import superAdminRouter from "./superAdmin/routers/superAdminRoutes.js";
import superAdminAdminRouter from "./superAdmin/routers/adminRoutes.js";

// Normal Admin Routers
import adminDashboardRouter from "./Admin/routers/dashboardRouter.js";
import normalAdminAuthRouter from "./Admin/routers/adminRouter.js";
import adminClientsRouter from "./Admin/routers/clientRoutes.js";
import adminHotsalesRouter from "./Admin/routers/hotsaleRoutes.js";
import adminLandsRouter from "./Admin/routers/landRoutes.js";
import adminStayToBuyRouter from "./Admin/routers/staytobuyRouter.js";
import adminStayToRentRouter from "./Admin/routers/staytorentRouter.js";
import adminAdsRouter from "./Admin/routers/adsRoutes.js";
import adminPaymentRouter from "./Admin/routers/paymentRoutes.js";
import adminUsersRouter from "./Admin/routers/userRouter.js";
import adminWantedRouter from "./Admin/routers/wantedRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Normal Admin specific
app.use("/api/dashboard", adminDashboardRouter);
app.use("/api/admins", normalAdminAuthRouter);
app.use("/api/wanted", adminWantedRouter);

// Super Admin specific
app.use("/api/super-admin", superAdminRouter);
app.use("/api/admin", superAdminAdminRouter);

// Feature routes (Client first, Admin fallback)
app.use("/api/clients", clientrouter);
app.use("/api/clients", adminClientsRouter);

app.use("/api/users", userrouter);
app.use("/api/users", adminUsersRouter);

app.use("/api/ads", adsrouter);
app.use("/api/ads", adminAdsRouter);

app.use("/api/hotsales", hotsalerouter);
app.use("/api/hotsales", adminHotsalesRouter);

app.use("/api/payment", paymentrouter);
app.use("/api/payment", adminPaymentRouter);

app.use("/api/staystobuy", StayToBuyRouter);
app.use("/api/staystobuy", adminStayToBuyRouter);

app.use("/api/staystorent", staystorentrouter);
app.use("/api/staystorent", adminStayToRentRouter);

app.use("/api/lands", landsrouter);
app.use("/api/lands", adminLandsRouter);

// Root & Test API
app.get("/", (req, res) => {
    res.send("Ceylone Property Backend Running");
});

app.get("/test-db", async (req, res) => {
    try {
        const [result] = await db.query("SELECT DATABASE()");
        res.json({
            message: "Database connected successfully",
            database: result[0]["DATABASE()"]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Database error"
        });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});