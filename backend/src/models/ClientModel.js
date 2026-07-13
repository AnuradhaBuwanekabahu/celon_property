const BaseModel = require('./BaseModel');
const { db } = require('../config/database');

class ClientModel extends BaseModel {
    constructor() {
        super('clients');
    }

    // Get client by username
    async getByUsername(username) {
        const [rows] = await db.query('SELECT * FROM clients WHERE username = ?', [username]);
        return rows[0];
    }

    // Get client by email
    async getByEmail(email) {
        const [rows] = await db.query('SELECT * FROM clients WHERE email = ?', [email]);
        return rows[0];
    }

    // Create new client
    async create(data) {
        const { username, password, email, phone_number, whatsapp_number, full_name } = data;
        const [result] = await db.query(
            'INSERT INTO clients (username, password, email, phone_number, whatsapp_number, full_name) VALUES (?, ?, ?, ?, ?, ?)',
            [username, password, email, phone_number, whatsapp_number || null, full_name]
        );
        return result.insertId;
    }

    // Update client
    async update(id, data) {
        const { email, phone_number, whatsapp_number, full_name, is_active } = data;
        const [result] = await db.query(
            'UPDATE clients SET email = ?, phone_number = ?, whatsapp_number = ?, full_name = ?, is_active = ? WHERE id = ?',
            [email, phone_number, whatsapp_number || null, full_name, is_active, id]
        );
        return result.affectedRows > 0;
    }

    // Login
    async login(username, password) {
        const [rows] = await db.query(
            'SELECT id, username, email, phone_number, full_name, is_active FROM clients WHERE username = ? AND password = ? AND is_active = TRUE',
            [username, password]
        );
        return rows[0];
    }
}

module.exports = new ClientModel();