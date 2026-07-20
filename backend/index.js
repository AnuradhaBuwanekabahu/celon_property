import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./configuration/db.js";
import clientrouter from "./client/routers/clientRoutes.js";
import adsrouter from "./client/routers/adsRoutes.js";
import hotsalerouter from './client/routers/hotsaleRoutes.js'
dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


app.use("/api/clients", clientrouter);
app.use('/api/ads' ,adsrouter);
app.use('/api/hotsales',hotsalerouter)
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