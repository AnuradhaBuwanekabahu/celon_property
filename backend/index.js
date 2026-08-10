import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./configuration/db.js";
import clientrouter from "./client/routers/clientRoutes.js";
import userrouter from "./client/routers/userRoutes.js";
import adsrouter from "./client/routers/adsRoutes.js";
import hotsalerouter from './client/routers/hotsaleRoutes.js'
import paymentrouter from "./client/routers/paymentRoutes.js";
import StayToBuyRouter from "./client/routers/staytobuyRouter.js";
import staystorentrouter from "./client/routers/staytorentRouter.js";
import landsrouter from "./client/routers/landsRoute.js";
dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


app.use("/api/clients", clientrouter);
app.use("/api/users", userrouter);
app.use('/api/ads' ,adsrouter);
app.use('/api/hotsales',hotsalerouter);
app.use('/api/payment',paymentrouter)
app.use('/api/staystobuy',StayToBuyRouter)
app.use('/api/staystorent', staystorentrouter)
app.use('/api/lands',landsrouter)
// Test API
app.get("/", (req, res) => {
  
    res.send("Ceylone Property Backend Running ");
});



// Optional database test route
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