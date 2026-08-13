import db from "../../configuration/db.js";
import { generatePayhereHash, verifyPayhereSignature } from '../services/payhereService.js';

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
            }
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

        if (status_code === "2") {
            await db.query(
                `UPDATE payments
                 SET status='paid',
                     transaction_ref=?,
                     payment_gateway='PayHere',
                     payment_method=?,
                     paid_at=NOW()
                 WHERE id=?`,
                [payment_id, safeMethod, order_id]
            );
        } else {
            // -1 canceled, 0 pending, -2 failed, -3 chargedback
            await db.query(
                `UPDATE payments
                 SET status='failed',
                     payment_method=?
                 WHERE id=?`,
                [safeMethod, order_id]
            );
        }

        res.send("ok");

    } catch (error) {
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