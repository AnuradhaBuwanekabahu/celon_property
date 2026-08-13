import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });


// Debug: show which DB env vars were loaded
console.log(' Loaded DB env:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '***' : undefined,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "",
    database: process.env.DB_NAME || "ceylone_property",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
});

// Check Database Connection
const checkDatabaseConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log(" MySQL Database Connected Successfully!");
        connection.release();
    } catch (error) {
        console.error(" MySQL Database Connection Failed!");
        console.error(error.message);
    }
};

checkDatabaseConnection();

export default db;