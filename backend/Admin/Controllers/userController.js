import db from "../../configuration/db.js";

export const getTotalUsers = async (req, res) => {
    try {

        const [[row]] = await db.query(
            "SELECT COUNT(*) AS total FROM users"
        );

        res.json({
            success: true,
            total: row.total
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getUsers = async (req, res) => {

    try {

        const [users] = await db.query(`
            SELECT
                id,
                google_id,
                rate,
                created_at
            FROM users
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getUserById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM users WHERE id=?",
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.json({
            success: true,
            user: rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const updateUser = async (req, res) => {

    try {

        const { id } = req.params;
        const { rate } = req.body;

        await db.query(
            `
            UPDATE users
            SET rate=?
            WHERE id=?
            `,
            [rate, id]
        );

        res.json({
            success: true,
            message: "User updated successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};