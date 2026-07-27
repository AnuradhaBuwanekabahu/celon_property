const jwt = require('jsonwebtoken');
const AdminModel = require('../models/AdminModel');

class AdminService {
    // Generate JWT token for admin
    generateToken(admin) {
        return jwt.sign(
            { 
                id: admin.id, 
                name: admin.name,
                email: admin.email,
                role: admin.role || 'admin'
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
    }

    // Register new admin (requires super admin approval)
    async register(adminData) {
        // Check if email exists
        const existingEmail = await AdminModel.getByEmail(adminData.email);
        if (existingEmail) {
            throw new Error('Email already exists');
        }

        // Check if name exists
        const existingName = await AdminModel.getByName(adminData.name);
        if (existingName) {
            throw new Error('Username already exists');
        }

        // Create admin
        const id = await AdminModel.create(adminData);
        
        // Get the created admin
        const admin = await AdminModel.getById(id);
        delete admin.password;
        
        return admin;
    }

    // Create Super Admin (first admin)
    async createSuperAdmin(adminData) {
        const existingEmail = await AdminModel.getByEmail(adminData.email);
        if (existingEmail) {
            throw new Error('Email already exists');
        }

        const id = await AdminModel.createSuperAdmin(adminData);
        const admin = await AdminModel.getById(id);
        delete admin.password;
        return admin;
    }

    // Login admin
    async login(email, password) {
        const result = await AdminModel.login(email, password);
        
        if (!result) {
            throw new Error('Invalid credentials');
        }

        if (result.error) {
            throw new Error(result.error);
        }

        // Generate token
        const token = this.generateToken(result);
        
        return { admin: result, token };
    }

    // Get dashboard stats
    async getStats() {
        const { db } = require('../config/database');
        
        const [clientCount] = await db.query('SELECT COUNT(*) as total FROM clients WHERE is_active = TRUE');
        const [propertyCount] = await db.query('SELECT COUNT(*) as total FROM hot_sales WHERE status = "active"');
        const [adCount] = await db.query('SELECT COUNT(*) as total FROM ads WHERE is_active = TRUE AND is_approved = TRUE');
        const [paymentCount] = await db.query('SELECT COUNT(*) as total FROM payments WHERE status = "paid"');
        const [pendingAds] = await db.query('SELECT COUNT(*) as total FROM ads WHERE is_approved = FALSE');
        const [pendingAdmins] = await db.query('SELECT COUNT(*) as total FROM admins WHERE is_approved = FALSE');
        const [totalRevenue] = await db.query('SELECT SUM(amount) as total FROM payments WHERE status = "paid"');
        
        return {
            clients: clientCount[0].total,
            properties: propertyCount[0].total,
            ads: adCount[0].total,
            payments: paymentCount[0].total,
            pending_ads: pendingAds[0].total,
            pending_admins: pendingAdmins[0].total,
            total_revenue: totalRevenue[0].total || 0
        };
    }

    // Check if admin has permission to delete
    canDelete(admin) {
        return admin.role === 'super_admin';
    }

    // Check if admin has permission to approve
    canApprove(admin) {
        return admin.role === 'super_admin' || admin.role === 'admin';
    }
}

module.exports = new AdminService();