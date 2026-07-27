const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

// Authentication middleware for clients and admins
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please provide a token.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Check if it's a client token
        const [clientRows] = await db.query(
            'SELECT id, username, email, full_name, is_active FROM clients WHERE id = ?',
            [decoded.id]
        );
        
        if (clientRows.length > 0) {
            const client = clientRows[0];
            if (!client.is_active) {
                return res.status(401).json({
                    success: false,
                    message: 'Account is deactivated. Please contact support.'
                });
            }
            req.client = client;
            return next();
        }

        // Check if it's an admin token
        const [adminRows] = await db.query(
            'SELECT id, name, email, role, is_approved FROM admins WHERE id = ?',
            [decoded.id]
        );
        
        if (adminRows.length > 0) {
            const admin = adminRows[0];
            if (!admin.is_approved) {
                return res.status(401).json({
                    success: false,
                    message: 'Account pending approval. Please wait for admin approval.'
                });
            }
            req.admin = admin;
            return next();
        }

        return res.status(401).json({
            success: false,
            message: 'User not found'
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Check if user is admin (any role)
const isAdmin = (req, res, next) => {
    if (!req.admin) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};

// Check if user is super admin
const isSuperAdmin = (req, res, next) => {
    if (!req.admin || req.admin.role !== 'super_admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Super Admin privileges required.'
        });
    }
    next();
};

module.exports = { auth, isAdmin, isSuperAdmin };