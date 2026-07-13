const BaseModel = require('./BaseModel');
const { db } = require('../config/database');

class AdModel extends BaseModel {
    constructor() {
        super('ads');
    }

    async getActive() {
        const [rows] = await db.query(
            'SELECT * FROM ads WHERE is_active = TRUE ORDER BY position ASC'
        );
        return rows;
    }

    async create(data) {
        const { admin_id, title, image_url, link_url, position } = data;

        const [result] = await db.query(
            'INSERT INTO ads (admin_id, title, image_url, link_url, position, is_active) VALUES (?, ?, ?, ?, ?, TRUE)',
            [admin_id, title || null, image_url, link_url || null, position || 0]
        );
        return result.insertId;
    }

    async update(id, data) {
        const { title, image_url, link_url, position, is_active } = data;

        const [result] = await db.query(
            'UPDATE ads SET title = ?, image_url = ?, link_url = ?, position = ?, is_active = ? WHERE id = ?',
            [title || null, image_url, link_url || null, position || 0, is_active, id]
        );
        return result.affectedRows > 0;
    }

    async toggleActive(id, is_active) {
        const [result] = await db.query(
            'UPDATE ads SET is_active = ? WHERE id = ?',
            [is_active, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = new AdModel();