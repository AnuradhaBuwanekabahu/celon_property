
import db from "../../configuration/db.js";
import bcrypt from "bcrypt";

// ======================================================
// REGISTER CLIENT
// ======================================================

export const registerClient = async (req, res) => {
    try {

        const {
            full_name,
            email,
            password,
            phone_number = null,
            whatsapp_number = null
        } = req.body;

        // ==============================================
        // VALIDATION
        // ==============================================

        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Full name, email and password are required"
            });
        }

        // ==============================================
        // CHECK EXISTING EMAIL
        // ==============================================

        const [existingClient] = await db.query(
            `
            SELECT id
            FROM clients
            WHERE email = ?
            `,
            [email]
        );

        if (existingClient.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // ==============================================
        // HASH PASSWORD
        // ==============================================

        const hashedPassword = await bcrypt.hash(password, 10);

        // ==============================================
        // AVATAR
        // ==============================================

        let avatar = null;
        

        if (req.file) {
            avatar = req.file.buffer;
            
        }

        // ==============================================
        // INSERT CLIENT
        // ==============================================

        const [result] = await db.query(
            `
            INSERT INTO clients
            (
                password,
                email,
                phone_number,
                whatsapp_number,
                full_name,
                avatar
                
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                hashedPassword,
                email,
                phone_number,
                whatsapp_number,
                full_name,
                avatar
                
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Client registered successfully",
            clientId: result.insertId
        });

    } catch (error) {

        console.error("REGISTER CLIENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// LOGIN CLIENT
// ======================================================

export const loginClient = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        // ==============================================
        // GET CLIENT
        // ==============================================

        const [rows] = await db.query(
            `
            SELECT
                id,
                full_name,
                email,
                phone_number,
                whatsapp_number,
                avatar
            
                is_active,
                password
            FROM clients
            WHERE email = ?
            `,
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const client = rows[0];

        // ==============================================
        // CHECK ACTIVE STATUS
        // ==============================================

        if (!client.is_active) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account has been deactivated. Please contact support."
            });
        }

        // ==============================================
        // CHECK PASSWORD
        // ==============================================

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

        // ==============================================
        // LOGIN SUCCESS
        // ==============================================

        return res.status(200).json({
            success: true,
            message: "Login successful",

            client: {
                id: client.id,
                full_name: client.full_name,
                email: client.email,
                phone_number: client.phone_number,
                whatsapp_number: client.whatsapp_number,
                is_active: client.is_active,

                avatar: client.avatar
                    ? `/api/clients/${client.id}/avatar`
                    : null
            }
        });

    } catch (error) {

        console.error("LOGIN CLIENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// GET ALL CLIENTS - ADMIN
// ======================================================

export const getClients = async (req, res) => {
    try {

        const [clients] = await db.query(
            `
            SELECT
                id,
                full_name,
                email,
                phone_number,
                whatsapp_number,
                is_active,
                created_at
            FROM clients
            ORDER BY created_at DESC
            `
        );

        // ==============================================
        // ADD AVATAR URL
        // ==============================================

        const data = clients.map((client) => ({
            ...client,

            avatar:
                `/api/clients/${client.id}/avatar`
        }));

        return res.json({
            success: true,
            clients: data
        });

    } catch (error) {

        console.error("GET CLIENTS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET CLIENT BY ID
// ======================================================

export const getClientById = async (req, res) => {
    try {

        const { id } = req.params;

        // ==============================================
        // GET CLIENT
        // ==============================================

        const [clientRows] = await db.query(
            `
            SELECT
                id,
                full_name,
                email,
                phone_number,
                whatsapp_number,
                is_active,
                created_at
            FROM clients
            WHERE id = ?
            `,
            [id]
        );

        if (clientRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        const client = clientRows[0];

        // ==============================================
        // PROPERTY COUNTS
        // ==============================================

        const [hotSales] = await db.query(
            `
            SELECT COUNT(*) AS count
            FROM hot_sales
            WHERE client_id = ?
            `,
            [id]
        );

        const [stayToBuy] = await db.query(
            `
            SELECT COUNT(*) AS count
            FROM stays_to_buy
            WHERE client_id = ?
            `,
            [id]
        );

        const [stayToRent] = await db.query(
            `
            SELECT COUNT(*) AS count
            FROM stays_to_rent
            WHERE client_id = ?
            `,
            [id]
        );

        const [lands] = await db.query(
            `
            SELECT COUNT(*) AS count
            FROM land
            WHERE client_id = ?
            `,
            [id]
        );
        const [
    advertisements
] = await db.query(
    `
    SELECT COUNT(*) AS count
    FROM ads
    WHERE client_id = ?
    `,
    [id]
);

        // ==============================================
        // RESPONSE
        // ==============================================

        return res.json({
            success: true,

            client: {

                ...client,

                avatar:
                    `/api/clients/${id}/avatar`,

                propertyCount: {

                    hotSales:
                        hotSales[0].count,

                    stayToBuy:
                        stayToBuy[0].count,

                    stayToRent:
                        stayToRent[0].count,

                    lands:
                        lands[0].count,

                    advertisements:
                        advertisements[0].count   


                }
            }
        });

    } catch (error) {

        console.error("GET CLIENT BY ID ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET CLIENT AVATAR
// ======================================================

export const getClientAvatar = async (req, res) => {
    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                avatar
               
            FROM clients
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        if (!rows[0].avatar) {
            return res.status(404).json({
                success: false,
                message: "Avatar not found"
            });
        }

        // ==============================================
        // IMAGE MIME TYPE
        // ==============================================

        res.setHeader("Content-Type", "image/jpeg");

        res.send(rows[0].avatar);

    } catch (error) {

        console.error("GET CLIENT AVATAR ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// UPDATE CLIENT
// ======================================================

export const updateClient = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            full_name,
            email,
            phone_number,
            whatsapp_number,
            password
        } = req.body;

        // ==============================================
        // CHECK CLIENT
        // ==============================================

        const [existingClient] = await db.query(
            `
            SELECT id
            FROM clients
            WHERE id = ?
            `,
            [id]
        );

        if (existingClient.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        // ==============================================
        // CHECK EMAIL
        // ==============================================

        if (email) {

            const [emailExists] = await db.query(
                `
                SELECT id
                FROM clients
                WHERE email = ?
                AND id != ?
                `,
                [email, id]
            );

            if (emailExists.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists"
                });
            }
        }

        // ==============================================
        // BUILD UPDATE QUERY
        // ==============================================

        let query = `
            UPDATE clients
            SET
                full_name = ?,
                email = ?,
                phone_number = ?,
                whatsapp_number = ?
        `;

        let values = [
            full_name,
            email,
            phone_number || null,
            whatsapp_number || null
        ];

        // ==============================================
        // PASSWORD
        // ==============================================

        if (password && password.trim() !== "") {

            const hashedPassword =
                await bcrypt.hash(password, 10);

            query += `,
                password = ?
            `;

            values.push(hashedPassword);
        }

        // ==============================================
        // AVATAR
        // ==============================================

        if (req.file) {

            query += `,
                avatar = ?
                
            `;

            values.push(
                req.file.buffer
                
            );
        }

        query += `
            WHERE id = ?
        `;

        values.push(id);

        // ==============================================
        // UPDATE
        // ==============================================

        await db.query(
            query,
            values
        );

        return res.json({
            success: true,
            message: "Client updated successfully"
        });

    } catch (error) {

        console.error("UPDATE CLIENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// UPDATE CLIENT STATUS
// ======================================================

export const updateClientStatus = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            is_active
        } = req.body;

        // ==============================================
        // VALIDATION
        // ==============================================

        if (
            is_active !== 0 &&
            is_active !== 1 &&
            is_active !== true &&
            is_active !== false
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid is_active value"
            });
        }

        // ==============================================
        // UPDATE STATUS
        // ==============================================

        const [result] = await db.query(
            `
            UPDATE clients
            SET is_active = ?
            WHERE id = ?
            `,
            [
                is_active ? 1 : 0,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        return res.json({
            success: true,
            message: "Client status updated"
        });

    } catch (error) {

        console.error(
            "UPDATE CLIENT STATUS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




