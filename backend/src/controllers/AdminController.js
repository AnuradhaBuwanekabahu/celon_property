const AdminModel = require('../models/AdminModel');
const AdminService = require('../services/adminService');
const { db } = require('../config/database');

class AdminController {
    // =========================================================
    // ADMIN AUTHENTICATION
    // =========================================================

    // Register new admin
    static async register(req, res) {
        try {
            const admin = await AdminService.register(req.body);
            res.status(201).json({
                success: true,
                message: 'Admin registered successfully. Waiting for approval.',
                data: admin
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Create Super Admin (First admin)
    static async createSuperAdmin(req, res) {
        try {
            // Check if any super admin exists
            const superAdmins = await AdminModel.getSuperAdmins();
            if (superAdmins.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Super Admin already exists'
                });
            }

            const admin = await AdminService.createSuperAdmin(req.body);
            res.status(201).json({
                success: true,
                message: 'Super Admin created successfully',
                data: admin
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Admin login
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { admin, token } = await AdminService.login(email, password);
            
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    admin,
                    token
                }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get admin profile
    static async getProfile(req, res) {
        try {
            const admin = await AdminModel.getById(req.admin.id);
            delete admin.password;
            res.json({
                success: true,
                data: admin
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // DASHBOARD & STATS (All Admins)
    // =========================================================

    // Get dashboard statistics
    static async getStats(req, res) {
        try {
            const stats = await AdminService.getStats();
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // ADMIN MANAGEMENT (Super Admin Only)
    // =========================================================

    // Get all admins
    static async getAllAdmins(req, res) {
        try {
            const admins = await AdminModel.getApproved();
            const pending = await AdminModel.getPending();
            res.json({
                success: true,
                data: {
                    approved: admins,
                    pending: pending
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get pending admins
    static async getPendingAdmins(req, res) {
        try {
            const admins = await AdminModel.getPending();
            res.json({
                success: true,
                count: admins.length,
                data: admins
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Approve admin (Super Admin only)
    static async approveAdmin(req, res) {
        try {
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can approve admins'
                });
            }

            const id = req.params.id;
            const updated = await AdminModel.approve(id);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }
            res.json({
                success: true,
                message: 'Admin approved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete admin (Super Admin only)
    static async deleteAdmin(req, res) {
        try {
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can delete admins'
                });
            }

            const deleted = await AdminModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }
            res.json({
                success: true,
                message: 'Admin deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // CLIENT MANAGEMENT (All Admins - View Only, No Delete)
    // =========================================================

    // Get all clients
    static async getAllClients(req, res) {
        try {
            const [rows] = await db.query(
                'SELECT id, username, email, phone_number, full_name, ads_count, free_tier_limit, is_active, created_at FROM clients ORDER BY created_at DESC'
            );
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

    // Toggle client status (All Admins)
    static async toggleClientStatus(req, res) {
        try {
            const { is_active } = req.body;
            const [result] = await db.query(
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

    // Delete client (Super Admin only)
    static async deleteClient(req, res) {
        try {
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can delete clients'
                });
            }

            const [result] = await db.query('DELETE FROM clients WHERE id = ?', [req.params.id]);
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

    // =========================================================
    // PROPERTY MANAGEMENT (All Admins - View & Approve, No Delete)
    // =========================================================

    // Get all properties
    static async getAllProperties(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT h.*, c.username, c.email, c.full_name 
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

    // Approve property (All Admins)
    static async approveProperty(req, res) {
        try {
            const [result] = await db.query(
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

    // Reject property (Admin can reject - soft delete / mark as rejected)
    static async rejectProperty(req, res) {
        try {
            // Instead of delete, mark as rejected or inactive
            const [result] = await db.query(
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

    // Delete property (Super Admin only)
    static async deleteProperty(req, res) {
        try {
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can delete properties'
                });
            }

            const [result] = await db.query('DELETE FROM hot_sales WHERE id = ?', [req.params.id]);
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

    // =========================================================
    // AD MANAGEMENT (All Admins - View & Approve, No Delete)
    // =========================================================

    // Get all ads
    static async getAllAds(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT a.*, c.username, c.email, c.full_name, c.ads_count 
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

    // Get pending ads
    static async getPendingAds(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT a.*, c.username, c.email, c.full_name 
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

    // Approve ad (All Admins)
    static async approveAd(req, res) {
        try {
            const [result] = await db.query(
                `UPDATE ads SET 
                    is_approved = TRUE, 
                    approved_by = ?, 
                    approved_at = NOW() 
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

    // Reject ad (Admin can reject - soft delete)
    static async rejectAd(req, res) {
        try {
            // Instead of delete, set is_active to false
            const [result] = await db.query(
                'UPDATE ads SET is_active = FALSE WHERE id = ?',
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

    // Delete ad (Super Admin only)
    static async deleteAd(req, res) {
        try {
            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can delete ads'
                });
            }

            const [result] = await db.query('DELETE FROM ads WHERE id = ?', [req.params.id]);
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

    // =========================================================
    // PAYMENT MANAGEMENT (All Admins - View Only)
    // =========================================================

    // Get all payments
    static async getAllPayments(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT p.*, c.username, c.email, c.full_name 
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

    // Get payment statistics
    static async getPaymentStats(req, res) {
        try {
            const [total] = await db.query('SELECT SUM(amount) as total FROM payments WHERE status = "paid"');
            const [count] = await db.query('SELECT COUNT(*) as count FROM payments WHERE status = "paid"');
            const [pending] = await db.query('SELECT COUNT(*) as count FROM payments WHERE status = "pending"');
            
            res.json({
                success: true,
                data: {
                    total_revenue: total[0].total || 0,
                    total_payments: count[0].count || 0,
                    pending_payments: pending[0].count || 0
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

module.exports = AdminController;