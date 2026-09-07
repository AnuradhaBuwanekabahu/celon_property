import db from "../../configuration/db.js";

const MAX_MEDIA_BYTES = 12 * 1024 * 1024;

const validateMediaSize = (files = {}) => {
    const uploadedFiles = Object.values(files).flat().filter(Boolean);
    const oversizedFile = uploadedFiles.find((file) => file.size > MAX_MEDIA_BYTES);
    return oversizedFile ? `File ${oversizedFile.originalname || "upload"} is too large. Use files smaller than 12 MB.` : null;
};

const getValidClientId = async (reqClientId) => {
    if (reqClientId) {
        const [found] = await db.query("SELECT id FROM clients WHERE id = ?", [reqClientId]);
        if (found.length) return found[0].id;
    }
    const [first] = await db.query("SELECT id FROM clients LIMIT 1");
    if (first.length) return first[0].id;
    throw new Error("No client account found. Please create a client account first.");
};

const toJsonString = (value, fallback = "[]") => {
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value === "string") return value;
    return JSON.stringify(value);
};

export const addStayToRent = async (req, res) => {
    try {
        const mediaError = validateMediaSize(req.files);
        if (mediaError) return res.status(413).json({ success: false, message: mediaError });

        const {
            client_id,
            title,
            description,
            price,
            property_type,
            area_sqft,
            city,
            district,
            address,
            map_address,
            price_period,
            duration,
            status,
            main_image,
            overview,
            highlights,
            rate,
            days
        } = req.body;

        if (!title) return res.status(400).json({ success: false, message: "Title is required" });

        const clientId = await getValidClientId(client_id);
        const districtValue = district || city || "Colombo";
        const addressValue = address || "Address not provided";

        let mainImg = null;
        if (req.files?.main_image?.[0]) {
            const file = req.files.main_image[0];
            mainImg = file.buffer;
        } else if (main_image) {
            mainImg = main_image;
        } else {
            mainImg = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267";
        }

        let mainVid = null;
        if (req.files?.main_video?.[0]) {
            const file = req.files.main_video[0];
            mainVid = file.buffer;
        }

        const overviewJson = toJsonString(overview, "[]");
        const highlightsJson = toJsonString(highlights, "[]");

        const [result] = await db.query(
            `INSERT INTO stays_to_rent
             (client_id, title, description, price, overview, duration, property_type,
              highlights, rate, area_sqft, district, city, address, map_address,
              main_image, main_video, price_period, days, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
            [
                clientId,
                title,
                description || null,
                price || 0,
                overviewJson,
                duration || "month",
                property_type || "Apartment",
                highlightsJson,
                rate || 0,
                area_sqft || null,
                districtValue,
                city || "Colombo",
                addressValue,
                map_address || null,
                mainImg,
                mainVid,
                price_period || "monthly",
                Number(days) || 30,
                status || "pending"
            ]
        );

        if (req.files?.images?.length) {
            for (const file of req.files.images) {
                await db.query("INSERT INTO stay_to_rent_images (stay_rent_id, image) VALUES (?, ?)", [result.insertId, file.buffer]);
            }
        }

        res.status(201).json({ success: true, message: "Stay To Rent added successfully", id: result.insertId });
    } catch (error) {
        console.error("addStayToRent error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

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
        const values = [];

        if (status) { conditions.push("s.status = ?"); values.push(status); }
        if (search) {
            conditions.push("(s.title LIKE ? OR s.city LIKE ? OR s.address LIKE ? OR s.district LIKE ?)");
            values.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
        sql += " ORDER BY s.created_at DESC";

        const [rows] = await db.query(sql, values);
        res.json({ success: true, count: rows.length, data: rows, rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

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

export const updateStayToRent = async (req, res) => {
    try {
        const mediaError = validateMediaSize(req.files);
        if (mediaError) return res.status(413).json({ success: false, message: mediaError });

        const { id } = req.params;
        const {
            title,
            description,
            price,
            property_type,
            highlights,
            area_sqft,
            city,
            district,
            address,
            map_address,
            price_period,
            duration,
            status,
            overview,
            rate,
            location
        } = req.body;

        const [existing] = await db.query("SELECT * FROM stays_to_rent WHERE id=?", [id]);
        if (!existing.length) return res.status(404).json({ success: false, message: "Property not found" });

        let mainImg = null;
        if (req.files?.main_image?.[0]) {
            const file = req.files.main_image[0];
            mainImg = file.buffer;
        }
        let mainVid = null;
        if (req.files?.main_video?.[0]) {
            const file = req.files.main_video[0];
            mainVid = file.buffer;
        }

        const districtValue = district || location || city || existing[0].district || "Colombo";
        const addressValue = address || location || existing[0].address || "Address not provided";
        const overviewJson = toJsonString(overview, existing[0].overview || "[]");
        const highlightsJson = toJsonString(highlights, existing[0].highlights || "[]");

        await db.query(
            `UPDATE stays_to_rent
             SET title=?, description=?, price=?,
                 overview=?, duration=?, property_type=?,
                 highlights=?, rate=?, area_sqft=?, district=?, city=?, address=?, map_address=?,
                 price_period=?, status=?,
                 main_image=COALESCE(?, main_image),
                 main_video=COALESCE(?, main_video)
             WHERE id=?`,
            [
                title || existing[0].title,
                description ?? existing[0].description,
                price ?? existing[0].price,
                overviewJson,
                duration || existing[0].duration || "month",
                property_type || existing[0].property_type,
                highlightsJson,
                rate ?? existing[0].rate,
                area_sqft ?? existing[0].area_sqft,
                districtValue,
                city || existing[0].city,
                addressValue,
                map_address ?? existing[0].map_address,
                price_period || existing[0].price_period || "monthly",
                status || existing[0].status || "pending",
                mainImg,
                mainVid,
                id
            ]
        );

        if (req.files?.images?.length) {
            await db.query("DELETE FROM stay_to_rent_images WHERE stay_rent_id = ?", [id]);
            for (const file of req.files.images) {
                await db.query("INSERT INTO stay_to_rent_images (stay_rent_id, image) VALUES (?, ?)", [id, file.buffer]);
            }
        }

        res.json({ success: true, message: "Property updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteStayToRent = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM stay_to_rent_images WHERE stay_rent_id=?", [id]);
        const [result] = await db.query("DELETE FROM stays_to_rent WHERE id=?", [id]);
        if (!result.affectedRows) return res.status(404).json({ success: false, message: "Property not found" });
        res.json({ success: true, message: "Property deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateStayToRentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await db.query("UPDATE stays_to_rent SET status=? WHERE id=?", [status, id]);
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};