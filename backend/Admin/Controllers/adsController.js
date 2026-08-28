import db from "../../configuration/db.js";

// =======================================================
// ADD ADVERTISEMENT
// =======================================================

export const addAd = async (req, res) => {
    let connection;

    try {
        const {
            client_id,
            title,
            link_url,
            position,
            is_active
        } = req.body;

        // =======================================================
        // VALIDATION
        // =======================================================

        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: "Client ID is required"
            });
        }

        if (!title || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Advertisement title is required"
            });
        }

        // =======================================================
        // GET IMAGE
        // =======================================================

        const imageFile =
            req.file ||
            req.files?.image?.[0];

        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: "Advertisement image is required"
            });
        }

        // =======================================================
        // DATABASE CONNECTION
        // =======================================================

        connection = await db.getConnection();

        await connection.beginTransaction();

        // =======================================================
        // POSITION
        // =======================================================

        const adPosition =
            position && position.trim() !== ""
                ? position.trim()
                : "sub_pages";

        // =======================================================
        // ACTIVE STATUS
        // =======================================================

        const activeStatus =
            is_active === undefined ||
            is_active === null ||
            is_active === ""
                ? 1
                : Number(is_active);

        // =======================================================
        // INSERT AD
        // =======================================================

        const [result] = await connection.query(
            `
            INSERT INTO ads
            (
                client_id,
                title,
                image,
                link_url,
                position,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                Number(client_id),
                title.trim(),
                imageFile.buffer,
                link_url || null,
                adPosition,
                activeStatus
            ]
        );

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Advertisement added successfully",
            id: result.insertId
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.error("ADD AD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });

    } finally {

        if (connection) {
            connection.release();
        }
    }
};


// =======================================================
// GET ALL ADS
// =======================================================

export const getAds = async (req, res) => {

    try {

        const [ads] = await db.query(
            `
            SELECT
                id,
                client_id,
                title,
                link_url,
                position,
                is_active,
                created_at
            FROM ads
            ORDER BY
                CASE position
                    WHEN 'front_page_top' THEN 1
                    WHEN 'front_page_bottom' THEN 2
                    WHEN 'sub_pages' THEN 3
                    ELSE 4
                END,
                created_at DESC
            `
        );

        const data = ads.map((ad) => ({
            ...ad,
            image: `/api/ads/image/${ad.id}`
        }));

        return res.status(200).json({
            success: true,
            message: "Advertisements fetched successfully",
            ads: data
        });

    } catch (error) {

        console.error("GET ADS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


// =======================================================
// GET AD BY ID
// =======================================================

export const getAdById = async (req, res) => {

    try {

        const { id } = req.params;

        const [ads] = await db.query(
            `
            SELECT
                id,
                client_id,
                title,
                link_url,
                position,
                is_active,
                created_at
            FROM ads
            WHERE id = ?
            `,
            [id]
        );

        if (ads.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Advertisement not found"
            });
        }

        const ad = {
            ...ads[0],
            image: `/api/ads/image/${id}`
        };

        return res.status(200).json({
            success: true,
            message: "Advertisement fetched successfully",
            ad
        });

    } catch (error) {

        console.error("GET SINGLE AD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


// =======================================================
// GET AD IMAGE
// =======================================================

export const getAdImage = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT image
            FROM ads
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Advertisement not found"
            });
        }

        if (!rows[0].image) {

            return res.status(404).json({
                success: false,
                message: "Advertisement image not found"
            });
        }

        res.setHeader("Content-Type", "image/jpeg");

        return res.send(rows[0].image);

    } catch (error) {

        console.error("GET AD IMAGE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


// =======================================================
// UPDATE ADVERTISEMENT
// =======================================================

export const updateAd = async (req, res) => {

    let connection;

    try {

        const { id } = req.params;

        const {
            client_id,
            title,
            link_url,
            position,
            is_active
        } = req.body;

        // =======================================================
        // DATABASE CONNECTION
        // =======================================================

        connection = await db.getConnection();

        await connection.beginTransaction();

        // =======================================================
        // CHECK ADVERTISEMENT
        // =======================================================

        const [existing] = await connection.query(
            `
            SELECT id
            FROM ads
            WHERE id = ?
            `,
            [id]
        );

        if (existing.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Advertisement not found"
            });
        }

        // =======================================================
        // VALIDATION
        // =======================================================

        if (!client_id) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Client ID is required"
            });
        }

        if (!title || title.trim() === "") {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Advertisement title is required"
            });
        }

        // =======================================================
        // POSITION
        // =======================================================

        const adPosition =
            position && position.trim() !== ""
                ? position.trim()
                : "sub_pages";

        // =======================================================
        // ACTIVE STATUS
        // =======================================================

        const activeStatus =
            is_active === undefined ||
            is_active === null ||
            is_active === ""
                ? 1
                : Number(is_active);

        // =======================================================
        // GET NEW IMAGE
        // =======================================================

        const imageFile =
            req.file ||
            req.files?.image?.[0];

        // =======================================================
        // UPDATE WITH IMAGE
        // =======================================================

        if (imageFile) {

            await connection.query(
                `
                UPDATE ads
                SET
                    client_id = ?,
                    title = ?,
                    image = ?,
                    link_url = ?,
                    position = ?,
                    is_active = ?
                WHERE id = ?
                `,
                [
                    Number(client_id),
                    title.trim(),
                    imageFile.buffer,
                    link_url || null,
                    adPosition,
                    activeStatus,
                    id
                ]
            );

        }

        // =======================================================
        // UPDATE WITHOUT IMAGE
        // =======================================================

        else {

            await connection.query(
                `
                UPDATE ads
                SET
                    client_id = ?,
                    title = ?,
                    link_url = ?,
                    position = ?,
                    is_active = ?
                WHERE id = ?
                `,
                [
                    Number(client_id),
                    title.trim(),
                    link_url || null,
                    adPosition,
                    activeStatus,
                    id
                ]
            );
        }

        // =======================================================
        // COMMIT
        // =======================================================

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Advertisement updated successfully"
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.error("UPDATE AD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });

    } finally {

        if (connection) {
            connection.release();
        }
    }
};


// =======================================================
// DELETE ADVERTISEMENT
// =======================================================

export const deleteAd = async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            `
            DELETE FROM ads
            WHERE id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Advertisement not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Advertisement deleted successfully"
        });

    } catch (error) {

        console.error("DELETE AD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};