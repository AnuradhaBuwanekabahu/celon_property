import db from "../../configuration/db.js";
import { generatePayhereHash, verifyPayhereSignature } from '../services/payhereService.js';
import { getApplicableLimit, publicLimitInfo } from '../utils/limitUtils.js';

// PayHere reports these method codes in the notify webhook
const VALID_METHODS = [
    "VISA", "MASTER", "AMEX", "EZCASH", "MCASH",
    "GENIE", "VISHWA", "PAYAPP", "HNB", "FRIMI"
];

// -------------------- create payment --------------------
export const createPayment = async (req, res) => {
    try {
        const { client_id, property_type, property_id, amount } = req.body;

        if (!client_id || !property_type || !property_id || !amount) {
            return res.status(400).json({
                success: false,
                message: "missing required fields"
            });
        }

        const validPropertyTypes = ['hot_sales', 'stays_to_buy', 'stays_to_rent', 'wanted', 'land'];
        if (!validPropertyTypes.includes(property_type)) {
            return res.status(400).json({
                success: false,
                message: "invalid property_type"
            });
        }

        if (isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "invalid amount"
            });
        }

        const tierInfo = await getApplicableLimit(db, client_id);
        const tierPrice = Number(tierInfo.applicableLimit.price);
        if (Number(amount) !== tierPrice) {
            return res.status(409).json({
                success: false,
                message: "Payment amount does not match the applicable tier.",
                tier: publicLimitInfo(tierInfo.applicableLimit)
            });
        }

        const [result] = await db.query(
            `INSERT INTO payments
             (client_id, property_type, property_id, amount, status)
             VALUES (?, ?, ?, ?, 'pending')`,
            [client_id, property_type, property_id, amount]
        );

        const paymentId = result.insertId;

        // PayHere expects amount formatted to 2 decimals — the same
        // formatted string must be used to generate the hash below
        const formattedAmount = Number(amount).toFixed(2);

        const hash = generatePayhereHash(
            paymentId,
            formattedAmount,
            "LKR"
        );

        return res.status(201).json({
            success: true,
            message: "payment created successfully",
            payment: {
                payment_id: paymentId,
                client_id,
                property_type,
                property_id,
                amount: formattedAmount,
                currency: "LKR",
                status: "pending",
                merchant_id: process.env.PAYHERE_MERCHANT_ID,
                hash
            },
            tier: publicLimitInfo(tierInfo.applicableLimit)
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "server error"
        });
    }
};

// -------------------- payhere notify webhook --------------------
export const payhereNotify = async (req, res) => {
    let connection;
    try {
        const {
            merchant_id,
            order_id,
            payment_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig,
            method
        } = req.body;

        if (!merchant_id || !order_id || !payhere_amount || !payhere_currency || !status_code || !md5sig) {
            return res.status(400).send("missing required fields");
        }

        const isValid = verifyPayhereSignature(
            merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig
        );

        if (!isValid) {
            return res.status(400).send("invalid signature");
        }

        const safeMethod = VALID_METHODS.includes(method) ? method : null;

        connection = await db.getConnection();
        await connection.beginTransaction();

        if (status_code === "2") {
            const [paymentUpdate] = await connection.query(
                `UPDATE payments
                 SET status='paid', transaction_ref=?, payment_gateway='PayHere',
                     payment_method=?, paid_at=NOW()
                 WHERE id=? AND status <> 'paid'`,
                [payment_id, safeMethod, order_id]
            );

            if (paymentUpdate.affectedRows === 1) {
                const [paymentRows] = await connection.query(
                    `SELECT client_id, property_type, property_id FROM payments WHERE id=?`,
                    [order_id]
                );
                const payment = paymentRows[0];
                const propertyTables = {
                    hot_sales: 'hot_sales',
                    land: 'land',
                    stays_to_buy: 'stays_to_buy',
                    stays_to_rent: 'stays_to_rent',
                    wanted: 'wanted'
                };
                const table = propertyTables[payment?.property_type];

                if (!payment || !table) throw new Error('Invalid payment property reference.');

                await connection.query(
                    `UPDATE ${table} SET status='active' WHERE id=? AND status='pending'`,
                    [payment.property_id]
                );
                await connection.query(
                    `UPDATE clients SET total_ads_count=total_ads_count+1 WHERE id=?`,
                    [payment.client_id]
                );
            }
        } else {
            // -1 canceled, 0 pending, -2 failed, -3 chargedback
            await connection.query(
                `UPDATE payments
                 SET status='failed',
                     payment_method=?
                 WHERE id=?`,
                [safeMethod, order_id]
            );
        }

        await connection.commit();

        res.send("ok");

    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).send("server error");
    }
};

// -------------------- get all payments --------------------
export const showAllPayments = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM payments ORDER BY id DESC"
        );

        return res.json({
            success: true,
            payments: rows
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "server error"
        });
    }
};

// -------------------- get payment by id --------------------
export const getPayment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "invalid payment id"
            });
        }

        const [rows] = await db.query(
            "SELECT * FROM payments WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "payment not found"
            });
        }

        return res.json({
            success: true,
            payment: rows[0]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "server error"
        });
    }
};