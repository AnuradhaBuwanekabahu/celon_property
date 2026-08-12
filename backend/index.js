import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./configuration/db.js";



import paymentrouter from "./Admin/routers/paymentRoutes.js";
import staystobuyrouter from "./Admin/routers/staytobuyRouter.js";



import dashboardrouter from "./Admin/routers/dashboardRouter.js";
import userRouter from "./Admin/routers/userRouter.js";

import adminRouter from "./Admin/routers/adminRouter.js";
import stayToRentRouter from "./Admin/routers/stayToRentRouter.js";
import adsrouter from "./Admin/routers/adsRoutes.js";
import wantedRouter from "./Admin/routers/wantedRoutes.js";
import landsRouter from "./Admin/routers/landRoutes.js";
import clientRouter from "./Admin/routers/clientRoutes.js";

import hotsalerouter from "./Admin/routers/hotsaleRoutes.js";


dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:5174", "http://127.0.0.1:5174"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options(/.*/, cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/clients", clientRouter);
app.use("/api/ads", adsrouter);
app.use("/api/hotsales", hotsalerouter);
app.use("/api/payment", paymentrouter);
app.use("/api/stays-to-buy", staystobuyrouter);
app.use("/api/stays-to-rent", stayToRentRouter);
app.use("/api/lands", landsRouter);
app.use("/api/users", userRouter);
app.use("/api/dashboard", dashboardrouter);
app.use("/api/wanted", wantedRouter);
app.use("/api/admins", adminRouter);



app.get("/", (req, res) => {
  res.send("Ceylone Property Backend Running");
});

app.get("/test-db", async (req, res) => {
  try {
    const [result] = await db.query("SELECT DATABASE()");

    res.json({
      message: "Database connected successfully",
      database: result[0]["DATABASE()"],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});