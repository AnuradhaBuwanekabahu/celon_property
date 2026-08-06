import pool from '../../configuration/db.js';

class AdsController {
    // =========================================================
    // GET ALL ADS
    // =========================================================
    static async getAllAds(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT a.*, c.full_name as client_name, c.email as client_email
                FROM ads a 
                JOIN clients c ON a.client_id = c.id 
                ORDER BY a.created_at DESC
            `);

            res.json({
                success: true,
                count: rows.length,
                data: rows
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // GET PENDING ADS
    // =========================================================
    static async getPendingAds(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT a.*, c.full_name as client_name, c.email as client_email
                FROM ads a 
                JOIN clients c ON a.client_id = c.id 
                WHERE a.is_approved = FALSE 
                ORDER BY a.created_at ASC
            `);

            res.json({
                success: true,
                count: rows.length,
                data: rows
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // GET AD BY ID
    // =========================================================
    static async getAdById(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT a.*, c.full_name as client_name, c.email as client_email
                FROM ads a 
                JOIN clients c ON a.client_id = c.id 
                WHERE a.id = ?
            `, [req.params.id]);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Ad not found'
                });
            }

            res.json({
                success: true,
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
    // APPROVE AD
    // =========================================================
    static async approveAd(req, res) {
        try {
            const [result] = await pool.query(
                `UPDATE ads SET 
                    is_approved = TRUE, 
                    approved_by = ?, 
                    approved_at = NOW(),
                    is_active = TRUE
                WHERE id = ?`,
                [req.admin.id, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Ad not found'
                });
            }

            res.json({
                success: true,
                message: 'Ad approved successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // REJECT AD
    // =========================================================
    static async rejectAd(req, res) {
        try {
            const [result] = await pool.query(
                'UPDATE ads SET is_active = FALSE, is_approved = FALSE WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Ad not found'
                });
            }

            res.json({
                success: true,
                message: 'Ad rejected successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // DELETE AD (Super Admin Only)
    // =========================================================
    static async deleteAd(req, res) {
        try {
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can delete ads'
                });
            }

            const [result] = await pool.query('DELETE FROM ads WHERE id = ?', [req.params.id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Ad not found'
                });
            }

            res.json({
                success: true,
                message: 'Ad deleted successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default AdsController;