import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
    host: "localhost",
    user: "kavindi",
    password: "tmKA@arunika1234",
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


// Check Database Connection
const checkDatabaseConnection = async () => {
    try {
        const connection = await db.getConnection();

        console.log("✅ MySQL Database Connected Successfully!");

        connection.release();

    } catch (error) {
        console.error("❌ MySQL Database Connection Failed!");
        console.error(error.message);
    }
};


checkDatabaseConnection();


export default db;