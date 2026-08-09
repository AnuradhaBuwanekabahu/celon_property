import db from "../../configuration/db.js";

// Helper to ensure ad_limits table exists automatically
const ensureAdLimitsTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ad_limits (
            id                      INT AUTO_INCREMENT PRIMARY KEY,
            free_ad_limit           INT             NOT NULL DEFAULT 5,
            second_limit            INT             NOT NULL DEFAULT 10,
            second_limit_charge     DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
            third_limit             INT             NOT NULL DEFAULT 20,
            third_limit_charge      DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
            created_at              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
            updated_at              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_limits (free_ad_limit, second_limit, third_limit)
        );
    `;
    await db.query(createTableQuery);

    const [rows] = await db.query("SELECT * FROM ad_limits LIMIT 1");
    if (!rows || rows.length === 0) {
        await db.query(
            `INSERT INTO ad_limits (id, free_ad_limit, second_limit, second_limit_charge, third_limit, third_limit_charge)
             VALUES (1, 5, 10, 0.00, 20, 0.00)
             ON DUPLICATE KEY UPDATE id=1`
        );
    }
};

// Get limits
export const getAdLimits = async (req, res) => {
    try {
        await ensureAdLimitsTable();

        let [rows] = await db.query(
            "SELECT * FROM ad_limits LIMIT 1"
        );

        res.status(200).json({
            success: true,
            limits: rows[0]
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database or server error: " + error.message
        });
    }
};

// Update limits
export const updateAdLimits = async (req, res) => {
    try {
        await ensureAdLimitsTable();

        const {
            free_ad_limit,
            second_limit,
            second_limit_charge,
            third_limit,
            third_limit_charge
        } = req.body;

        const [existing] = await db.query("SELECT id FROM ad_limits LIMIT 1");

        if (!existing || existing.length === 0) {
            await db.query(
                `INSERT INTO ad_limits (id, free_ad_limit, second_limit, second_limit_charge, third_limit, third_limit_charge)
                 VALUES (1, ?, ?, ?, ?, ?)`,
                [
                    free_ad_limit || 5,
                    second_limit || 10,
                    second_limit_charge || 0.00,
                    third_limit || 20,
                    third_limit_charge || 0.00
                ]
            );
        } else {
            await db.query(
                `UPDATE ad_limits
                 SET
                    free_ad_limit=?,
                    second_limit=?,
                    second_limit_charge=?,
                    third_limit=?,
                    third_limit_charge=?
                 WHERE id=?`,
                [
                    free_ad_limit,
                    second_limit,
                    second_limit_charge,
                    third_limit,
                    third_limit_charge,
                    existing[0].id
                ]
            );
        }

        res.status(200).json({
            success: true,
            message: "Ad limits updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database or server error: " + error.message
        });
    }
};

