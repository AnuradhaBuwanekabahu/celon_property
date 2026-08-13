
import db from "../../configuration/db.js";

// =======================================================
// ADD AD
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

        // -----------------------------------------
        // Validation
        // -----------------------------------------

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

        // -----------------------------------------
        // Get image
        // -----------------------------------------

        const imageFile =
            req.file ||
            req.files?.image?.[0];

        if (!imageFile) {

            return res.status(400).json({
                success: false,
                message: "Advertisement image is required"
            });

        }

        // -----------------------------------------
        // Database connection
        // -----------------------------------------

        connection = await db.getConnection();

        await connection.beginTransaction();

        // -----------------------------------------
        // Insert advertisement
        // -----------------------------------------

        const [result] = await connection.query(
            `
            INSERT INTO ads
            (
                client_id,
                title,
                image
                
                link_url,
                position,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                Number(client_id),
                title.trim(),
                imageFile.buffer,
                
                link_url || null,
                position || 0,
                is_active === undefined
                    ? 1
                    : Number(is_active)
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

            message: error.message

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
            ORDER BY position ASC, created_at DESC
            `
        );

        const data = ads.map((ad) => {

            return {

                ...ad,

                image:
                    `/api/ads/image/${ad.id}`

            };

        });

        return res.status(200).json({

            success: true,

            message: "Advertisements fetched successfully",

            ads: data

        });

    } catch (error) {

        console.error("GET ADS ERROR:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


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
                message: "Advertisement not found"
            });

        }

        const ad = {
            ...ads[0],
            image: `/api/ads/image/${id}`
        };

        return res.status(200).json({
            message: "Advertisement fetched successfully",
            ad
        });

    } catch (error) {

        console.error("GET SINGLE AD ERROR:", error);

        return res.status(500).json({
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
            SELECT
                image
                
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

            message: error.message

        });

    }

};




// =======================================================
// UPDATE ADVERTISEMENT
// =======================================================

export const updateAd = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const { id } = req.params;

        const {
            client_id,
            title,
            link_url,
            position,
            is_active
        } = req.body;


        // =======================================================
        // CHECK ADVERTISEMENT EXISTS
        // =======================================================

        const [existing] = await connection.query(
            `SELECT id FROM ads WHERE id = ?`,
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

        if (!client_id || !title?.trim()) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Client and title are required"
            });

        }


        // =======================================================
        // GET IMAGE
        // =======================================================

        const imageFile =
            req.files?.image?.[0] ||
            req.file;


        // =======================================================
        // UPDATE WITH NEW IMAGE
        // =======================================================

        if (imageFile) {

            const sql = `
                UPDATE ads
                SET
                    client_id = ?,
                    title = ?,
                    image = ?,
                    
                    link_url = ?,
                    position = ?,
                    is_active = ?
                WHERE id = ?
            `;

            const values = [

                Number(client_id),

                title.trim(),

                imageFile.buffer,

                

                link_url || null,

                position === undefined || position === ""
                    ? 0
                    : Number(position),

                is_active === undefined
                    ? 1
                    : Number(is_active),

                id
            ];


            await connection.query(sql, values);

        }


        // =======================================================
        // UPDATE WITHOUT NEW IMAGE
        // =======================================================

        else {

            const sql = `
                UPDATE ads
                SET
                    client_id = ?,
                    title = ?,
                    link_url = ?,
                    position = ?,
                    is_active = ?
                WHERE id = ?
            `;

            const values = [

                Number(client_id),

                title.trim(),

                link_url || null,

                position === undefined || position === ""
                    ? 0
                    : Number(position),

                is_active === undefined
                    ? 1
                    : Number(is_active),

                id
            ];


            await connection.query(sql, values);

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

        await connection.rollback();

        console.error("UPDATE AD ERROR:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    } finally {

        connection.release();

    }

};









// =======================================================
// DELETE AD
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

            message: error.message

        });

    }

};

