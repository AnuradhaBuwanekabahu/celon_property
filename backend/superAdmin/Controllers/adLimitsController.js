import db from "../../configuration/db.js";

// Get limits
export const getAdLimits = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM ad_limits LIMIT 1");

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Ad limits not configured. Run database setup (setup_database.js or ad_limits.sql).",
            });
        }

        res.status(200).json({
            success: true,
            limits: rows[0],
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database or server error: " + error.message,
        });
    }
};

// Update limits
export const updateAdLimits = async (req, res) => {
    try {
        const {
            free_ad_limit,
            second_limit,
            second_limit_charge,
            third_limit,
            third_limit_charge,
        } = req.body;

        const [existing] = await db.query("SELECT id FROM ad_limits LIMIT 1");

        if (!existing || existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Ad limits not configured. Run database setup (setup_database.js or ad_limits.sql).",
            });
        }

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
                existing[0].id,
            ]
        );

        res.status(200).json({
            success: true,
            message: "Ad limits updated successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database or server error: " + error.message,
        });
    }
};
