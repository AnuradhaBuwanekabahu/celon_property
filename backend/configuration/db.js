import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
     maxAllowedPacket: 67108864,

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