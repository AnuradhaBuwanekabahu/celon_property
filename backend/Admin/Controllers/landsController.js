import db from "../../configuration/db.js";

// ======================================================
// ADD LAND
// ======================================================

export const addLands = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        await connection.beginTransaction();

        const {
            client_id,
            title,
            description,
            price,
            overview,
            rate,
            land_size,
            size_unit,
            location,
            city,
            status,
            duration
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        const normalizedClientId =
            client_id && String(client_id).trim() !== ""
                ? Number(client_id)
                : null;

        if (!normalizedClientId || Number.isNaN(normalizedClientId)) {

            await connection.rollback();

            return res.status(401).json({
                success: false,
                message: "Please log in before adding a property."
            });

        }

        if (
            !title ||
            !price ||
            !land_size ||
            !city
        ) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });
        }


        // ==========================================
        // MAIN IMAGE
        // ==========================================

        if (
            !req.files ||
            !req.files.main_image ||
            req.files.main_image.length === 0
        ) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Main image is required"
            });
        }


        const mainImageFile = req.files.main_image[0];

        const mainImage = mainImageFile.buffer;
       


        // ==========================================
        // MAIN VIDEO
        // ==========================================

        let mainVideo = null;
        

        if (
            req.files.main_video &&
            req.files.main_video.length > 0
        ) {
            mainVideo = req.files.main_video[0].buffer;
           
        }


        // ==========================================
        // JSON DATA
        // ==========================================

        let overviewData = [];

        if (overview) {
            try {
                overviewData =
                    typeof overview === "string"
                        ? JSON.parse(overview)
                        : overview;
            } catch (error) {
                await connection.rollback();

                return res.status(400).json({
                    success: false,
                    message: "Invalid overview JSON"
                });
            }
        }


        // ==========================================
        // INSERT LAND
        // ==========================================

        const [result] = await connection.query(
            `
            INSERT INTO land
            (
                client_id,
                title,
                description,
                price,
                overview,
                rate,
                land_size,
                main_video,
            
                duration,
                size_unit,
                location,
                city,
                main_image,
            
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                normalizedClientId,
                title,
                description || null,
                price,
                JSON.stringify(overviewData),
                rate === undefined || rate === ""
                  ? 0.00
                  : Number(rate),
                land_size,
                mainVideo,
                
                duration || "month",
                size_unit || "perches",
                location || null,
                city,
                mainImage,
                
                status || "pending"
            ]
        );


        const landId = result.insertId;


        // ==========================================
        // GALLERY IMAGES
        // ==========================================

        if (
            req.files.images &&
            req.files.images.length > 0
        ) {

            for (const image of req.files.images) {

                await connection.query(
                    `
                    INSERT INTO land_images
                    (
                        land_id,
                        image
                        
                    )
                    VALUES (?, ?)
                    `,
                    [
                        landId,
                        image.buffer
                        
                    ]
                );

            }

        }


        // ==========================================
        // COMMIT
        // ==========================================

        await connection.commit();


        return res.status(201).json({
            success: true,
            message: "Land added successfully",
            id: landId
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.error("ADD LAND ERROR:", error);

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


// ======================================================
// GET ALL LANDS
// ======================================================

export const getLands = async (req, res) => {

    try {

        const [lands] = await db.query(
            `
          SELECT
    id,
    client_id,
    title,
    description,
    price,
    overview,
    rate,
    land_size,
    duration,
    size_unit,
    location,
    city,
    status,
    created_at,
    updated_at,
    CASE
        WHEN main_video IS NOT NULL THEN 1
        ELSE 0
    END AS has_video
FROM land
ORDER BY created_at DESC
            `
        );


        const withUrls = lands.map(land => ({
    ...land,

    main_image: `/api/lands/image/${land.id}`,

    main_video: land.has_video
        ? `/api/lands/video/${land.id}`
        : null
}));

        return res.status(200).json({
            success: true,
            data: withUrls
        });

    } catch (error) {

        console.error("GET LANDS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ======================================================
// GET SINGLE LAND
// ======================================================

export const getLandById = async (req, res) => {

    try {

        const { id } = req.params;


        const [lands] = await db.query(
            `
            SELECT
                id,
                client_id,
                title,
                description,
                price,
                overview,
                rate,
                land_size,
                duration,
                size_unit,
                location,
                city,
                
                
                status,
                created_at,
                updated_at,
                CASE
    WHEN main_video IS NOT NULL THEN 1
    ELSE 0
END AS has_video
            FROM land
            WHERE id = ?
            `,
            [id]
        );


        if (lands.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Land not found"
            });

        }


        // ==========================================
        // GET GALLERY
        // ==========================================

        const [gallery] = await db.query(
            `
            SELECT
                id,
                
                created_at
            FROM land_images
            WHERE land_id = ?
            ORDER BY id ASC
            `,
            [id]
        );


        const land = lands[0];

        land.main_image = `/api/lands/image/${id}`;

          land.main_video = land.has_video
            ? `/api/lands/video/${id}`
            : null;

        land.gallery = gallery.map(img => ({
            id: img.id,
            url: `/api/lands/gallery-image/${img.id}`,
            
            created_at: img.created_at
        }));


        return res.status(200).json({
            success: true,
            data: land
        });

    } catch (error) {

        console.error("GET LAND ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ======================================================
// GET MAIN IMAGE
// ======================================================

export const getLandMainImage = async (req, res) => {

    try {

        const { id } = req.params;


        const [rows] = await db.query(
            `
            SELECT
                main_image
                
            FROM land
            WHERE id = ?
            `,
            [id]
        );


        if (
            rows.length === 0 ||
            !rows[0].main_image
        ) {

            return res.status(404).json({
                success: false,
                message: "Main image not found"
            });

        }


       res.setHeader("Content-Type", "image/jpeg");

        res.send(rows[0].main_image);

    } catch (error) {

        console.error("MAIN IMAGE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ======================================================
// GET GALLERY IMAGE
// ======================================================

export const getLandGalleryImage = async (req, res) => {

    try {

        const { id } = req.params;


        const [rows] = await db.query(
            `
            SELECT
                image
                
            FROM land_images
            WHERE id = ?
            `,
            [id]
        );


        if (
            rows.length === 0 ||
            !rows[0].image
        ) {

            return res.status(404).json({
                success: false,
                message: "Gallery image not found"
            });

        }


       res.setHeader("Content-Type", "image/jpeg");

        res.send(rows[0].image);

    } catch (error) {

        console.error("GALLERY IMAGE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ======================================================
// GET MAIN VIDEO
// ======================================================

export const getLandMainVideo = async (req, res) => {

    try {

        const { id } = req.params;


        const [rows] = await db.query(
            `
            SELECT
                main_video
                
            FROM land
            WHERE id = ?
            `,
            [id]
        );


        if (
            rows.length === 0 ||
            !rows[0].main_video
        ) {

            return res.status(404).json({
                success: false,
                message: "Main video not found"
            });

        }


        res.setHeader("Content-Type", "video/mp4");

        res.send(rows[0].main_video);

    } catch (error) {

        console.error("MAIN VIDEO ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ======================================================
// UPDATE LAND
// ======================================================

export const updateLand = async (req, res) => {

    let connection;

    try {

        connection = await db.getConnection();

        await connection.beginTransaction();


        const { id } = req.params;


        const {
            title,
            description,
            price,
            overview,
            rate,
            land_size,
            size_unit,
            location,
            city,
            status,
            duration
        } = req.body;


        // ==========================================
        // CHECK LAND
        // ==========================================

        const [existing] = await connection.query(
            `
            SELECT id
            FROM land
            WHERE id = ?
            `,
            [id]
        );


        if (existing.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Land not found"
            });

        }


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !title ||
            !price ||
            !land_size ||
            !city
        ) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });

        }


        // ==========================================
        // PARSE OVERVIEW
        // ==========================================

        let overviewData = [];

        if (overview) {

            try {

                overviewData =
                    typeof overview === "string"
                        ? JSON.parse(overview)
                        : overview;

            } catch (error) {

                await connection.rollback();

                return res.status(400).json({
                    success: false,
                    message: "Invalid overview JSON"
                });

            }

        }


        // ==========================================
        // MAIN IMAGE
        // ==========================================

        let mainImage = null;
        

        if (
            req.files?.main_image &&
            req.files.main_image.length > 0
        ) {

            mainImage =
                req.files.main_image[0].buffer;

          

        }


        // ==========================================
        // MAIN VIDEO
        // ==========================================

        let mainVideo = null;
        

        if (
            req.files?.main_video &&
            req.files.main_video.length > 0
        ) {

            mainVideo =
                req.files.main_video[0].buffer;

           

        }


        // ==========================================
        // UPDATE LAND
        // ==========================================

        await connection.query(
            `
            UPDATE land
            SET
                title = ?,
                description = ?,
                price = ?,
                overview = ?,
                rate = ?,
                land_size = ?,
                size_unit = ?,
                location = ?,
                city = ?,
                status = ?,
                duration = ?,

                main_image =
                    COALESCE(?, main_image),

                

                main_video =
                    COALESCE(?, main_video)

                

            WHERE id = ?
            `,
            [
                title,
                description || null,
                price,
                JSON.stringify(overviewData),
                rate === undefined || rate === ""
                 ? 0.00
                 : Number(rate),
                land_size,
                size_unit || "perches",
                location || null,
                city,
                status || "pending",
                duration || "month",

                mainImage,
                

                mainVideo,
                

                id
            ]
        );


        // ==========================================
        // REPLACE GALLERY
        // Only replace when new images uploaded
        // ==========================================

        if (
            req.files?.images &&
            req.files.images.length > 0
        ) {

            await connection.query(
                `
                DELETE FROM land_images
                WHERE land_id = ?
                `,
                [id]
            );


            for (const image of req.files.images) {

                await connection.query(
                    `
                    INSERT INTO land_images
                    (
                        land_id,
                        image
                        
                    )
                    VALUES (?, ?)
                    `,
                    [
                        id,
                        image.buffer
                        
                    ]
                );

            }

        }


        // ==========================================
        // COMMIT
        // ==========================================

        await connection.commit();


        return res.status(200).json({
            success: true,
            message: "Land updated successfully"
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.error("UPDATE LAND ERROR:", error);

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


// ======================================================
// DELETE LAND
// ======================================================

export const deleteLand = async (req, res) => {

    try {

        const { id } = req.params;


        const [result] = await db.query(
            `
            DELETE FROM land
            WHERE id = ?
            `,
            [id]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Land not found"
            });

        }


        return res.status(200).json({
            success: true,
            message: "Land deleted successfully"
        });

    } catch (error) {

        console.error("DELETE LAND ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};