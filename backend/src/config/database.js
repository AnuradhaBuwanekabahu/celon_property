const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ceylone_property',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promisify for async/await
const db = pool.promise();

// Test connection
const testConnection = async () => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log('Database connected successfully!');
        console.log(`Database: ${process.env.DB_NAME}`);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        console.error('Please check your MySQL credentials in .env file');
        return false;
    }
};

module.exports = {
    db,
    testConnection,
    pool
};