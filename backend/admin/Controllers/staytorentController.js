import pool from '../../configuration/db.js';

class StayToRentController {
    // =========================================================
    // GET ALL STAYS TO RENT
    // =========================================================
    static async getAll(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT s.*, c.full_name as client_name, c.email as client_email
                FROM stays_to_rent s 
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
    // GET STAY TO RENT BY ID
    // =========================================================
    static async getById(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT s.*, c.full_name as client_name, c.email as client_email
                FROM stays_to_rent s 
                JOIN clients c ON s.client_id = c.id 
                WHERE s.id = ?
            `, [req.params.id]);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Stay to rent not found'
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
    // APPROVE STAY TO RENT
    // =========================================================
    static async approve(req, res) {
        try {
            const [result] = await pool.query(
                'UPDATE stays_to_rent SET status = "active" WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Stay to rent not found'
                });
            }

            res.json({
                success: true,
                message: 'Stay to rent approved successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // REJECT STAY TO RENT
    // =========================================================
    static async reject(req, res) {
        try {
            const [result] = await pool.query(
                'UPDATE stays_to_rent SET status = "pending" WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Stay to rent not found'
                });
            }

            res.json({
                success: true,
                message: 'Stay to rent rejected successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // DELETE STAY TO RENT (Super Admin Only)
    // =========================================================
    static async delete(req, res) {
        try {
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can delete stays to rent'
                });
            }

            const [result] = await pool.query('DELETE FROM stays_to_rent WHERE id = ?', [req.params.id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Stay to rent not found'
                });
            }

            res.json({
                success: true,
                message: 'Stay to rent deleted successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default StayToRentController;