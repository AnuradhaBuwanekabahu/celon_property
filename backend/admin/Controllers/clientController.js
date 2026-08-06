import pool from '../../configuration/db.js';

class ClientController {
    // =========================================================
    // GET ALL CLIENTS
    // =========================================================
    static async getAllClients(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT id, username, email, phone_number, full_name, 
                       ads_count, free_tier_limit, is_active, created_at 
                FROM clients 
                ORDER BY created_at DESC
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
    // GET CLIENT BY ID
    // =========================================================
    static async getClientById(req, res) {
        try {
            const [rows] = await pool.query(
                `SELECT id, username, email, phone_number, full_name, 
                        ads_count, free_tier_limit, is_active, created_at 
                 FROM clients WHERE id = ?`,
                [req.params.id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
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
    // TOGGLE CLIENT STATUS
    // =========================================================
    static async toggleClientStatus(req, res) {
        try {
            const { is_active } = req.body;
            const [result] = await pool.query(
                'UPDATE clients SET is_active = ? WHERE id = ?',
                [is_active, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }

            res.json({
                success: true,
                message: `Client ${is_active ? 'activated' : 'deactivated'} successfully`
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // DELETE CLIENT (Super Admin Only)
    // =========================================================
    static async deleteClient(req, res) {
        try {
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can delete clients'
                });
            }

            const [result] = await pool.query('DELETE FROM clients WHERE id = ?', [req.params.id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }

            res.json({
                success: true,
                message: 'Client deleted successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default ClientController;