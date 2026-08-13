import db from "../../configuration/db.js";

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const getValidClientId = async (reqClientId) => {
    if (reqClientId) {
        const [found] = await db.query("SELECT id FROM clients WHERE id = ?", [reqClientId]);
        if (found.length) return found[0].id;
    }
    const [first] = await db.query("SELECT id FROM clients LIMIT 1");
    if (first.length) return first[0].id;
    throw new Error("No client account found. Please create a client account first.");
};

const bufToBase64 = (buf, mime = 'image/jpeg') =>
    `data:${mime};base64,${buf.toString('base64')}`;


// ══════════════════════════════════════════════
// ADD Stay To Rent
// ══════════════════════════════════════════════
export const addStayToRent = async (req, res) => {
    try {
        const {
            client_id, title, description, price,
            property_type, area_sqft, city,
            map_address, Location, location,
            price_period, duration, status, main_image,
            overview, highlights
        } = req.body;

        if (!title) return res.status(400).json({ success: false, message: "Title is required" });

        const clientId = await getValidClientId(client_id);
        const loc      = Location || location || city || 'Sri Lanka';

        // ── Main image
        let mainImg = null;
        if (req.files?.main_image?.[0]) {
            const f = req.files.main_image[0];
            mainImg = bufToBase64(f.buffer, f.mimetype);
        } else if (main_image) {
            mainImg = main_image;
        } else {
            mainImg = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267";
        }

        // ── Main video
        let mainVid = null;
        if (req.files?.main_video?.[0]) {
            const f = req.files.main_video[0];
            mainVid = bufToBase64(f.buffer, f.mimetype);
        }

        // ── Gallery images
        const galleryImgs = req.files?.images
            ? req.files.images.map(f => bufToBase64(f.buffer, f.mimetype))
            : [];

        const overviewJson   = overview
            ? (typeof overview === 'string' ? overview : JSON.stringify(overview))
            : '[]';
        const highlightsJson = highlights
            ? (typeof highlights === 'string' ? highlights : JSON.stringify(highlights))
            : '[]';

        const sql = `
            INSERT INTO stays_to_rent
            (client_id, title, description, price, property_type,
             Highlights, area_sqft, city, map_address, Location,
             main_image, main_video, images,
             overview, price_period, duration, status)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        const [result] = await db.query(sql, [
            clientId,
            title,
            description   || null,
            price         || 0,
            property_type || "Apartment",
            highlightsJson,
            area_sqft     || null,
            city          || "Colombo",
            map_address   || null,
            loc,
            mainImg,
            mainVid,
            JSON.stringify(galleryImgs),
            overviewJson,
            price_period  || "monthly",
            duration      || "month",
            status        || "pending"
        ]);

        res.status(201).json({
            success: true,
            message: "Stay To Rent added successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error("addStayToRent error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// ══════════════════════════════════════════════
// GET ALL Stay To Rent
// ══════════════════════════════════════════════
export const getAllStayToRent = async (req, res) => {
    try {
        const status = req.params?.status || req.query?.status;
        const search = req.query?.search;

        let sql = `
            SELECT s.*, c.full_name, c.email, c.phone_number
            FROM stays_to_rent s
            LEFT JOIN clients c ON s.client_id = c.id
        `;
        const conditions = [];
        const values     = [];

        if (status) { conditions.push("s.status = ?"); values.push(status); }
        if (search) {
            conditions.push("(s.title LIKE ? OR s.city LIKE ? OR s.Location LIKE ?)");
            values.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
        sql += " ORDER BY s.created_at DESC";

        const [rows] = await db.query(sql, values);
        res.json({ success: true, count: rows.length, data: rows, rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ══════════════════════════════════════════════
// GET SINGLE Stay To Rent
// ══════════════════════════════════════════════
export const getStayToRentById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            `SELECT s.*, c.full_name, c.email, c.phone_number
             FROM stays_to_rent s LEFT JOIN clients c ON s.client_id = c.id
             WHERE s.id = ?`,
            [id]
        );
        if (!rows.length) return res.status(404).json({ success: false, message: "Property not found" });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ══════════════════════════════════════════════
// UPDATE Stay To Rent
// ══════════════════════════════════════════════
export const updateStayToRent = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, description, price, property_type,
            highlights, area_sqft, city,
            map_address, Location, location,
            price_period, duration, status, overview
        } = req.body;

        const [existing] = await db.query("SELECT * FROM stays_to_rent WHERE id=?", [id]);
        if (!existing.length) return res.status(404).json({ success: false, message: "Property not found" });

        const loc = Location || location || city || existing[0].Location;

        // ── Files
        let mainImg = null;
        if (req.files?.main_image?.[0]) {
            const f = req.files.main_image[0];
            mainImg = bufToBase64(f.buffer, f.mimetype);
        }
        let mainVid = null;
        if (req.files?.main_video?.[0]) {
            const f = req.files.main_video[0];
            mainVid = bufToBase64(f.buffer, f.mimetype);
        }
        let galleryJson = null;
        if (req.files?.images?.length) {
            galleryJson = JSON.stringify(
                req.files.images.map(f => bufToBase64(f.buffer, f.mimetype))
            );
        }

        const overviewJson   = overview
            ? (typeof overview === 'string' ? overview : JSON.stringify(overview))
            : existing[0].overview || '[]';
        const highlightsJson = highlights
            ? (typeof highlights === 'string' ? highlights : JSON.stringify(highlights))
            : existing[0].Highlights || '[]';

        await db.query(
            `UPDATE stays_to_rent
             SET title=?, description=?, price=?,
                 property_type=?, Highlights=?,
                 area_sqft=?, city=?, map_address=?,
                 Location=?, price_period=?, duration=?,
                 status=?, overview=?,
                 main_image=COALESCE(?, main_image),
                 main_video=COALESCE(?, main_video),
                 images=COALESCE(?, images)
             WHERE id=?`,
            [
                title, description || null, price || 0,
                property_type || "Apartment", highlightsJson,
                area_sqft || null, city || "Colombo", map_address || null,
                loc, price_period || existing[0].price_period || "monthly",
                duration || existing[0].duration || "month",
                status || existing[0].status || "pending",
                overviewJson,
                mainImg, mainVid, galleryJson,
                id
            ]
        );

        res.json({ success: true, message: "Property updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ══════════════════════════════════════════════
// DELETE Stay To Rent
// ══════════════════════════════════════════════
export const deleteStayToRent = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM stays_to_rent WHERE id=?", [id]);
        if (!result.affectedRows) return res.status(404).json({ success: false, message: "Property not found" });
        res.json({ success: true, message: "Property deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ══════════════════════════════════════════════
// UPDATE STATUS
// ══════════════════════════════════════════════
export const updateStayToRentStatus = async (req, res) => {
    try {
        const { id }     = req.params;
        const { status } = req.body;
        await db.query("UPDATE stays_to_rent SET status=? WHERE id=?", [status, id]);
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};