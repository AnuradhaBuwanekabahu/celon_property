const BaseModel = require('./BaseModel');
const { db } = require('../config/database');

class WantedModel extends BaseModel {
    constructor() {
        super('wanted');
    }

    async getByClient(clientId) {
        const [rows] = await db.query('SELECT * FROM wanted WHERE client_id = ?', [clientId]);
        return rows;
    }

    async search(filters) {
        let query = 'SELECT * FROM wanted WHERE 1=1';
        const params = [];

        if (filters.preferred_city) {
            query += ' AND preferred_city = ?';
            params.push(filters.preferred_city);
        }
        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        const [rows] = await db.query(query, params);
        return rows;
    }

    async create(data) {
        const {
            client_id, title, description, budget, preferred_city,
            Phone_number, main_image, images
        } = data;

        const [result] = await db.query(
            `INSERT INTO wanted (
                client_id, title, description, budget, preferred_city,
                Phone_number, main_image, images, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                client_id, title, description || null, budget || null,
                preferred_city || null, Phone_number, main_image || null,
                images || null
            ]
        );
        return result.insertId;
    }

    async update(id, data) {
        const {
            title, description, budget, preferred_city,
            Phone_number, main_image, images, status
        } = data;

        const [result] = await db.query(
            `UPDATE wanted SET
                title = ?, description = ?, budget = ?, preferred_city = ?,
                Phone_number = ?, main_image = ?, images = ?, status = ?
            WHERE id = ?`,
            [
                title, description || null, budget || null,
                preferred_city || null, Phone_number, main_image || null,
                images || null, status, id
            ]
        );
        return result.affectedRows > 0;
    }

    async updateStatus(id, status) {
        const [result] = await db.query(
            'UPDATE wanted SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = new WantedModel();