const BaseModel = require('./BaseModel');
const { db } = require('../config/database');

class LandModel extends BaseModel {
    constructor() {
        super('land');
    }

    async getByClient(clientId) {
        const [rows] = await db.query('SELECT * FROM land WHERE client_id = ?', [clientId]);
        return rows;
    }

    async search(filters) {
        let query = 'SELECT * FROM land WHERE 1=1';
        const params = [];

        if (filters.city) {
            query += ' AND city = ?';
            params.push(filters.city);
        }
        if (filters.minPrice) {
            query += ' AND price >= ?';
            params.push(parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            query += ' AND price <= ?';
            params.push(parseFloat(filters.maxPrice));
        }

        const [rows] = await db.query(query, params);
        return rows;
    }

    async create(data) {
        const {
            client_id, title, description, price, land_size, size_unit,
            Location, city, main_image, images
        } = data;

        const [result] = await db.query(
            `INSERT INTO land (
                client_id, title, description, price, land_size, size_unit,
                Location, city, main_image, images, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                client_id, title, description || null, price, land_size,
                size_unit || 'perches', Location || null, city, main_image,
                images || null
            ]
        );
        return result.insertId;
    }

    async update(id, data) {
        const {
            title, description, price, land_size, size_unit,
            Location, city, main_image, images, status
        } = data;

        const [result] = await db.query(
            `UPDATE land SET
                title = ?, description = ?, price = ?, land_size = ?, size_unit = ?,
                Location = ?, city = ?, main_image = ?, images = ?, status = ?
            WHERE id = ?`,
            [
                title, description || null, price, land_size,
                size_unit || 'perches', Location || null, city,
                main_image, images || null, status, id
            ]
        );
        return result.affectedRows > 0;
    }

    async updateStatus(id, status) {
        const [result] = await db.query(
            'UPDATE land SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = new LandModel();