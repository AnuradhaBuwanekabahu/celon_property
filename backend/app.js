const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const apiRoutes = require('./src/routes');

// Use routes
app.use('/api', apiRoutes);

// Simple home route (optional - already in index.js)
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Ceylone Property API',
        version: '1.0.0',
        status: 'Running',
        endpoints: {
            test_db: '/api/test-db',
            clients: {
                GET_ALL: '/api/clients',
                GET_ONE: '/api/clients/:id',
                CREATE: '/api/clients',
                UPDATE: '/api/clients/:id',
                DELETE: '/api/clients/:id',
                LOGIN: '/api/clients/login'
            },
            properties: {
                hot_sales: {
                    GET_ALL: '/api/properties/hot-sales',
                    GET_ONE: '/api/properties/hot-sales/:id',
                    CREATE: '/api/properties/hot-sales',
                    UPDATE: '/api/properties/hot-sales/:id',
                    DELETE: '/api/properties/hot-sales/:id',
                    SEARCH: '/api/properties/hot-sales/search',
                    BY_CLIENT: '/api/properties/hot-sales/client/:clientId'
                },
                stays_to_buy: '/api/properties/stays-to-buy',
                stays_to_rent: '/api/properties/stays-to-rent',
                land: '/api/properties/land',
                wanted: '/api/properties/wanted'
            },
            payments: '/api/payments',
            ads: '/api/ads'
        }
    });
});

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        const { testConnection } = require('./src/config/database');
        const connected = await testConnection();
        res.json({
            success: connected,
            message: connected ? 'Database connected successfully!' : 'Database connection failed',
            database: process.env.DB_NAME
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;