const BaseModel = require('./BaseModel');
const { db } = require('../config/database');

class StaysToBuyModel extends BaseModel {
    constructor() {
        super('stays_to_buy');
    }

    async getByClient(clientId) {
        const [rows] = await db.query('SELECT * FROM stays_to_buy WHERE client_id = ?', [clientId]);
        return rows;
    }

    async search(filters) {
        let query = 'SELECT * FROM stays_to_buy WHERE 1=1';
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
            client_id, title, description, price, property_type,
            Highlights, area_sqft, city, map_address, Location,
            main_image, images
        } = data;

        const [result] = await db.query(
            `INSERT INTO stays_to_buy (
                client_id, title, description, price, property_type,
                Highlights, area_sqft, city, map_address, Location,
                main_image, images, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                client_id, title, description || null, price, property_type,
                Highlights || null, area_sqft || null, city,
                map_address || null, Location, main_image,
                images || null
            ]
        );
        return result.insertId;
    }

    async update(id, data) {
        const {
            title, description, price, property_type,
            Highlights, area_sqft, city, map_address, Location,
            main_image, images, status
        } = data;

        const [result] = await db.query(
            `UPDATE stays_to_buy SET
                title = ?, description = ?, price = ?, property_type = ?,
                Highlights = ?, area_sqft = ?, city = ?, map_address = ?,
                Location = ?, main_image = ?, images = ?, status = ?
            WHERE id = ?`,
            [
                title, description || null, price, property_type,
                Highlights || null, area_sqft || null, city,
                map_address || null, Location, main_image,
                images || null, status, id
            ]
        );
        return result.affectedRows > 0;
    }

    async updateStatus(id, status) {
        const [result] = await db.query(
            'UPDATE stays_to_buy SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = new StaysToBuyModel();