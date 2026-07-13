const BaseModel = require('./BaseModel');
const { db } = require('../config/database');

class PaymentModel extends BaseModel {
    constructor() {
        super('payments');
    }

    async getByClient(clientId) {
        const [rows] = await db.query('SELECT * FROM payments WHERE client_id = ?', [clientId]);
        return rows;
    }

    async create(data) {
        const {
            client_id, property_type, property_id, amount,
            payment_method, transaction_ref
        } = data;

        const [result] = await db.query(
            `INSERT INTO payments (
                client_id, property_type, property_id, amount,
                payment_method, transaction_ref, status
            ) VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
            [
                client_id, property_type, property_id, amount,
                payment_method || null, transaction_ref || null
            ]
        );
        return result.insertId;
    }

    async updateStatus(id, status) {
        const [result] = await db.query(
            'UPDATE payments SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }

    async getByTransactionRef(ref) {
        const [rows] = await db.query('SELECT * FROM payments WHERE transaction_ref = ?', [ref]);
        return rows[0];
    }
}

module.exports = new PaymentModel();