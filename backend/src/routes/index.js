const express = require('express');
const router = express.Router();

// Import routes
const clients = require('./clients');
const hotSales = require('./hotSales');
const staysToBuy = require('./staysToBuy');
const staysToRent = require('./staysToRent');
const land = require('./land');
const wanted = require('./wanted');
const payments = require('./payments');
const ads = require('./ads');

// Use routes
router.use('/clients', clients);
router.use('/properties/hot-sales', hotSales);
router.use('/properties/stays-to-buy', staysToBuy);
router.use('/properties/stays-to-rent', staysToRent);
router.use('/properties/land', land);
router.use('/properties/wanted', wanted);
router.use('/payments', payments);
router.use('/ads', ads);

// Test database connection endpoint
router.get('/test-db', async (req, res) => {
    try {
        const { testConnection } = require('../config/database');
        const connected = await testConnection();
        res.json({
            success: connected,
            message: connected ? '✅ Database connected successfully!' : '❌ Database connection failed',
            database: process.env.DB_NAME
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Home route
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Ceylone Property API',
        version: '1.0.0',
        status: 'Running',
        endpoints: {
            clients: '/api/clients',
            properties: {
                hot_sales: '/api/properties/hot-sales',
                stays_to_buy: '/api/properties/stays-to-buy',
                stays_to_rent: '/api/properties/stays-to-rent',
                land: '/api/properties/land',
                wanted: '/api/properties/wanted'
            },
            payments: '/api/payments',
            ads: '/api/ads',
            test_db: '/api/test-db'
        }
    });
});

module.exports = router;