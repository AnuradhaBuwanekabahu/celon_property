import pool from '../../configuration/db.js';

class WantedController {
    // =========================================================
    // GET ALL WANTED ADS
    // =========================================================
    static async getAll(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT w.*, c.full_name as client_name, c.email as client_email
                FROM wanted w 
                JOIN clients c ON w.client_id = c.id 
                ORDER BY w.created_at DESC
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
    // GET WANTED BY ID
    // =========================================================
    static async getById(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT w.*, c.full_name as client_name, c.email as client_email
                FROM wanted w 
                JOIN clients c ON w.client_id = c.id 
                WHERE w.id = ?
            `, [req.params.id]);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Wanted ad not found'
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
    // DELETE WANTED (Super Admin Only)
    // =========================================================
    static async delete(req, res) {
        try {
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can delete wanted ads'
                });
            }

            const [result] = await pool.query('DELETE FROM wanted WHERE id = ?', [req.params.id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Wanted ad not found'
                });
            }

            res.json({
                success: true,
                message: 'Wanted ad deleted successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default WantedController;