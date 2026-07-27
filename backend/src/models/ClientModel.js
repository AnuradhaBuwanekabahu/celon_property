const BaseModel = require('./BaseModel');
const { db } = require('../config/database');
const bcrypt = require('bcrypt');

class ClientModel extends BaseModel {
    constructor() {
        super('clients');
    }

    async getByUsername(username) {
        const [rows] = await db.query('SELECT * FROM clients WHERE username = ?', [username]);
        return rows[0];
    }

    async getByEmail(email) {
        const [rows] = await db.query('SELECT * FROM clients WHERE email = ?', [email]);
        return rows[0];
    }

    async create(data) {
        const { username, password, email, phone_number, whatsapp_number, full_name } = data;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const [result] = await db.query(
            'INSERT INTO clients (username, password, email, phone_number, whatsapp_number, full_name) VALUES (?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, email, phone_number, whatsapp_number || null, full_name]
        );
        return result.insertId;
    }

    async update(id, data) {
        const { email, phone_number, whatsapp_number, full_name, is_active } = data;
        const [result] = await db.query(
            'UPDATE clients SET email = ?, phone_number = ?, whatsapp_number = ?, full_name = ?, is_active = ? WHERE id = ?',
            [email, phone_number, whatsapp_number || null, full_name, is_active, id]
        );
        return result.affectedRows > 0;
    }

    async login(username, password) {
        const [rows] = await db.query(
            'SELECT * FROM clients WHERE username = ? AND is_active = TRUE',
            [username]
        );
        
        if (rows.length === 0) {
            return null;
        }

        const client = rows[0];
        const isPasswordValid = await bcrypt.compare(password, client.password);
        
        if (!isPasswordValid) {
            return null;
        }

        delete client.password;
        return client;
    }

    async getById(id) {
        const [rows] = await db.query(
            'SELECT id, username, email, phone_number, whatsapp_number, full_name, ads_count, free_tier_limit, is_active, created_at, updated_at FROM clients WHERE id = ?',
            [id]
        );
        return rows[0];
    }
}

module.exports = new ClientModel();