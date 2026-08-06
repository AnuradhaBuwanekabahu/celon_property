import pool from '../../configuration/db.js';

class DashboardController {
    // =========================================================
    // GET DASHBOARD STATS
    // =========================================================
    static async getStats(req, res) {
        try {
            const [clientCount] = await pool.query('SELECT COUNT(*) as total FROM clients WHERE is_active = TRUE');
            const [propertyCount] = await pool.query('SELECT COUNT(*) as total FROM hot_sales WHERE status = "active"');
            const [adCount] = await pool.query('SELECT COUNT(*) as total FROM ads WHERE is_active = TRUE AND is_approved = TRUE');
            const [paymentCount] = await pool.query('SELECT COUNT(*) as total FROM payments WHERE status = "paid"');
            const [pendingAds] = await pool.query('SELECT COUNT(*) as total FROM ads WHERE is_approved = FALSE');
            const [pendingAdmins] = await pool.query('SELECT COUNT(*) as total FROM admins WHERE is_approved = FALSE');
            const [totalRevenue] = await pool.query('SELECT SUM(amount) as total FROM payments WHERE status = "paid"');

            // Recent activities
            const [recentClients] = await pool.query(`
                SELECT id, full_name, created_at 
                FROM clients 
                ORDER BY created_at DESC 
                LIMIT 5
            `);

            const [recentProperties] = await pool.query(`
                SELECT id, title, created_at 
                FROM hot_sales 
                ORDER BY created_at DESC 
                LIMIT 5
            `);

            res.json({
                success: true,
                data: {
                    clients: clientCount[0].total || 0,
                    properties: propertyCount[0].total || 0,
                    ads: adCount[0].total || 0,
                    payments: paymentCount[0].total || 0,
                    pending_ads: pendingAds[0].total || 0,
                    pending_admins: pendingAdmins[0].total || 0,
                    total_revenue: totalRevenue[0].total || 0,
                    recent_activities: {
                        clients: recentClients,
                        properties: recentProperties
                    }
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default DashboardController;