const BaseModel = require('./BaseModel');
const { db } = require('../config/database');
const bcrypt = require('bcrypt');

class AdminModel extends BaseModel {
    constructor() {
        super('admins');
    }

    // Get admin by email
    async getByEmail(email) {
        const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
        return rows[0];
    }

    // Get admin by name
    async getByName(name) {
        const [rows] = await db.query('SELECT * FROM admins WHERE name = ?', [name]);
        return rows[0];
    }

    // Create new admin with hashed password
    async create(data) {
        const { name, password, email } = data;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const [result] = await db.query(
            'INSERT INTO admins (name, password, email, is_approved, role) VALUES (?, ?, ?, ?, ?)',
            [name, hashedPassword, email, false, 'admin']
        );
        return result.insertId;
    }

    // Create Super Admin (first admin)
    async createSuperAdmin(data) {
        const { name, password, email } = data;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const [result] = await db.query(
            'INSERT INTO admins (name, password, email, is_approved, role) VALUES (?, ?, ?, ?, ?)',
            [name, hashedPassword, email, true, 'super_admin']
        );
        return result.insertId;
    }

    // Admin login
    async login(email, password) {
        const [rows] = await db.query(
            'SELECT * FROM admins WHERE email = ?',
            [email]
        );
        
        if (rows.length === 0) {
            return null;
        }

        const admin = rows[0];
        
        // Check if admin is approved
        if (!admin.is_approved) {
            return { error: 'Account pending approval' };
        }
        
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        
        if (!isPasswordValid) {
            return null;
        }

        delete admin.password;
        return admin;
    }

    // Approve admin
    async approve(id) {
        const [result] = await db.query(
            'UPDATE admins SET is_approved = TRUE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    // Change admin role
    async changeRole(id, role) {
        const [result] = await db.query(
            'UPDATE admins SET role = ? WHERE id = ?',
            [role, id]
        );
        return result.affectedRows > 0;
    }

    // Get pending admins (not approved)
    async getPending() {
        const [rows] = await db.query(
            'SELECT id, name, email, role, created_at FROM admins WHERE is_approved = FALSE ORDER BY created_at ASC'
        );
        return rows;
    }

    // Get approved admins
    async getApproved() {
        const [rows] = await db.query(
            'SELECT id, name, email, role, is_approved, created_at FROM admins WHERE is_approved = TRUE ORDER BY created_at DESC'
        );
        return rows;
    }

    // Get Super Admins
    async getSuperAdmins() {
        const [rows] = await db.query(
            'SELECT id, name, email, created_at FROM admins WHERE role = "super_admin" AND is_approved = TRUE'
        );
        return rows;
    }

    // Delete admin (Super Admin only)
    async delete(id) {
        const [result] = await db.query('DELETE FROM admins WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new AdminModel();