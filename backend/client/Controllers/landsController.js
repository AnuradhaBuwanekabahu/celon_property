import db from "../../configuration/db.js";

const getImageContentType = (buffer) => {
    if (!buffer || buffer.length === 0) return "application/octet-stream";

    const header = buffer.toString("hex", 0, 8).toLowerCase();

    if (header.startsWith("ffd8ff")) return "image/jpeg";
    if (header.startsWith("89504e47")) return "image/png";
    if (header.startsWith("47494638")) return "image/gif";
    if (header.startsWith("52494646")) return "image/webp";

    return "application/octet-stream";
};

// ==========================
// Add Land
// ==========================

export const addLands = async (req, res) => {

    // Validate required file before opening a connection
    if (!req.files || !req.files.main_image) {
        return res.status(400).json({
            message: "Main image is required"
        });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const clientId = req.body.client_id ?? req.client?.id ?? req.client?.client_id ?? null;

        if (!clientId) {
            return res.status(400).json({
                message: "Client ID is required"
            });
        }

        const {
            title,
            description,
            price,
            land_size,
            size_unit,
            location,
            city,
            status,
            duration,
            overview
        } = req.body;

        const mainImageBuffer = req.files.main_image[0].buffer;

        let mainVideoBuffer = null;
        if (req.files?.main_video?.length > 0) {
            mainVideoBuffer = req.files.main_video[0].buffer;
        }

        const [result] = await connection.query(
            `INSERT INTO land (
                client_id,
                title,
                description,
                price,
                overview,
                land_size,
                size_unit,
                location,
                city,
                status,
                duration,
                main_image,
                main_video
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                clientId,
                title,
                description || null,
                price,
                overview || null,
                land_size,
                size_unit,
                location,
                city,
                status || 'pending',
                duration || 'month',
                mainImageBuffer,
                mainVideoBuffer
            ]
        );

        const landsID = result.insertId;

        // Insert multiple images
        if (req.files.images) {
            for (const image of req.files.images) {
                await connection.query(
                    `INSERT INTO land_images (land_id, image) VALUES (?,?)`,
                    [landsID, image.buffer]
                );
            }
        }

        await connection.commit();

        res.status(201).json({
            message: "Land added successfully",
            id: landsID
        });

    } catch (error) {
        await connection.rollback();
        console.log(error);

        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    } finally {
        connection.release();
    }
};


// ==========================
// Get All Lands
// ==========================

export const showAllLands = async (req, res) => {
    try {
        const [lands] = await db.query(
            `SELECT
                id,
                client_id,
                title,
                description,
                price,
                overview,
                land_size,
                size_unit,
                location,
                city,
                status,
                duration,
                created_at,
                updated_at
            FROM land
            ORDER BY created_at DESC`
        );

        const lands_with_image = await Promise.all(
            lands.map(async (land) => {
                const [images] = await db.query(
                    `SELECT id FROM land_images WHERE land_id = ?`,
                    [land.id]
                );

                return {
                    ...land,
                    main_image: `/api/lands/main-image/${land.id}`,
                    main_video: `/api/lands/main-video/${land.id}`,
                    images: images.map(img => `/api/lands/image/${img.id}`)
                };
            })
        );

        res.status(200).json({
            message: "Lands fetched successfully",
            lands: lands_with_image
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getAllLands = async (req, res) => {
    return showAllLands(req, res);
};


// ==========================
// Get Single Land By Id
// ==========================

export const getLandById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT
                id,
                client_id,
                title,
                description,
                price,
                overview,
                land_size,
                size_unit,
                location,
                city,
                status,
                duration,
                created_at,
                updated_at
            FROM land
            WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Land not found"
            });
        }

        const land = rows[0];

        const [images] = await db.query(
            `SELECT id FROM land_images WHERE land_id = ?`,
            [id]
        );

        res.status(200).json({
            message: "Land fetched successfully",
            land: {
                ...land,
                main_image: `/api/lands/main-image/${land.id}`,
                main_video: `/api/lands/main-video/${land.id}`,
                images: images.map(img => `/api/lands/image/${img.id}`)
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getLandMainImage = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(`SELECT main_image FROM land WHERE id = ?`, [id]);

        if (rows.length === 0 || !rows[0].main_image) {
            return res.status(404).send("Not found");
        }

        res.set("Content-Type", getImageContentType(rows[0].main_image));
        res.send(rows[0].main_image);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getLandMainVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(`SELECT main_video FROM land WHERE id = ?`, [id]);

        if (rows.length === 0 || !rows[0].main_video) {
            return res.status(404).send("Not found");
        }

        res.set("Content-Type", "video/mp4");
        res.send(rows[0].main_video);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getLandImage = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(`SELECT image FROM land_images WHERE id = ?`, [id]);

        if (rows.length === 0 || !rows[0].image) {
            return res.status(404).send("Not found");
        }

        res.set("Content-Type", getImageContentType(rows[0].image));
        res.send(rows[0].image);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// ==========================
// Update Land
// ==========================

export const updateLand = async (req, res) => {

    const connection = await db.getConnection();

    try {
        const { id } = req.params;

        const [existingRows] = await connection.query(
            `SELECT id FROM land WHERE id = ?`,
            [id]
        );

        if (existingRows.length === 0) {
            connection.release();
            return res.status(404).json({
                message: "Land not found"
            });
        }

        await connection.beginTransaction();

        const {
            title,
            description,
            price,
            land_size,
            size_unit,
            location,
            city,
            status,
            duration,
            overview,
            remove_image_ids
        } = req.body;

        // Build dynamic update fields
        const fields = [];
        const values = [];

        const pushField = (column, value) => {
            fields.push(`${column} = ?`);
            values.push(value);
        };

        if (title !== undefined) pushField("title", title);
        if (description !== undefined) pushField("description", description);
        if (price !== undefined) pushField("price", price);
        if (land_size !== undefined) pushField("land_size", land_size);
        if (size_unit !== undefined) pushField("size_unit", size_unit);
        if (location !== undefined) pushField("location", location);
        if (city !== undefined) pushField("city", city);
        if (status !== undefined) pushField("status", status);
        if (duration !== undefined) pushField("duration", duration);
        if (overview !== undefined) pushField("overview", overview);

        if (req.files?.main_image?.length > 0) {
            pushField("main_image", req.files.main_image[0].buffer);
        }

        if (req.files?.main_video?.length > 0) {
            pushField("main_video", req.files.main_video[0].buffer);
        }

        if (fields.length > 0) {
            values.push(id);

            await connection.query(
                `UPDATE land SET ${fields.join(", ")} WHERE id = ?`,
                values
            );
        }

        // Remove specific gallery images if requested
        if (remove_image_ids) {
            const idsToRemove = Array.isArray(remove_image_ids)
                ? remove_image_ids
                : JSON.parse(remove_image_ids);

            if (idsToRemove.length > 0) {
                await connection.query(
                    `DELETE FROM land_images WHERE id IN (?) AND land_id = ?`,
                    [idsToRemove, id]
                );
            }
        }

        // Add new gallery images
        if (req.files?.images) {
            for (const image of req.files.images) {
                await connection.query(
                    `INSERT INTO land_images (land_id, image) VALUES (?,?)`,
                    [id, image.buffer]
                );
            }
        }

        await connection.commit();

        res.status(200).json({
            message: "Land updated successfully",
            id
        });

    } catch (error) {
        await connection.rollback();
        console.log(error);

        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    } finally {
        connection.release();
    }
};


// ==========================
// Delete Land
// ==========================

export const deleteLand = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            `DELETE FROM land WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Land not found"
            });
        }

        // land_images rows are removed automatically via ON DELETE CASCADE

        res.status(200).json({
            message: "Land deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};