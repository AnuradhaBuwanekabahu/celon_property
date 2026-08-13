import db from "../../configuration/db.js";

// ==========================================
// GET AD LIMITS
// ==========================================
export const getAdLimits = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM ad_limits WHERE id = 1 LIMIT 1"
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Ad limits not found"
            });
        }

        return res.status(200).json({
            success: true,
            limits: rows[0]
        });

    } catch (error) {
        console.error("Get Ad Limits Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE AD LIMITS
// ==========================================
export const updateAdLimits = async (req, res) => {
    try {
        const {
            free_ad_limit,
            second_limit,
            second_limit_charge,
            third_limit,
            third_limit_charge
        } = req.body;

        // Validate fields
        if (
            free_ad_limit === undefined ||
            second_limit === undefined ||
            second_limit_charge === undefined ||
            third_limit === undefined ||
            third_limit_charge === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All ad limit fields are required"
            });
        }

        // Validate numbers
        if (
            isNaN(free_ad_limit) ||
            isNaN(second_limit) ||
            isNaN(second_limit_charge) ||
            isNaN(third_limit) ||
            isNaN(third_limit_charge)
        ) {
            return res.status(400).json({
                success: false,
                message: "All values must be numbers"
            });
        }

        // Update existing row
        const [result] = await db.query(
            `
            UPDATE ad_limits
            SET
                free_ad_limit = ?,
                second_limit = ?,
                second_limit_charge = ?,
                third_limit = ?,
                third_limit_charge = ?
            WHERE id = 1
            `,
            [
                Number(free_ad_limit),
                Number(second_limit),
                Number(second_limit_charge),
                Number(third_limit),
                Number(third_limit_charge)
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Ad limits record not found"
            });
        }

        // Get updated values
        const [rows] = await db.query(
            "SELECT * FROM ad_limits WHERE id = 1 LIMIT 1"
        );

        return res.status(200).json({
            success: true,
            message: "Ad limits updated successfully",
            limits: rows[0]
        });

    } catch (error) {
        console.error("Update Ad Limits Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};