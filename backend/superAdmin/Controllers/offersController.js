import db from "../../configuration/db.js";

// ==========================
// Get All Offers
// ==========================
export const getOffers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                id, title, description,
                discount_percent, discount_amount,
                offer_type, applicable_to, promo_code,
                start_date, end_date, max_uses, used_count,
                status, created_at
            FROM offers
            ORDER BY created_at DESC
        `);

        res.status(200).json({ success: true, data: rows });

    } catch (error) {
        console.error("getOffers error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// ==========================
// Get Single Offer
// ==========================
export const getOfferById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM offers WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }

        res.status(200).json({ success: true, data: rows[0] });

    } catch (error) {
        console.error("getOfferById error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// ==========================
// Add New Offer
// ==========================
export const addOffer = async (req, res) => {
    try {
        const {
            title,
            description,
            discount_percent,
            discount_amount,
            offer_type,
            applicable_to,
            promo_code,
            start_date,
            end_date,
            max_uses,
            status
        } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }
        if (!start_date || !end_date) {
            return res.status(400).json({ success: false, message: "Start date and end date are required" });
        }
        if (new Date(end_date) < new Date(start_date)) {
            return res.status(400).json({ success: false, message: "End date must be after start date" });
        }

        await db.query(`
            INSERT INTO offers
            (title, description, discount_percent, discount_amount, offer_type,
             applicable_to, promo_code, start_date, end_date, max_uses, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title,
            description || null,
            discount_percent || 0,
            discount_amount || 0,
            offer_type || "percentage",
            applicable_to || "all",
            promo_code || null,
            start_date,
            end_date,
            max_uses || null,
            status || "active"
        ]);

        res.status(201).json({ success: true, message: "Offer created successfully" });

    } catch (error) {
        console.error("addOffer error:", error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ success: false, message: "Promo code already exists. Use a unique promo code." });
        }
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};


// ==========================
// Update Offer
// ==========================
export const updateOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            discount_percent,
            discount_amount,
            offer_type,
            applicable_to,
            promo_code,
            start_date,
            end_date,
            max_uses,
            status
        } = req.body;

        const [existing] = await db.query("SELECT * FROM offers WHERE id = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }

        await db.query(`
            UPDATE offers SET
                title = ?,
                description = ?,
                discount_percent = ?,
                discount_amount = ?,
                offer_type = ?,
                applicable_to = ?,
                promo_code = ?,
                start_date = ?,
                end_date = ?,
                max_uses = ?,
                status = ?
            WHERE id = ?
        `, [
            title,
            description || null,
            discount_percent || 0,
            discount_amount || 0,
            offer_type || "percentage",
            applicable_to || "all",
            promo_code || null,
            start_date,
            end_date,
            max_uses || null,
            status || "active",
            id
        ]);

        res.json({ success: true, message: "Offer updated successfully" });

    } catch (error) {
        console.error("updateOffer error:", error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ success: false, message: "Promo code already exists." });
        }
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// ==========================
// Update Offer Status Only
// ==========================
export const updateOfferStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["active", "inactive", "expired"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        await db.query("UPDATE offers SET status = ? WHERE id = ?", [status, id]);
        res.json({ success: true, message: `Offer ${status} successfully` });

    } catch (error) {
        console.error("updateOfferStatus error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// ==========================
// Delete Offer
// ==========================
export const deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query("SELECT * FROM offers WHERE id = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }

        await db.query("DELETE FROM offers WHERE id = ?", [id]);
        res.json({ success: true, message: "Offer deleted successfully" });

    } catch (error) {
        console.error("deleteOffer error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// ==========================
// Verify Promo Code (Public)
// ==========================
export const verifyPromoCode = async (req, res) => {
    try {
        const { code } = req.params;

        const [rows] = await db.query(`
            SELECT id, title, discount_percent, discount_amount, offer_type, applicable_to, end_date, max_uses, used_count
            FROM offers
            WHERE promo_code = ? AND status = 'active'
              AND start_date <= CURDATE() AND end_date >= CURDATE()
        `, [code]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Invalid or expired promo code" });
        }

        const offer = rows[0];
        if (offer.max_uses !== null && offer.used_count >= offer.max_uses) {
            return res.status(400).json({ success: false, message: "This promo code has reached its usage limit" });
        }

        res.json({ success: true, data: offer, message: "Promo code is valid!" });

    } catch (error) {
        console.error("verifyPromoCode error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
