import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import db from "./configuration/db.js";

// Client Routers
import clientrouter from "./client/routers/clientRoutes.js";
import userrouter from "./client/routers/userRoutes.js";
import adsrouter from "./client/routers/adsRoutes.js";
import hotsalerouter from "./client/routers/hotsaleRoutes.js";
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

/*
==================================================
MIDDLEWARE
==================================================
*/

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());

/*
==================================================
SOCKET.IO
==================================================
*/

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Socket connection
io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Test event
    socket.on("test-message", (data) => {
        console.log("Message from client:", data);

        // Send response back to the same client
        socket.emit("test-response", {
            message: "Message received successfully",
            data: data,
        });
    });

    // Disconnect
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});

/*
==================================================
NORMAL ADMIN ROUTES
==================================================
*/

app.use("/api/dashboard", adminDashboardRouter);
app.use("/api/admins", normalAdminAuthRouter);
app.use("/api/wanted", adminWantedRouter);

/*
==================================================
SUPER ADMIN ROUTES
==================================================
*/

app.use("/api/super-admin", superAdminRouter);
app.use("/api/admin", superAdminAdminRouter);

/*
==================================================
CLIENT + ADMIN FEATURE ROUTES
==================================================
*/

// Clients
app.use("/api/clients", clientrouter);
app.use("/api/clients", adminClientsRouter);

// Users
app.use("/api/users", userrouter);
app.use("/api/users", adminUsersRouter);

// Ads
app.use("/api/ads", adsrouter);
app.use("/api/ads", adminAdsRouter);

// Hot Sales
app.use("/api/hotsales", hotsalerouter);
app.use("/api/hotsales", adminHotsalesRouter);

// Payment
app.use("/api/payment", paymentrouter);
app.use("/api/payment", adminPaymentRouter);

// Stay To Buy
app.use("/api/staystobuy", StayToBuyRouter);
app.use("/api/stays-to-buy", adminStayToBuyRouter);

// Stay To Rent
app.use("/api/staystorent", staystorentrouter);
app.use("/api/stays-to-rent", adminStayToRentRouter);

// Lands
app.use("/api/lands", landsrouter);
app.use("/api/lands", adminLandsRouter);

/*
==================================================
ROOT API
==================================================
*/

app.get("/", (req, res) => {
    res.send("Ceylone Property Backend Running");
});

/*
==================================================
DATABASE TEST
==================================================
*/

app.get("/test-db", async (req, res) => {
    try {
        const [result] = await db.query("SELECT DATABASE()");

        res.json({
            message: "Database connected successfully",
            database: result[0]["DATABASE()"],
        });
    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            message: "Database error",
        });
    }
});

/*
==================================================
START SERVER
==================================================
*/

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO running on port ${PORT}`);
});