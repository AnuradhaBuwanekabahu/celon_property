import pool from '../../configuration/db.js';

class PaymentController {
    // =========================================================
    // GET ALL PAYMENTS
    // =========================================================
    static async getAll(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT p.*, c.full_name as client_name, c.email as client_email
                FROM payments p 
                JOIN clients c ON p.client_id = c.id 
                ORDER BY p.created_at DESC
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
    // GET PAYMENT BY ID
    // =========================================================
    static async getById(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT p.*, c.full_name as client_name, c.email as client_email
                FROM payments p 
                JOIN clients c ON p.client_id = c.id 
                WHERE p.id = ?
            `, [req.params.id]);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found'
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
    // GET PAYMENT STATS
    // =========================================================
    static async getStats(req, res) {
        try {
            const [total] = await pool.query('SELECT SUM(amount) as total FROM payments WHERE status = "paid"');
            const [count] = await pool.query('SELECT COUNT(*) as count FROM payments WHERE status = "paid"');
            const [pending] = await pool.query('SELECT COUNT(*) as count FROM payments WHERE status = "pending"');
            const [failed] = await pool.query('SELECT COUNT(*) as count FROM payments WHERE status = "failed"');

            res.json({
                success: true,
                data: {
                    total_revenue: total[0].total || 0,
                    total_payments: count[0].count || 0,
                    pending_payments: pending[0].count || 0,
                    failed_payments: failed[0].count || 0
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

export default PaymentController;