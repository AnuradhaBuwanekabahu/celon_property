const BaseModel = require('./BaseModel');
const { db } = require('../config/database');

class HotSalesModel extends BaseModel {
    constructor() {
        super('hot_sales');
    }

    // Get properties by client
    async getByClient(clientId) {
        const [rows] = await db.query('SELECT * FROM hot_sales WHERE client_id = ?', [clientId]);
        return rows;
    }

    // Search properties
    async search(filters) {
        let query = 'SELECT * FROM hot_sales WHERE 1=1';
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
        if (filters.property_type) {
            query += ' AND property_type = ?';
            params.push(filters.property_type);
        }
        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        const [rows] = await db.query(query, params);
        return rows;
    }

    // Create property
    async create(data) {
        const {
            client_id, title, description, price, property_type,
            Highlights, area_sqft, city, map_address, Location,
            main_image, images
        } = data;

        const [result] = await db.query(
            `INSERT INTO hot_sales (
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

    // Update property
    async update(id, data) {
        const {
            title, description, price, property_type,
            Highlights, area_sqft, city, map_address, Location,
            main_image, images, status
        } = data;

        const [result] = await db.query(
            `UPDATE hot_sales SET
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

    // Update status
    async updateStatus(id, status) {
        const [result] = await db.query(
            'UPDATE hot_sales SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = new HotSalesModel();