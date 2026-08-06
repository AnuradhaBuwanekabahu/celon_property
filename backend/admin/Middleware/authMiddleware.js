import jwt from 'jsonwebtoken';
import pool from '../../configuration/db.js';

// =========================================================
// AUTH MIDDLEWARE - Verifies JWT Token
// =========================================================
export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        const [rows] = await pool.query(
            'SELECT id, name, email, role, is_approved FROM admins WHERE id = ?',
            [decoded.id]
        );
        
        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Admin not found.'
            });
        }

        const admin = rows[0];
        
        if (!admin.is_approved) {
            return res.status(401).json({
                success: false,
                message: 'Account pending approval.'
            });
        }

        req.admin = admin;
        next();
        
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
                message: 'Session expired. Please login again.'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Authentication failed.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// =========================================================
// ADMIN MIDDLEWARE
// =========================================================
export const isAdmin = (req, res, next) => {
    if (!req.admin) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};

// =========================================================
// SUPER ADMIN MIDDLEWARE
// =========================================================
export const isSuperAdmin = (req, res, next) => {
    if (!req.admin || req.admin.role !== 'super_admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Super Admin privileges required.'
        });
    }
    next();
};