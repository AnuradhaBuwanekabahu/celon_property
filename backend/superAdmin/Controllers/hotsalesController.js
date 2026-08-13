import db from "../../configuration/db.js";

// ──────────────────────────────────────────────
// Helper: resolve a valid client_id
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

// ──────────────────────────────────────────────
// Helper: buffer → base64 data URI
// ──────────────────────────────────────────────
const bufToBase64 = (buf, mime = 'image/jpeg') =>
    `data:${mime};base64,${buf.toString('base64')}`;


// ══════════════════════════════════════════════
// ADD Hot Sale  (POST /properties/hot-sales)
// ══════════════════════════════════════════════
export const addHotSale = async (req, res) => {
    try {
        const {
            title, description, price,
            property_type, city, Location, location,
            map_address, area_sqft, duration,
            status, client_id,
            overview, highlights,
            main_image           // fallback URL string
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
            mainImg = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6";
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

        // ── Parse JSON strings coming from FormData
        const overviewJson   = overview
            ? (typeof overview === 'string' ? overview : JSON.stringify(overview))
            : '[]';
        const highlightsJson = highlights
            ? (typeof highlights === 'string' ? highlights : JSON.stringify(highlights))
            : '[]';

        const sql = `
            INSERT INTO hot_sales
            (client_id, title, description, price, property_type,
             city, Location, map_address, area_sqft, duration,
             main_image, main_video, images,
             overview, highlights, status)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        const [result] = await db.query(sql, [
            clientId,
            title,
            description    || null,
            price          || 0,
            property_type  || "House",
            city           || "Colombo",
            loc,
            map_address    || null,
            area_sqft      || null,
            duration       || "month",
            mainImg,
            mainVid,
            JSON.stringify(galleryImgs),
            overviewJson,
            highlightsJson,
            status         || "pending"
        ]);

        res.status(201).json({
            success: true,
            message: "Hot Sale added successfully",
            id: result.insertId
        });

    } catch (error) {
        console.error("addHotSale error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// ══════════════════════════════════════════════
// GET ALL Hot Sales
// ══════════════════════════════════════════════
export const getHotSales = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT h.*, c.full_name as client_name, c.email as client_email
            FROM hot_sales h
            LEFT JOIN clients c ON h.client_id = c.id
            ORDER BY h.created_at DESC
        `);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// ══════════════════════════════════════════════
// UPDATE Hot Sale  (PUT /properties/hot-sales/:id)
// ══════════════════════════════════════════════
export const updateHotSale = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, description, price,
            property_type, city, Location, location,
            map_address, area_sqft, duration,
            overview, highlights, status
        } = req.body;

        const [existing] = await db.query("SELECT * FROM hot_sales WHERE id=?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Property not found" });
        }

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

        const loc            = Location || location || city || existing[0].Location;
        const overviewJson   = overview
            ? (typeof overview === 'string' ? overview : JSON.stringify(overview))
            : existing[0].overview || '[]';
        const highlightsJson = highlights
            ? (typeof highlights === 'string' ? highlights : JSON.stringify(highlights))
            : existing[0].highlights || '[]';

        await db.query(
            `UPDATE hot_sales
             SET title=?, description=?, price=?,
                 property_type=?, city=?, Location=?,
                 map_address=?, area_sqft=?, duration=?,
                 overview=?, highlights=?, status=?,
                 main_image=COALESCE(?, main_image),
                 main_video=COALESCE(?, main_video),
                 images=COALESCE(?, images)
             WHERE id=?`,
            [
                title, description, price,
                property_type, city, loc,
                map_address, area_sqft, duration || existing[0].duration,
                overviewJson, highlightsJson, status || existing[0].status,
                mainImg, mainVid, galleryJson,
                id
            ]
        );

        res.json({ success: true, message: "Hot Sale updated successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// ══════════════════════════════════════════════
// DELETE Hot Sale
// ══════════════════════════════════════════════
export const deleteHotSale = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query("SELECT * FROM hot_sales WHERE id=?", [id]);
        if (existing.length === 0) return res.status(404).json({ message: "Property not found" });

        await db.query("DELETE FROM hot_sales WHERE id=?", [id]);
        res.json({ success: true, message: "Hot Sale deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// ══════════════════════════════════════════════
// UPDATE STATUS
// ══════════════════════════════════════════════
export const updatePropertyStatus = async (req, res) => {
    try {
        const { id }     = req.params;
        const { status } = req.body;
        const VALID = ["pending", "active", "approved", "rejected", "sold"];
        if (!VALID.includes(status)) return res.status(400).json({ message: "Invalid status" });
        await db.query("UPDATE hot_sales SET status=? WHERE id=?", [status, id]);
        res.json({ success: true, message: `Property ${status} successfully` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};