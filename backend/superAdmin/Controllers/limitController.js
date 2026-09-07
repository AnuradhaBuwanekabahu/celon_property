import db from "../../configuration/db.js";

// ======================================================
// ADD LIMIT
// POST /api/limits
// ======================================================
export const addLimit = async (req, res) => {
    try {
        const { tier_order, limit_count, price, days } = req.body;

        // Validation
        if (
            tier_order === undefined ||
            limit_count === undefined ||
            price === undefined ||
            days === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "tier_order, limit_count, price and days are required",
            });
        }

        if (
            isNaN(Number(tier_order)) ||
            isNaN(Number(limit_count)) ||
            isNaN(Number(price)) ||
            isNaN(Number(days))
        ) {
            return res.status(400).json({
                success: false,
                message: "All limit values must be valid numbers",
            });
        }

        if (Number(tier_order) <= 0) {
            return res.status(400).json({
                success: false,
                message: "tier_order must be greater than 0",
            });
        }

        if (Number(limit_count) < 0) {
            return res.status(400).json({
                success: false,
                message: "limit_count cannot be negative",
            });
        }

        if (Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "price cannot be negative",
            });
        }

        if (Number(days) <= 0) {
            return res.status(400).json({
                success: false,
                message: "days must be greater than 0",
            });
        }

        // Check duplicate tier_order
        const [existing] = await db.execute(
            "SELECT id FROM limits WHERE tier_order = ?",
            [tier_order]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: `Tier order ${tier_order} already exists`,
            });
        }

        // Insert
        const [result] = await db.execute(
            `INSERT INTO limits
            (tier_order, limit_count, price, days)
            VALUES (?, ?, ?, ?)`,
            [
                Number(tier_order),
                Number(limit_count),
                Number(price),
                Number(days),
            ]
        );

        // Get inserted record
        const [rows] = await db.execute(
            "SELECT * FROM limits WHERE id = ?",
            [result.insertId]
        );

        return res.status(201).json({
            success: true,
            message: "Limit added successfully",
            data: rows[0],
        });
    } catch (error) {
        console.error("addLimit error:", error);

        // Duplicate unique key
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "This tier_order already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to add limit",
            error: error.message,
        });
    }
};


// ======================================================
// GET ALL LIMITS
// GET /api/limits
// ======================================================
export const getAllLimits = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT
                id,
                tier_order,
                limit_count,
                price,
                days,
                created_at,
                updated_at
             FROM limits
             ORDER BY tier_order ASC`
        );

        return res.status(200).json({
            success: true,
            count: rows.length,
            data: rows,
        });
    } catch (error) {
        console.error("getAllLimits error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch limits",
            error: error.message,
        });
    }
};


// ======================================================
// GET SINGLE LIMIT
// GET /api/limits/:id
// ======================================================
export const getLimitById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                message: "Valid limit ID is required",
            });
        }

        const [rows] = await db.execute(
            `SELECT
                id,
                tier_order,
                limit_count,
                price,
                days,
                created_at,
                updated_at
             FROM limits
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Limit not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0],
        });
    } catch (error) {
        console.error("getLimitById error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch limit",
            error: error.message,
        });
    }
};


// ======================================================
// UPDATE LIMIT
// PUT /api/limits/:id
// ======================================================
export const updateLimit = async (req, res) => {
    try {
        const { id } = req.params;
        const { tier_order, limit_count, price, days } = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                message: "Valid limit ID is required",
            });
        }

        if (
            tier_order === undefined ||
            limit_count === undefined ||
            price === undefined ||
            days === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "tier_order, limit_count, price and days are required",
            });
        }

        if (
            isNaN(Number(tier_order)) ||
            isNaN(Number(limit_count)) ||
            isNaN(Number(price)) ||
            isNaN(Number(days))
        ) {
            return res.status(400).json({
                success: false,
                message: "All limit values must be valid numbers",
            });
        }

        if (Number(tier_order) <= 0) {
            return res.status(400).json({
                success: false,
                message: "tier_order must be greater than 0",
            });
        }

        if (Number(limit_count) < 0) {
            return res.status(400).json({
                success: false,
                message: "limit_count cannot be negative",
            });
        }

        if (Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "price cannot be negative",
            });
        }

        if (Number(days) <= 0) {
            return res.status(400).json({
                success: false,
                message: "days must be greater than 0",
            });
        }

        // Check if record exists
        const [existing] = await db.execute(
            "SELECT id FROM limits WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Limit not found",
            });
        }

        // Check tier_order belongs to another record
        const [duplicate] = await db.execute(
            `SELECT id
             FROM limits
             WHERE tier_order = ?
             AND id != ?`,
            [tier_order, id]
        );

        if (duplicate.length > 0) {
            return res.status(409).json({
                success: false,
                message: `Tier order ${tier_order} already exists`,
            });
        }

        // Update
        await db.execute(
            `UPDATE limits
             SET
                tier_order = ?,
                limit_count = ?,
                price = ?,
                days = ?
             WHERE id = ?`,
            [
                Number(tier_order),
                Number(limit_count),
                Number(price),
                Number(days),
                id,
            ]
        );

        // Get updated record
        const [rows] = await db.execute(
            "SELECT * FROM limits WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Limit updated successfully",
            data: rows[0],
        });
    } catch (error) {
        console.error("updateLimit error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "This tier_order already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update limit",
            error: error.message,
        });
    }
};


// ======================================================
// DELETE LIMIT
// DELETE /api/limits/:id
// ======================================================
export const deleteLimit = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                message: "Valid limit ID is required",
            });
        }

        // Check exists
        const [existing] = await db.execute(
            "SELECT id FROM limits WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Limit not found",
            });
        }

        // Delete
        await db.execute(
            "DELETE FROM limits WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Limit deleted successfully",
        });
    } catch (error) {
        console.error("deleteLimit error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete limit",
            error: error.message,
        });
    }
};