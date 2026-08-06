import pool from '../../configuration/db.js';

class LandsController {
    // =========================================================
    // GET ALL LANDS
    // =========================================================
    static async getAll(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT l.*, c.full_name as client_name, c.email as client_email
                FROM land l 
                JOIN clients c ON l.client_id = c.id 
                ORDER BY l.created_at DESC
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
    // GET LAND BY ID
    // =========================================================
    static async getById(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT l.*, c.full_name as client_name, c.email as client_email
                FROM land l 
                JOIN clients c ON l.client_id = c.id 
                WHERE l.id = ?
            `, [req.params.id]);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Land not found'
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
    // APPROVE LAND
    // =========================================================
    static async approve(req, res) {
        try {
            const [result] = await pool.query(
                'UPDATE land SET status = "active" WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Land not found'
                });
            }

            res.json({
                success: true,
                message: 'Land approved successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // REJECT LAND
    // =========================================================
    static async reject(req, res) {
        try {
            const [result] = await pool.query(
                'UPDATE land SET status = "pending" WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Land not found'
                });
            }

            res.json({
                success: true,
                message: 'Land rejected successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // DELETE LAND (Super Admin Only)
    // =========================================================
    static async delete(req, res) {
        try {
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can delete lands'
                });
            }

            const [result] = await pool.query('DELETE FROM land WHERE id = ?', [req.params.id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Land not found'
                });
            }

            res.json({
                success: true,
                message: 'Land deleted successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default LandsController;