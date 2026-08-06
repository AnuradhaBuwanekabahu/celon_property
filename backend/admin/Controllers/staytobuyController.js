import pool from '../../configuration/db.js';

class StayToBuyController {
    // =========================================================
    // GET ALL STAYS TO BUY
    // =========================================================
    static async getAll(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT s.*, c.full_name as client_name, c.email as client_email
                FROM stays_to_buy s 
                JOIN clients c ON s.client_id = c.id 
                ORDER BY s.created_at DESC
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
    // GET STAY TO BUY BY ID
    // =========================================================
    static async getById(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT s.*, c.full_name as client_name, c.email as client_email
                FROM stays_to_buy s 
                JOIN clients c ON s.client_id = c.id 
                WHERE s.id = ?
            `, [req.params.id]);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Stay to buy not found'
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
    // APPROVE STAY TO BUY
    // =========================================================
    static async approve(req, res) {
        try {
            const [result] = await pool.query(
                'UPDATE stays_to_buy SET status = "active" WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Stay to buy not found'
                });
            }

            res.json({
                success: true,
                message: 'Stay to buy approved successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // REJECT STAY TO BUY
    // =========================================================
    static async reject(req, res) {
        try {
            const [result] = await pool.query(
                'UPDATE stays_to_buy SET status = "pending" WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Stay to buy not found'
                });
            }

            res.json({
                success: true,
                message: 'Stay to buy rejected successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // DELETE STAY TO BUY (Super Admin Only)
    // =========================================================
    static async delete(req, res) {
        try {
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can delete stays to buy'
                });
            }

            const [result] = await pool.query('DELETE FROM stays_to_buy WHERE id = ?', [req.params.id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Stay to buy not found'
                });
            }

            res.json({
                success: true,
                message: 'Stay to buy deleted successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default StayToBuyController;