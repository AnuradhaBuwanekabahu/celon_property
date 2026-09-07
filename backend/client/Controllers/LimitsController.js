import db from "../../configuration/db.js";

export const showClientLimitOptions = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Client id is required"
            });
        }

        const [clientRows] = await db.query(
            "SELECT total_ads_count FROM clients WHERE id = ?",
            [id]
        );

        if (!clientRows.length) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        const totalAdsCount = Number(clientRows[0].total_ads_count || 0);
        const nextAdIndex = totalAdsCount + 1;

        const [limitRows] = await db.query(
            `SELECT id, tier_order, price, days
             FROM limits
             WHERE limit_count >= ?
             ORDER BY tier_order ASC`,
            [nextAdIndex]
        );

        if (!limitRows.length) {
            return res.status(409).json({
                success: false,
                message: "No ad limit tier is available for this client.",
                client_id: Number(id),
                total_ads_count: totalAdsCount,
                next_ad_index: nextAdIndex
            });
        }

        const limits = limitRows.map((limit) => ({
            id: limit.id,
            tier_order: limit.tier_order,
            price: Number(limit.price || 0),
            days: Number(limit.days || 0),
        }));

        const defaultLimit = limits[0];

        return res.status(200).json({
            success: true,
            client_id: Number(id),
            total_ads_count: totalAdsCount,
            next_ad_index: nextAdIndex,
            default_limit: {
                tier_order: defaultLimit.tier_order,
                price: defaultLimit.price,
                days: defaultLimit.days
            },
            limits
        });
    } catch (error) {
        console.error("Show client limits error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};


