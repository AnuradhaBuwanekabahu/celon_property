import pool from '../../configuration/db.js';

class AdminService {
    // =========================================================
    // GET DASHBOARD STATS
    // =========================================================
    async getDashboardStats() {
        try {
            const [clientCount] = await pool.query('SELECT COUNT(*) as total FROM clients WHERE is_active = TRUE');
            const [propertyCount] = await pool.query('SELECT COUNT(*) as total FROM hot_sales WHERE status = "active"');
            const [adCount] = await pool.query('SELECT COUNT(*) as total FROM ads WHERE is_active = TRUE AND is_approved = TRUE');
            const [paymentCount] = await pool.query('SELECT COUNT(*) as total FROM payments WHERE status = "paid"');
            const [pendingAds] = await pool.query('SELECT COUNT(*) as total FROM ads WHERE is_approved = FALSE');
            const [pendingAdmins] = await pool.query('SELECT COUNT(*) as total FROM admins WHERE is_approved = FALSE');
            const [totalRevenue] = await pool.query('SELECT SUM(amount) as total FROM payments WHERE status = "paid"');

            return {
                clients: clientCount[0].total || 0,
                properties: propertyCount[0].total || 0,
                ads: adCount[0].total || 0,
                payments: paymentCount[0].total || 0,
                pending_ads: pendingAds[0].total || 0,
                pending_admins: pendingAdmins[0].total || 0,
                total_revenue: totalRevenue[0].total || 0
            };
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            throw error;
        }
    }

    // =========================================================
    // CHECK AD LIMIT
    // =========================================================
    async checkAdLimit(clientId) {
        try {
            const [rows] = await pool.query(
                'SELECT ads_count, free_tier_limit FROM clients WHERE id = ?',
                [clientId]
            );
            
            if (rows.length === 0) {
                throw new Error('Client not found');
            }
            
            const { ads_count, free_tier_limit } = rows[0];
            const remaining = Math.max(0, free_tier_limit - ads_count);
            
            return {
                canPostFreeAd: remaining > 0,
                used_ads: ads_count,
                free_limit: free_tier_limit,
                remaining_free_ads: remaining
            };
        } catch (error) {
            console.error('Error checking ad limit:', error);
            throw error;
        }
    }
}

export default new AdminService();