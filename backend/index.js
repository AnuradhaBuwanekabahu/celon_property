import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool, checkDatabaseConnection } from "./configuration/db.js";

// Client Routers
import clientrouter from "./client/routers/clientRoutes.js";
import adsrouter from "./client/routers/adsRoutes.js";
import hotsalerouter from './client/routers/hotsaleRoutes.js';
import paymentrouter from "./client/routers/paymentRoutes.js";

// Admin Routers (Separate files)
import adminAuthRoutes from "./admin/routers/adminAuthRoutes.js";
import adminDashboardRoutes from "./admin/routers/adminDashboardRoutes.js";
import adminClientRoutes from "./admin/routers/adminClientRoutes.js";
import adminAdsRoutes from "./admin/routers/adminAdsRoutes.js";
import adminApprovalRoutes from "./admin/routers/adminApprovalRoutes.js";
import adminPaymentRoutes from "./admin/routers/adminPaymentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// =========================================================
// CLIENT API ENDPOINTS
// =========================================================
app.use("/api/clients", clientrouter);
app.use('/api/ads', adsrouter);
app.use('/api/hotsales', hotsalerouter);
app.use('/api/payment', paymentrouter);

// =========================================================
// ADMIN API ENDPOINTS
// =========================================================
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/clients", adminClientRoutes);
app.use("/api/admin/ads", adminAdsRoutes);
app.use("/api/admin/approval", adminApprovalRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);

// =========================================================
// TEST ROUTES
// =========================================================

// Test API
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Ceylone Property Backend Running",
        version: "1.0.0",
        endpoints: {
            client: "/api/clients",
            ads: "/api/ads",
            hotSales: "/api/hotsales",
            payment: "/api/payment",
            admin: {
                auth: "/api/admin/auth",
                dashboard: "/api/admin/dashboard",
                clients: "/api/admin/clients",
                ads: "/api/admin/ads",
                approval: "/api/admin/approval",
                payments: "/api/admin/payments"
            }
        }
    });
});

// Database test route
app.get("/test-db", async (req, res) => {
    try {
        const [result] = await pool.query("SELECT DATABASE() as database_name");
        res.json({
            success: true,
            message: "Database connected successfully",
            database: result[0].database_name
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            success: false,
            message: "Database error",
            error: error.message
        });
    }
});

// =========================================================
// 404 HANDLER
// =========================================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// =========================================================
// ERROR HANDLING MIDDLEWARE
// =========================================================
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// =========================================================
// START SERVER
// =========================================================
const startServer = async () => {
    console.log('🔌 Testing database connection...');
    const isConnected = await checkDatabaseConnection();

    if (!isConnected) {
        console.error('Server cannot start without database connection');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Database: ${process.env.DB_NAME}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        
    });
};

startServer();