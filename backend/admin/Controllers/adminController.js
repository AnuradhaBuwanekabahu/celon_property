import pool from '../../configuration/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class AdminController {
    // =========================================================
    // ADMIN LOGIN
    // =========================================================
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            const [rows] = await pool.query(
                'SELECT * FROM admins WHERE email = ?',
                [email]
            );

            if (rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const admin = rows[0];

            if (!admin.is_approved) {
                return res.status(401).json({
                    success: false,
                    message: 'Account pending approval'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const token = jwt.sign(
                {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role || 'admin'
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: process.env.JWT_EXPIRE || '7d' }
            );

            delete admin.password;

            res.json({
                success: true,
                message: 'Login successful',
                data: { admin, token }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // =========================================================
    // ADMIN REGISTER (Super Admin Only)
    // =========================================================
    static async register(req, res) {
        try {
            const { name, email, password, role = 'admin' } = req.body;

            if (req.admin.role !== 'super_admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only Super Admin can register new admins'
                });
            }

            const [existing] = await pool.query(
                'SELECT id FROM admins WHERE email = ?',
                [email]
            );

            if (existing.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const [result] = await pool.query(
                'INSERT INTO admins (name, password, email, role, is_approved) VALUES (?, ?, ?, ?, ?)',
                [name, hashedPassword, email, role, false]
            );

            res.status(201).json({
                success: true,
                message: 'Admin registered successfully. Waiting for approval.',
                data: { id: result.insertId, name, email, role, is_approved: false }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================================================
    // GET ADMIN PROFILE
    // =========================================================
    static async getProfile(req, res) {
        try {
            const [rows] = await pool.query(
                'SELECT id, name, email, role, is_approved, created_at FROM admins WHERE id = ?',
                [req.admin.id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
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
}

export default AdminController;