import db from "../../configuration/db.js";

const parseJSONSafe = (value) => {
    if (value === undefined || value === null || value === "") {
        return [];
    }

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    return Array.isArray(value) ? value : [];
};

// =====================================================
// ADD HOT SALE
// =====================================================

export const addHotSale = async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const {
            client_id,
            title,
            description,
            price,
            property_type,
            overview,
            highlights,
            area_sqft,
            district,
            city,
            address,
            map_address,
            duration,
            rate,
            status
        } = req.body;

        const normalizedClientId =
            client_id && String(client_id).trim() !== ""
                ? Number(client_id)
                : null;

        if (!normalizedClientId) {
            await connection.rollback();
            return res.status(401).json({
                success: false,
                message: "Please log in before adding a property."
            });
        }

        if (!title || price === undefined || price === null || price === "") {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: "Title and price are required."
            });
        }

        if (!req.files?.main_image || req.files.main_image.length === 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: "Main image is required."
            });
        }

        const mainImage = req.files.main_image[0].buffer;
        const mainVideo = req.files?.main_video?.[0]?.buffer ?? null;

        const overviewData = parseJSONSafe(overview);
        const highlightsData = parseJSONSafe(highlights);

        const [result] = await connection.query(
            `
            INSERT INTO hot_sales
            (
                client_id,
                title,
                description,
                price,
                property_type,
                overview,
                highlights,
                area_sqft,
                district,
                city,
                address,
                map_address,
                main_video,
                duration,
                main_image,
                rate,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                normalizedClientId,
                title,
                description || null,
                price,
                property_type || "House",
                JSON.stringify(overviewData),
                JSON.stringify(highlightsData),
                area_sqft || null,
                district || city || "Colombo",
                city || "Colombo",
                address || "Address not provided",
                map_address || null,
                mainVideo,
                duration || "month",
                mainImage,
                rate ?? 0,
                status || "pending"
            ]
        );

        if (req.files?.images?.length) {
            for (const image of req.files.images) {
                await connection.query(
                    `
                    INSERT INTO hot_sale_images (hot_sale_id, image)
                    VALUES (?, ?)
                    `,
                    [result.insertId, image.buffer]
                );
            }
        }

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Hot sale added successfully",
            id: result.insertId
        });
    } catch (error) {
        await connection.rollback();
        console.error("ADD HOT SALE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    } finally {
        connection.release();
    }
};

// =====================================================
// GET ALL HOT SALES
// =====================================================

export const getHotSales = async (req, res) => {
    try {
        const [hotSales] = await db.query(`
            SELECT
                id,
                client_id,
                title,
                description,
                price,
                property_type,
                overview,
                highlights,
                area_sqft,
                district,
                city,
                address,
                map_address,
                duration,
                rate,
                status,
                created_at,
                updated_at
            FROM hot_sales
            ORDER BY created_at DESC
        `);

        const data = await Promise.all(
            hotSales.map(async (item) => {
                const [images] = await db.query(
                    `
                    SELECT id
                    FROM hot_sale_images
                    WHERE hot_sale_id = ?
                    ORDER BY id ASC
                    `,
                    [item.id]
                );

                return {
                    ...item,
                    overview: parseJSONSafe(item.overview),
                    highlights: parseJSONSafe(item.highlights),
                    main_image: `/api/hotsales/main-image/${item.id}`,
                    main_video: `/api/hotsales/main-video/${item.id}`,
                    images: images.map((img) => `/api/hotsales/image/${img.id}`)
                };
            })
        );

        return res.status(200).json({
            success: true,
            message: "Hot sales fetched",
            hotSales: data
        });
    } catch (error) {
        console.error("GET HOT SALES ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

// =====================================================
// GET SINGLE HOT SALE
// =====================================================

export const getHotSaleById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                id,
                client_id,
                title,
                description,
                price,
                property_type,
                overview,
                highlights,
                area_sqft,
                district,
                city,
                address,
                map_address,
                duration,
                rate,
                status,
                created_at,
                updated_at
            FROM hot_sales
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Hot sale not found"
            });
        }

        const [images] = await db.query(
            `
            SELECT id
            FROM hot_sale_images
            WHERE hot_sale_id = ?
            ORDER BY id ASC
            `,
            [id]
        );

        const hotSale = {
            ...rows[0],
            overview: parseJSONSafe(rows[0].overview),
            highlights: parseJSONSafe(rows[0].highlights),
            main_image: `/api/hotsales/main-image/${id}`,
            main_video: `/api/hotsales/main-video/${id}`,
            images: images.map((img) => `/api/hotsales/image/${img.id}`)
        };

        return res.status(200).json({
            success: true,
            hotSale
        });
    } catch (error) {
        console.error("GET HOT SALE BY ID ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

// =====================================================
// MAIN IMAGE API
// =====================================================

export const getMainImage = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT main_image FROM hot_sales WHERE id = ?`,
            [id]
        );

        if (rows.length === 0 || !rows[0].main_image) {
            return res.sendStatus(404);
        }

        res.set("Content-Type", "image/jpeg");
        return res.send(rows[0].main_image);
    } catch (error) {
        console.error("GET HOT SALE MAIN IMAGE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

// =====================================================
// GALLERY IMAGE API
// =====================================================

export const getHotSaleImage = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT image FROM hot_sale_images WHERE id = ?`,
            [id]
        );

        if (rows.length === 0 || !rows[0].image) {
            return res.sendStatus(404);
        }

        res.set("Content-Type", "image/jpeg");
        return res.send(rows[0].image);
    } catch (error) {
        console.error("GET HOT SALE IMAGE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

// =====================================================
// MAIN VIDEO API
// =====================================================

export const getMainVideo = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT main_video FROM hot_sales WHERE id = ?`,
            [id]
        );

        if (rows.length === 0 || !rows[0].main_video) {
            return res.sendStatus(404);
        }

        res.set("Content-Type", "video/mp4");
        return res.send(rows[0].main_video);
    } catch (error) {
        console.error("GET HOT SALE MAIN VIDEO ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

// =====================================================
// UPDATE HOT SALE
// =====================================================

export const editHotSale = async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const [existing] = await connection.query(
            `SELECT * FROM hot_sales WHERE id = ?`,
            [id]
        );

        if (existing.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: "Hot sale not found"
            });
        }

        const current = existing[0];
        const {
            title,
            description,
            price,
            property_type,
            overview,
            highlights,
            area_sqft,
            district,
            city,
            address,
            map_address,
            duration,
            rate,
            status
        } = req.body;

        const mainImage = req.files?.main_image?.[0]?.buffer ?? current.main_image;
        const mainVideo = req.files?.main_video?.[0]?.buffer ?? current.main_video;

        await connection.query(
            `
            UPDATE hot_sales
            SET
                title = ?,
                description = ?,
                price = ?,
                property_type = ?,
                overview = ?,
                highlights = ?,
                area_sqft = ?,
                district = ?,
                city = ?,
                address = ?,
                map_address = ?,
                duration = ?,
                rate = ?,
                status = ?,
                main_image = ?,
                main_video = ?
            WHERE id = ?
            `,
            [
                title ?? current.title,
                description ?? current.description,
                price ?? current.price,
                property_type ?? current.property_type,
                overview !== undefined ? JSON.stringify(parseJSONSafe(overview)) : current.overview,
                highlights !== undefined ? JSON.stringify(parseJSONSafe(highlights)) : current.highlights,
                area_sqft ?? current.area_sqft,
                district ?? current.district,
                city ?? current.city,
                address ?? current.address,
                map_address ?? current.map_address,
                duration ?? current.duration,
                rate ?? current.rate,
                status ?? current.status,
                mainImage,
                mainVideo,
                id
            ]
        );

        if (req.files?.images?.length) {
            await connection.query(
                `DELETE FROM hot_sale_images WHERE hot_sale_id = ?`,
                [id]
            );

            for (const image of req.files.images) {
                await connection.query(
                    `INSERT INTO hot_sale_images (hot_sale_id, image) VALUES (?, ?)`,
                    [id, image.buffer]
                );
            }
        }

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Hot sale updated successfully"
        });
    } catch (error) {
        await connection.rollback();
        console.error("EDIT HOT SALE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    } finally {
        connection.release();
    }
};

// =====================================================
// DELETE HOT SALE
// =====================================================

export const deleteHotSale = async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const [existing] = await connection.query(
            `SELECT id FROM hot_sales WHERE id = ?`,
            [id]
        );

        if (existing.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: "Hot sale not found"
            });
        }

        await connection.query(
            `DELETE FROM hot_sale_images WHERE hot_sale_id = ?`,
            [id]
        );

        await connection.query(
            `DELETE FROM hot_sales WHERE id = ?`,
            [id]
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Hot sale deleted successfully"
        });
    } catch (error) {
        await connection.rollback();
        console.error("DELETE HOT SALE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    } finally {
        connection.release();
    }
};
