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

export const addHotSale = async (req, res) => {
    try {
        const mediaError = validateMediaSize(req.files);
        if (mediaError) return res.status(413).json({ success: false, message: mediaError });

        const {
            title,
            description,
            price,
            property_type,
            city,
            district,
            address,
            map_address,
            area_sqft,
            duration,
            status,
            client_id,
            overview,
            highlights,
            rate,
            main_image,
            selected_days,
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
            mainImg = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6";
        }

        let mainVid = null;
        if (req.files?.main_video?.[0]) {
            const file = req.files.main_video[0];
            mainVid = file.buffer;
        }

        const overviewJson = toJsonString(overview, "[]");
        const highlightsJson = toJsonString(highlights, "[]");

        const [result] = await db.query(
            `INSERT INTO hot_sales
            (client_id, title, description, price, property_type,
             overview, highlights, area_sqft, district, city, address, map_address,
             main_video, duration, selected_days, main_image, rate, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
            [
                clientId,
                title,
                description || null,
                price || 0,
                property_type || "House",
                overviewJson,
                highlightsJson,
                area_sqft || null,
                districtValue,
                city || "Colombo",
                addressValue,
                map_address || null,
                mainVid,
                duration || "month",
                Number(selected_days || days) || 30,
                mainImg,
                rate || 0,
                status || "pending"
            ]
        );

        if (req.files?.images?.length) {
            for (const file of req.files.images) {
                await db.query("INSERT INTO hot_sale_images (hot_sale_id, image) VALUES (?, ?)", [result.insertId, file.buffer]);
            }
        }

        res.status(201).json({ success: true, message: "Hot Sale added successfully", id: result.insertId });
    } catch (error) {
        console.error("addHotSale error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

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

export const updateHotSale = async (req, res) => {
    try {
        const mediaError = validateMediaSize(req.files);
        if (mediaError) return res.status(413).json({ success: false, message: mediaError });

        const { id } = req.params;
        const {
            title,
            description,
            price,
            property_type,
            city,
            district,
            address,
            map_address,
            area_sqft,
            duration,
            overview,
            highlights,
            status,
            rate
        } = req.body;

        const [existing] = await db.query("SELECT * FROM hot_sales WHERE id=?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Property not found" });
        }

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

        const districtValue = district || city || existing[0].district || "Colombo";
        const addressValue = address || existing[0].address || "Address not provided";
        const overviewJson = toJsonString(overview, existing[0].overview || "[]");
        const highlightsJson = toJsonString(highlights, existing[0].highlights || "[]");

        await db.query(
            `UPDATE hot_sales
             SET title=?, description=?, price=?,
                 property_type=?, city=?, district=?, address=?, map_address=?, area_sqft=?, duration=?,
                 overview=?, highlights=?, status=?, rate=?,
                 main_image=COALESCE(?, main_image),
                 main_video=COALESCE(?, main_video)
             WHERE id=?`,
            [
                title || existing[0].title,
                description ?? existing[0].description,
                price ?? existing[0].price,
                property_type || existing[0].property_type,
                city || existing[0].city,
                districtValue,
                addressValue,
                map_address ?? existing[0].map_address,
                area_sqft ?? existing[0].area_sqft,
                duration || existing[0].duration,
                overviewJson,
                highlightsJson,
                status || existing[0].status,
                rate ?? existing[0].rate,
                mainImg,
                mainVid,
                id
            ]
        );

        if (req.files?.images?.length) {
            await db.query("DELETE FROM hot_sale_images WHERE hot_sale_id = ?", [id]);
            for (const file of req.files.images) {
                await db.query("INSERT INTO hot_sale_images (hot_sale_id, image) VALUES (?, ?)", [id, file.buffer]);
            }
        }

        res.json({ success: true, message: "Hot Sale updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteHotSale = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query("SELECT * FROM hot_sales WHERE id=?", [id]);
        if (existing.length === 0) return res.status(404).json({ message: "Property not found" });

        await db.query("DELETE FROM hot_sale_images WHERE hot_sale_id=?", [id]);
        await db.query("DELETE FROM hot_sales WHERE id=?", [id]);
        res.json({ success: true, message: "Hot Sale deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updatePropertyStatus = async (req, res) => {
    try {
        const { id } = req.params;
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