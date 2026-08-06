import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "diwya2003",
    database: process.env.DB_NAME || "ceylone_property",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});

// Check Database Connection
const checkDatabaseConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(" MySQL Database Connected Successfully!");
        console.log(` Database: ${process.env.DB_NAME || 'ceylone_property'}`);
        connection.release();
        return true;
    } catch (error) {
        console.error(" MySQL Database Connection Failed!");
        console.error(error.message);
        return false;
    }
};

// Test query function
const testQuery = async () => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Database query test successful:', rows[0].result);
        return rows[0];
    } catch (error) {
        console.error('Database query test failed:', error.message);
        throw error;
    }
};

// Export all
export { 
    pool, 
    checkDatabaseConnection, 
    testQuery 
};

// Default export
export default pool;