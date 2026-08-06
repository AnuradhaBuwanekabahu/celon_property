import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
    try {
        console.log("⏳ Connecting to MySQL server...");
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });

        console.log("📄 Reading schema.sql...");
        const sqlPath = path.join(__dirname, "schema.sql");
        const sql = fs.readFileSync(sqlPath, "utf8");

        console.log("⚡ Creating database 'ceylone_property' and tables...");
        await connection.query(sql);

        console.log("✅ Database 'ceylone_property' and all tables initialized successfully in MySQL!");
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to initialize database:", error.message);
        process.exit(1);
    }
}

initDatabase();
