import db from "../../configuration/db.js";

// Get limits
export const getAdLimits = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, tier_order, limit_count, price, days, created_at, updated_at FROM limits ORDER BY tier_order"
        );

        res.status(200).json({
            success: true,
            limits: rows || [],
            message: rows?.length ? undefined : "No ad limit tiers are configured yet.",
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
        const limits = Array.isArray(req.body) ? req.body : req.body.limits;
        if (!Array.isArray(limits) || limits.length === 0) {
            return res.status(400).json({ success: false, message: "At least one limit is required" });
        }

        for (const limit of limits) {
            if (Number(limit.limit_count) < 0 || Number(limit.price) < 0 || Number(limit.days) < 1 || Number(limit.tier_order) < 1) {
                return res.status(400).json({ success: false, message: "Each limit must have valid count, price, and days" });
            }
            if (limit.id) {
                await db.query(
                    "UPDATE limits SET tier_order = ?, limit_count = ?, price = ?, days = ? WHERE id = ?",
                    [Number(limit.tier_order), Number(limit.limit_count), Number(limit.price), Number(limit.days), Number(limit.id)]
                );
            } else {
                await db.query(
                    "INSERT INTO limits (tier_order, limit_count, price, days) VALUES (?, ?, ?, ?)",
                    [Number(limit.tier_order), Number(limit.limit_count), Number(limit.price), Number(limit.days)]
                );
            }
        }

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
