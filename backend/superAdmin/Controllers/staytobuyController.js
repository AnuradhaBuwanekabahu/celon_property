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

const bufToBase64 = (buf, mime = 'image/jpeg') =>
    `data:${mime};base64,${buf.toString('base64')}`;


// ══════════════════════════════════════════════
// ADD Stay To Buy
// ══════════════════════════════════════════════
export const addStayToBuy = async (req, res) => {
    try {
        const {
            client_id, title, description, price,
            property_type, area_sqft, city,
            map_address, Location, location,
            duration, status, main_image,
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
            mainImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";
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
            INSERT INTO stays_to_buy
            (client_id, title, description, price, property_type,
             Highlights, area_sqft, city, map_address, Location,
             main_image, main_video, images,
             overview, duration, status)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        const [result] = await db.query(sql, [
            clientId,
            title,
            description   || null,
            price         || 0,
            property_type || "House",
            highlightsJson,
            area_sqft     || null,
            city          || "Colombo",
            map_address   || null,
            loc,
            mainImg,
            mainVid,
            JSON.stringify(galleryImgs),
            overviewJson,
            duration      || "month",
            status        || "pending"
        ]);

        res.status(201).json({
            success: true,
            message: "Stay To Buy added successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error("addStayToBuy error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// ══════════════════════════════════════════════
// GET ALL Stay To Buy
// ══════════════════════════════════════════════
export const getAllStayToBuy = async (req, res) => {
    try {
        const { status, city, property_type } = req.query;

        let sql = `
            SELECT s.*, c.full_name, c.email, c.phone_number
            FROM stays_to_buy s
            LEFT JOIN clients c ON s.client_id = c.id
        `;
        let conditions = [];
        let values     = [];

        if (status)        { conditions.push("s.status=?");        values.push(status); }
        if (city)          { conditions.push("s.city=?");           values.push(city); }
        if (property_type) { conditions.push("s.property_type=?");  values.push(property_type); }

        // Allow status from params too (for /status/:status route)
        if (req.params?.status) { conditions.push("s.status=?"); values.push(req.params.status); }

        // Allow search from query
        if (req.query?.search) {
            const like = `%${req.query.search}%`;
            conditions.push("(s.title LIKE ? OR s.city LIKE ? OR s.property_type LIKE ?)");
            values.push(like, like, like);
        }

        if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
        sql += " ORDER BY s.created_at DESC";

        const [rows] = await db.query(sql, values);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ══════════════════════════════════════════════
// GET SINGLE Stay To Buy
// ══════════════════════════════════════════════
export const getStayToBuyById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            `SELECT s.*, c.full_name, c.email, c.phone_number
             FROM stays_to_buy s LEFT JOIN clients c ON s.client_id = c.id
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
// UPDATE Stay To Buy
// ══════════════════════════════════════════════
export const updateStayToBuy = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, description, price, property_type,
            highlights, area_sqft, city, map_address,
            Location, location, duration, status, overview
        } = req.body;

        const [existing] = await db.query("SELECT * FROM stays_to_buy WHERE id=?", [id]);
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

        const areaSqftVal = (area_sqft !== undefined && area_sqft !== '' && !isNaN(area_sqft)) ? Number(area_sqft) : null;

        await db.query(
            `UPDATE stays_to_buy
             SET title=?, description=?, price=?,
                 property_type=?, Highlights=?,
                 area_sqft=?, city=?, map_address=?,
                 Location=?, duration=?, status=?,
                 overview=?,
                 main_image=COALESCE(?, main_image),
                 main_video=COALESCE(?, main_video),
                 images=COALESCE(?, images)
             WHERE id=?`,
            [
                title || existing[0].title,
                description !== undefined ? description : existing[0].description,
                (price !== undefined && price !== '' && !isNaN(price)) ? Number(price) : existing[0].price,
                property_type || existing[0].property_type,
                highlightsJson,
                areaSqftVal,
                city || existing[0].city,
                map_address || null,
                loc,
                duration || existing[0].duration,
                status || existing[0].status,
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
// DELETE Stay To Buy
// ══════════════════════════════════════════════
export const deleteStayToBuy = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM stays_to_buy WHERE id=?", [id]);
        if (!result.affectedRows) return res.status(404).json({ success: false, message: "Property not found" });
        res.json({ success: true, message: "Property deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};