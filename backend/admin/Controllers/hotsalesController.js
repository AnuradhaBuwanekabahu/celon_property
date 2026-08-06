import pool from '../../configuration/db.js';

class HotSalesController {
    // =========================================================
    // GET ALL HOT SALES
    // =========================================================
    static async getAll(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT h.*, c.full_name as client_name, c.email as client_email
                FROM hot_sales h 
                JOIN clients c ON h.client_id = c.id 
                ORDER BY h.created_at DESC
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
    // GET HOT SALE BY ID
    // =========================================================
    static async getById(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT h.*, c.full_name as client_name, c.email as client_email
                FROM hot_sales h 
                JOIN clients c ON h.client_id = c.id 
                WHERE h.id = ?
            `, [req.params.id]);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
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
    // APPROVE HOT SALE
    // =========================================================
    static async approve(req, res) {
        try {
            const [result] = await pool.query(
                'UPDATE hot_sales SET status = "active" WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }

            res.json({
                success: true,
                message: 'Property approved successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // REJECT HOT SALE
    // =========================================================
    static async reject(req, res) {
        try {
            const [result] = await pool.query(
                'UPDATE hot_sales SET status = "pending" WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }

            res.json({
                success: true,
                message: 'Property rejected successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // DELETE HOT SALE (Super Admin Only)
    // =========================================================
    static async delete(req, res) {
        try {
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can delete properties'
                });
            }

            const [result] = await pool.query('DELETE FROM hot_sales WHERE id = ?', [req.params.id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }

            res.json({
                success: true,
                message: 'Property deleted successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default HotSalesController;