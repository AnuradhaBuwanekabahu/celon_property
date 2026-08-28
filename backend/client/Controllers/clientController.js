import db from "../../configuration/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/nodemailer.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (client) => {
    return jwt.sign(
        {
            id: client.id,
            email: client.email,
            role: "client"
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const registerClient = async (req, res) => {
    let createdClientId = null;

    try {

        const {
            full_name,
            email,
            password,
            phone_number = null,
            whatsapp_number = null
        } = req.body || {};

        if (!full_name || !email || !password) {
            return res.status(400).json({
                message: "Full name, email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const [existingClient] = await db.query(
            "SELECT * FROM clients WHERE email = ?", [normalizedEmail]
        );

        if (existingClient.length > 0) {
            if (existingClient[0].is_verified) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            await db.query("DELETE FROM otp_verifications WHERE email = ?", [normalizedEmail]);
            await db.query("DELETE FROM clients WHERE id = ?", [existingClient[0].id]);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `
            INSERT INTO clients
            (
                password,
                email,
                phone_number,
                whatsapp_number,
                full_name
            )
            VALUES (?,?,?,?,?)
            `,
            [
                hashedPassword,
                normalizedEmail,
                phone_number,
                whatsapp_number,
                full_name
            ]
        );
        createdClientId = result.insertId;

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await db.query(
            "INSERT INTO otp_verifications (email, otp_code, expires_at) VALUES (?, ?, ?)",
            [normalizedEmail, otp, expiresAt]
        );

        await sendOtpEmail(normalizedEmail, otp);

        res.status(201).json({
            message: "Registration successful. Please verify the OTP sent to your email.",
            client: {
                id: createdClientId,
                email: normalizedEmail
            }
        });

    } catch (error) {

        console.log(error);

        if (createdClientId) {
            await db.query("DELETE FROM otp_verifications WHERE email = (SELECT email FROM clients WHERE id = ?)", [createdClientId]);
            await db.query("DELETE FROM clients WHERE id = ?", [createdClientId]);
        }

        res.status(500).json({
            message: "Server error"
        });
    }

};

export const verifyRegistrationOtp = async (req, res) => {

    try {

        const email = req.body?.email?.trim().toLowerCase();
        const otp = String(req.body?.otp || "").trim();

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const [rows] = await db.query(
            `SELECT * FROM otp_verifications
             WHERE email = ? AND otp_code = ? AND is_used = FALSE
             ORDER BY created_at DESC LIMIT 1`,
            [email, otp]
        );

        if (rows.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        const record = rows[0];

        if (new Date(record.expires_at) < new Date()) {
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        await db.query("UPDATE otp_verifications SET is_used = TRUE WHERE id = ?", [record.id]);
        await db.query("UPDATE clients SET is_verified = TRUE WHERE email = ?", [email]);

        const [clientRows] = await db.query("SELECT * FROM clients WHERE email = ?", [email]);
        const client = clientRows[0];

        const token = generateToken(client);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            token,
            client: {
                id: client.id,
                full_name: client.full_name,
                email: client.email,
                phone_number: client.phone_number,
                whatsapp_number: client.whatsapp_number,
                is_active: client.is_active
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }

};

export const resendOtp = async (req, res) => {

    try {

        const email = req.body?.email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const [rows] = await db.query("SELECT * FROM clients WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        if (rows[0].is_verified) {
            return res.status(400).json({ success: false, message: "Email already verified" });
        }

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await db.query(
            "INSERT INTO otp_verifications (email, otp_code, expires_at) VALUES (?, ?, ?)",
            [email, otp, expiresAt]
        );

        await sendOtpEmail(email, otp);

        res.status(200).json({ success: true, message: "OTP resent successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }

};

export const loginClient = async (req, res) => {

    try {

        const email = req.body?.email?.trim().toLowerCase();
        const { password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const [rows] = await db.query(
            "SELECT * from clients where email = ?", [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const client = rows[0];

        if (!client.is_active) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Please contact support."
            });
        }

        if (!client.is_verified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            client.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const token = generateToken(client);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            client: {
                id: client.id,
                full_name: client.full_name,
                email: client.email,
                phone_number: client.phone_number,
                whatsapp_number: client.whatsapp_number,
                is_active: client.is_active
            }
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};

export const loginClientWithGoogle = async (req, res) => {
    try {
        let { google_id, email, full_name, id_token } = req.body || {};

        if (id_token) {
            const tokenResponse = await fetch(
                `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(id_token)}`
            );

            if (!tokenResponse.ok) {
                return res.status(401).json({ success: false, message: "Invalid Google token" });
            }

            const tokenData = await tokenResponse.json();
            google_id = tokenData.sub;
            email = tokenData.email;
            full_name = tokenData.name;
        }

        if (!google_id || !email) {
            return res.status(400).json({ success: false, message: "Google account details are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const [existingRows] = await db.query(
            "SELECT * FROM clients WHERE google_id = ? OR email = ?",
            [google_id, normalizedEmail]
        );

        if (existingRows.length > 0) {
            const client = existingRows[0];

            if (!client.google_id) {
                await db.query("UPDATE clients SET google_id = ? WHERE id = ?", [google_id, client.id]);
            }

            if (!client.is_active) {
                return res.status(403).json({ success: false, message: "Your account has been deactivated" });
            }

            const safeClient = {
                id: client.id,
                full_name: client.full_name || full_name || "Google User",
                email: client.email,
                phone_number: client.phone_number,
                whatsapp_number: client.whatsapp_number,
                is_active: client.is_active,
                is_verified: true
            };

            return res.status(200).json({
                success: true,
                message: "Google login successful",
                token: generateToken(safeClient),
                client: safeClient
            });
        }

        const [result] = await db.query(
            `INSERT INTO clients
             (password, email, google_id, auth_type, full_name, is_active, is_verified)
             VALUES (NULL, ?, ?, 'google', ?, 1, 1)`,
            [normalizedEmail, google_id, full_name || "Google User"]
        );

        const client = {
            id: result.insertId,
            full_name: full_name || "Google User",
            email: normalizedEmail,
            is_active: true,
            is_verified: true
        };

        return res.status(201).json({
            success: true,
            message: "Google account created successfully",
            token: generateToken(client),
            client
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getClientData = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT id, full_name, email, phone_number, whatsapp_number, avatar, ads_count, is_active FROM clients WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        const client = rows[0];

        res.status(200).json({
            success: true,
            client: {
                ...client,
                avatar: client.avatar ? Buffer.from(client.avatar).toString("base64") : null
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const updateClientProfile = async (req, res) => {

    try {

        const clientId = req.client.id;
        const routeId = Number(req.params.id);

        if (routeId !== clientId) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: cannot update another client's profile"
            });
        }

        const {
            full_name,
            phone_number,
            whatsapp_number
        } = req.body || {};

        if (!full_name) {
            return res.status(400).json({
                success: false,
                message: "Full name is required"
            });
        }

        const [existingClient] = await db.query(
            "SELECT * FROM clients WHERE id = ?", [clientId]
        );

        if (existingClient.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        const updateFields = [
            full_name,
            phone_number || null,
            whatsapp_number || null,
        ];

        let updateSql = `
            UPDATE clients
            SET
                full_name = ?,
                phone_number = ?,
                whatsapp_number = ?
        `;

        if (req.file?.buffer) {
            updateSql += `,
                avatar = ?`;
            updateFields.push(req.file.buffer);
        }

        updateSql += `
            WHERE id = ?
        `;
        updateFields.push(clientId);

        await db.query(updateSql, updateFields);

        const [updatedClient] = await db.query(
            "SELECT id, full_name, email, phone_number, whatsapp_number, avatar, ads_count, is_active FROM clients WHERE id = ?",
            [clientId]
        );

        const clientResponse = updatedClient[0];

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            client: {
                ...clientResponse,
                avatar: clientResponse.avatar ? Buffer.from(clientResponse.avatar).toString("base64") : null
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }

};

export const changeClientPassword = async (req, res) => {
    try {
        const clientId = req.client.id;
        const routeId = Number(req.params.id);

        if (routeId !== clientId) {
            return res.status(403).json({ success: false, message: "Forbidden: cannot change another client's password" });
        }

        const { current_password, new_password } = req.body || {};

        if (!current_password || !new_password) {
            return res.status(400).json({ success: false, message: "Current and new passwords are required" });
        }

        if (new_password.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
        }

        const [rows] = await db.query("SELECT password FROM clients WHERE id = ?", [clientId]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        const hashed = rows[0].password;

        const match = await bcrypt.compare(current_password, hashed);

        if (!match) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        const newHashed = await bcrypt.hash(new_password, 10);

        await db.query("UPDATE clients SET password = ? WHERE id = ?", [newHashed, clientId]);

        res.status(200).json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getAllClients = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                id,
                full_name,
                email,
                phone_number,
                whatsapp_number,
                avatar,
                ads_count,
                is_active,
                is_verified,
                auth_type
            FROM clients
            ORDER BY id DESC
        `);

        const clients = rows.map((client) => ({
            ...client,
            avatar: client.avatar
                ? Buffer.from(client.avatar).toString("base64")
                : null
        }));

        res.status(200).json({
            success: true,
            count: clients.length,
            clients
        });

    } catch (error) {
        console.error("Get all clients error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};