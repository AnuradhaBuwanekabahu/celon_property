const { db } = require('../config/database');

class BaseModel {
    constructor(tableName) {
        this.tableName = tableName;
    }

    // Get all records
    async getAll() {
        const [rows] = await db.query(`SELECT * FROM ${this.tableName}`);
        return rows;
    }

    // Get record by ID
    async getById(id) {
        const [rows] = await db.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
        return rows[0];
    }

    // Delete record
    async delete(id) {
        const [result] = await db.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    }

    // Count records
    async count() {
        const [rows] = await db.query(`SELECT COUNT(*) as total FROM ${this.tableName}`);
        return rows[0].total;
    }

    // Custom query
    async query(sql, params = []) {
        const [rows] = await db.query(sql, params);
        return rows;
    }
}

module.exports = BaseModel;