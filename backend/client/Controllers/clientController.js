import db from "../../configuration/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export const registerClient = async (req, res) => {

    try {

        const {
            full_name,
            email,
            password,
            phone_number = null,
            whatsapp_number = null
        } = req.body;

        // Validate required fields
        if (!full_name || !email || !password) {
            return res.status(400).json({
                message: "Full name, email and password are required"
            });
        }

        // Check existing email
        const [existingClient] = await db.query(
            "SELECT * FROM clients WHERE email = ?", [email]
        );

        if (existingClient.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert client
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
                email,
                phone_number,
                whatsapp_number,
                full_name
            ]
        );

        const client = {
            id: result.insertId,
            full_name,
            email,
            phone_number,
            whatsapp_number,
            is_active: true
        };

        const token = generateToken(client);

        res.status(201).json({
            message: "Client registered successfully",
            token,
            client
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }

};

// login client

export const loginClient = async (req, res) => {

    try {

        const { email, password } = req.body;

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

        // check client is approved or not
        if (!client.is_active) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Please contact support."
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

        // login successful
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

        const clientId = req.client.id; // set by auth middleware from JWT
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

        // Validate required fields
        if (!full_name) {
            return res.status(400).json({
                success: false,
                message: "Full name is required"
            });
        }

        // Check client exists
        const [existingClient] = await db.query(
            "SELECT * FROM clients WHERE id = ?", [clientId]
        );

        if (existingClient.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        // Update client (email is never touched here)
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

        // Fetch updated record to return fresh data
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