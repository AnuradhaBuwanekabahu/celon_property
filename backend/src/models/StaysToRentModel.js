const BaseModel = require('./BaseModel');
const { db } = require('../config/database');

class StaysToRentModel extends BaseModel {
    constructor() {
        super('stays_to_rent');
    }

    async getByClient(clientId) {
        const [rows] = await db.query('SELECT * FROM stays_to_rent WHERE client_id = ?', [clientId]);
        return rows;
    }

    async search(filters) {
        let query = 'SELECT * FROM stays_to_rent WHERE 1=1';
        const params = [];

        if (filters.city) {
            query += ' AND city = ?';
            params.push(filters.city);
        }
        if (filters.price_period) {
            query += ' AND price_period = ?';
            params.push(filters.price_period);
        }

        const [rows] = await db.query(query, params);
        return rows;
    }

    async create(data) {
        const {
            client_id, title, description, price, property_type,
            Highlights, area_sqft, city, map_address, Location,
            main_image, images, price_period
        } = data;

        const [result] = await db.query(
            `INSERT INTO stays_to_rent (
                client_id, title, description, price, property_type,
                Highlights, area_sqft, city, map_address, Location,
                main_image, images, price_period, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                client_id, title, description || null, price, property_type,
                Highlights || null, area_sqft || null, city,
                map_address || null, Location, main_image,
                images || null, price_period || 'monthly'
            ]
        );
        return result.insertId;
    }

    async update(id, data) {
        const {
            title, description, price, property_type,
            Highlights, area_sqft, city, map_address, Location,
            main_image, images, price_period, status
        } = data;

        const [result] = await db.query(
            `UPDATE stays_to_rent SET
                title = ?, description = ?, price = ?, property_type = ?,
                Highlights = ?, area_sqft = ?, city = ?, map_address = ?,
                Location = ?, main_image = ?, images = ?, price_period = ?, status = ?
            WHERE id = ?`,
            [
                title, description || null, price, property_type,
                Highlights || null, area_sqft || null, city,
                map_address || null, Location, main_image,
                images || null, price_period || 'monthly', status, id
            ]
        );
        return result.affectedRows > 0;
    }

    async updateStatus(id, status) {
        const [result] = await db.query(
            'UPDATE stays_to_rent SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = new StaysToRentModel();