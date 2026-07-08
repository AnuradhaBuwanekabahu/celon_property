import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./configuration/database/db.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// Test API
app.get("/", (req,res)=>{
    res.send("Backend is running");
});


// Test Database Connection
app.get("/test-db", async(req,res)=>{

    try{

        const [result] = await db.query(
            "SELECT DATABASE()"
        );

        res.json({
            message:"Database connected",
            database: result
        });

    }catch(error){

        console.log(error);

        res.status(500).json({
            message:"Database connection failed"
        });
    }

});


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});