const app = require('./app');
const { testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Test database connection before starting server
const startServer = async () => {
    console.log('🔌 Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
        console.error('Server cannot start without database connection');
        console.log('Please check:');
        console.log('   1. MySQL is running');
        console.log('   2. .env file has correct credentials');
        console.log('   3. Database "ceylone_property" exists');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Database: ${process.env.DB_NAME}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log('');
        console.log('Available endpoints:');
        console.log(`   GET  /api/                 - API Info`);
        console.log(`   GET  /api/test-db          - Test Database Connection`);
        console.log(`   GET  /api/clients          - Get all clients`);
        console.log(`   GET  /api/properties/hot-sales - Get all properties`);
    });
};

startServer();