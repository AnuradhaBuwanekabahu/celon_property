import pool from '../../configuration/db.js';

class AdLimitController {
    // =========================================================
    // CHECK CLIENT AD LIMIT
    // =========================================================
    static async checkAdLimit(req, res) {
        try {
            const { client_id } = req.params;

            const [rows] = await pool.query(
                'SELECT ads_count, free_tier_limit FROM clients WHERE id = ?',
                [client_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }

            const { ads_count, free_tier_limit } = rows[0];
            const remaining = Math.max(0, free_tier_limit - ads_count);

            res.json({
                success: true,
                data: {
                    used_ads: ads_count,
                    free_limit: free_tier_limit,
                    remaining_free_ads: remaining,
                    can_post_free_ad: remaining > 0
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // UPDATE AD COUNT (When client posts an ad)
    // =========================================================
    static async incrementAdCount(req, res) {
        try {
            const { client_id } = req.params;
            const { count = 1 } = req.body;

            const [result] = await pool.query(
                'UPDATE clients SET ads_count = ads_count + ? WHERE id = ?',
                [count, client_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }

            // Get updated count
            const [rows] = await pool.query(
                'SELECT ads_count, free_tier_limit FROM clients WHERE id = ?',
                [client_id]
            );

            res.json({
                success: true,
                message: 'Ad count updated successfully',
                data: rows[0]
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // RESET AD COUNT (For testing or admin override)
    // =========================================================
    static async resetAdCount(req, res) {
        try {
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can reset ad counts'
                });
            }

            const { client_id } = req.params;

            const [result] = await pool.query(
                'UPDATE clients SET ads_count = 0 WHERE id = ?',
                [client_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }

            res.json({
                success: true,
                message: 'Ad count reset successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default AdLimitController;