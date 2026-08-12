import db from "../../configuration/db.js";

// ======================================================
// ADD STAY TO RENT
// ======================================================

export const addStayToRent = async (req, res) => {
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
            duration,
            property_type,
            highlights,
            rate,
            area_sqft,
            city,
            map_address,
            location,
            price_period,
            status
        } = req.body;

        // ==================================================
        // VALIDATION
        // ==================================================

        const normalizedClientId =
            client_id && String(client_id).trim() !== ""
                ? Number(client_id)
                : null;

        if (
            !normalizedClientId ||
            !title ||
            price === undefined ||
            price === null ||
            price === "" ||
            !property_type ||
            !city
        ) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message:
                    "Client ID, title, price, property type and city are required."
            });
        }

        // ==================================================
        // MAIN IMAGE
        // ==================================================

        if (
            !req.files?.main_image ||
            req.files.main_image.length === 0
        ) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Main image is required."
            });
        }

        const mainImage = req.files.main_image[0];

        // ==================================================
        // MAIN VIDEO
        // ==================================================

        let mainVideo = null;

        if (
            req.files?.main_video &&
            req.files.main_video.length > 0
        ) {
            mainVideo = req.files.main_video[0];
        }

        // ==================================================
        // GALLERY
        // ==================================================

        const galleryImages = req.files?.images || [];

        // ==================================================
        // PARSE JSON
        // ==================================================

        let overviewData = [];
        let highlightsData = [];

        try {
            if (overview) {
                overviewData =
                    typeof overview === "string"
                        ? JSON.parse(overview)
                        : overview;
            }

            if (highlights) {
                highlightsData =
                    typeof highlights === "string"
                        ? JSON.parse(highlights)
                        : highlights;
            }
        } catch (jsonError) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message:
                    "Invalid overview or highlights JSON."
            });
        }

        // ==================================================
        // INSERT STAY TO RENT
        // ==================================================

        const propertySql = `
            INSERT INTO stays_to_rent
            (
                client_id,
                title,
                description,
                price,
                overview,
                duration,
                property_type,
                highlights,
                rate,
                area_sqft,
                city,
                map_address,
                location,
                main_image,
                
                main_video,
                
                price_period,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [propertyResult] =
            await connection.query(
                propertySql,
                [
                    normalizedClientId,
                    title,
                    description || null,
                    price,

                    JSON.stringify(
                        overviewData
                    ),

                    duration || "month",

                    property_type,

                    JSON.stringify(
                        highlightsData
                    ),

                    rate || 0,

                    area_sqft || null,

                    city,

                    map_address || null,

                    location || null,

                    // Main image
                    mainImage.buffer,
                    

                    // Main video
                    mainVideo
                        ? mainVideo.buffer
                        : null,

                    
                    price_period || "monthly",

                    status || "pending"
                ]
            );

        const stayToRentId =
            propertyResult.insertId;

        // ==================================================
        // INSERT GALLERY IMAGES
        // ==================================================

        if (galleryImages.length > 0) {
            const gallerySql = `
                INSERT INTO stay_to_rent_images
                (
                    stay_to_rent_id,
                    image
                    
                )
                VALUES ?
            `;

            const galleryValues =
                galleryImages.map((file) => [
                    stayToRentId,
                    file.buffer
                    
                ]);

            await connection.query(
                gallerySql,
                [galleryValues]
            );
        }

        // ==================================================
        // COMMIT
        // ==================================================

        await connection.commit();

        return res.status(201).json({
            success: true,
            message:
                "Stay To Rent added successfully.",
            id: stayToRentId
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.error(
            "ADD STAY TO RENT ERROR:",
            error
        );

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
// GET ALL STAY TO RENT
// ======================================================

export const getStayToRent = async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT
                s.id,
                s.client_id,
                s.title,
                s.description,
                s.price,
                s.overview,
                s.duration,
                s.property_type,
                s.highlights,
                s.rate,
                s.area_sqft,
                s.city,
                s.map_address,
                s.location,
                
                s.price_period,
                s.status,

                c.full_name,
                c.email,
                c.phone_number

            FROM stays_to_rent s

            INNER JOIN clients c
                ON s.client_id = c.id

            ORDER BY s.id DESC
        `);

        const data = rows.map((property) => ({

            ...property,

            main_image:
                `/api/stays-to-rent/image/${property.id}`,

            main_video:
                property.main_video
                    ? `/api/stays-to-rent/video/${property.id}`
                    : null,

            gallery:
                `/api/stays-to-rent/gallery/${property.id}`
        }));

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        console.error(
            "GET STAY TO RENT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// ALIAS
// ======================================================

export const getAllStayToRent =
    getStayToRent;


// ======================================================
// GET SINGLE STAY TO RENT
// ======================================================

export const getStayToRentById = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id || Number.isNaN(Number(id))) {

            return res.status(400).json({
                success: false,
                message: "Invalid property ID."
            });
        }

        // ==================================================
        // GET PROPERTY
        // ==================================================

        const [rows] = await db.query(
            `
            SELECT
                id,
                client_id,
                title,
                description,
                price,
                overview,
                duration,
                property_type,
                highlights,
                rate,
                area_sqft,
                city,
                map_address,
                location,
                
                price_period,
                status,
                CASE
    WHEN main_video IS NOT NULL THEN 1
    ELSE 0
END AS has_video

            FROM stays_to_rent

            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Stay To Rent not found."
            });
        }

        const property = rows[0];

        // ==================================================
        // GET GALLERY
        // ==================================================

        const [galleryRows] =
            await db.query(
                `
                SELECT
                    id,
                    stay_to_rent_id
                    

                FROM stay_to_rent_images

                WHERE stay_to_rent_id = ?

                ORDER BY id ASC
                `,
                [id]
            );

        // ==================================================
        // RESPONSE
        // ==================================================

        const gallery =
            galleryRows.map((image) => ({

                id: image.id,

                stay_to_rent_id:
                    image.stay_to_rent_id,

               

                image:
                    `/api/stays-to-rent/gallery-image/${image.id}`,

                url:
                    `/api/stays-to-rent/gallery-image/${image.id}`
            }));

        const data = {

            ...property,

            main_image:
                `/api/stays-to-rent/image/${id}`,

            main_video: rows[0].has_video
    ? `/api/stays-to-rent/video/${id}`
    : null,

            gallery,

            images: gallery
        };

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        console.error(
            "GET SINGLE STAY TO RENT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET MAIN IMAGE
// ======================================================

export const getStayToRentImage = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                main_image
            

            FROM stays_to_rent

            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }

        if (!rows[0].main_image) {

            return res.status(404).json({
                success: false,
                message:
                    "Main image not found."
            });
        }

        res.setHeader("Content-Type", "image/jpeg");

        return res.send(
            rows[0].main_image
        );

    } catch (error) {

        console.error(
            "GET STAY TO RENT IMAGE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET MAIN VIDEO
// ======================================================

export const getStayToRentVideo = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                main_video
                

            FROM stays_to_rent

            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }

        if (!rows[0].main_video) {

            return res.status(404).json({
                success: false,
                message: "Video not found."
            });
        }

        res.setHeader("Content-Type", "video/mp4"

        );

        return res.send(
            rows[0].main_video
        );

    } catch (error) {

        console.error(
            "GET STAY TO RENT VIDEO ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET STAY TO RENT GALLERY
// ======================================================

export const getStayToRentGallery = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                id,
                stay_to_rent_id
                

            FROM stay_to_rent_images

            WHERE stay_to_rent_id = ?

            ORDER BY id ASC
            `,
            [id]
        );

        const gallery =
            rows.map((image) => ({

                id: image.id,

                stay_to_rent_id:
                    image.stay_to_rent_id,

               

                image:
                    `/api/stays-to-rent/gallery-image/${image.id}`,

                url:
                    `/api/stays-to-rent/gallery-image/${image.id}`
            }));

        return res.status(200).json({
            success: true,
            data: gallery
        });

    } catch (error) {

        console.error(
            "GET STAY TO RENT GALLERY ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET SINGLE GALLERY IMAGE
// ======================================================

export const getStayToRentGalleryImage = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                image
                

            FROM stay_to_rent_images

            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Gallery image not found."
            });
        }

        if (!rows[0].image) {

            return res.status(404).json({
                success: false,
                message:
                    "Gallery image is empty."
            });
        }

        res.setHeader(
           "Content-Type", "image/jpeg"
        );

        return res.send(
            rows[0].image
        );

    } catch (error) {

        console.error(
            "GET STAY TO RENT GALLERY IMAGE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// UPDATE STAY TO RENT
// ======================================================

export const updateStayToRent = async (
    req,
    res
) => {

    let connection;

    try {

        const { id } = req.params;

        connection = await db.getConnection();

        await connection.beginTransaction();

        // ==================================================
        // CHECK PROPERTY
        // ==================================================

        const [existing] =
            await connection.query(
                `
                SELECT id
                FROM stays_to_rent
                WHERE id = ?
                `,
                [id]
            );

        if (existing.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message:
                    "Stay To Rent not found."
            });
        }

        // ==================================================
        // REQUEST DATA
        // ==================================================

        const {
            client_id,
            title,
            description,
            price,
            overview,
            duration,
            property_type,
            highlights,
            rate,
            area_sqft,
            city,
            map_address,
            location,
            price_period,
            status,
            keep_gallery
        } = req.body;

        // ==================================================
        // VALIDATION
        // ==================================================

        if (
            !title ||
            price === undefined ||
            price === null ||
            price === "" ||
            !property_type ||
            !city
        ) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message:
                    "Title, price, property type and city are required."
            });
        }

        // ==================================================
        // PARSE JSON
        // ==================================================

        let overviewData = [];
        let highlightsData = [];

        try {

            if (overview) {

                overviewData =
                    typeof overview === "string"
                        ? JSON.parse(overview)
                        : overview;
            }

            if (highlights) {

                highlightsData =
                    typeof highlights === "string"
                        ? JSON.parse(highlights)
                        : highlights;
            }

        } catch (error) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message:
                    "Invalid overview or highlights JSON."
            });
        }

        // ==================================================
        // UPDATE BASIC DATA
        // ==================================================

        await connection.query(
            `
            UPDATE stays_to_rent

            SET
                ${client_id ? "client_id = ?," : ""}
                title = ?,
                description = ?,
                price = ?,
                overview = ?,
                duration = ?,
                property_type = ?,
                highlights = ?,
                rate = ?,
                area_sqft = ?,
                city = ?,
                map_address = ?,
                location = ?,
                price_period = ?,
                status = ?

            WHERE id = ?
            `,
            [
                ...(client_id ? [client_id] : []),

                title,
                description || null,
                price,

                JSON.stringify(
                    overviewData
                ),

                duration || "month",

                property_type,

                JSON.stringify(
                    highlightsData
                ),

                rate || 0,

                area_sqft || null,

                city,

                map_address || null,

                location || null,

                price_period || "monthly",

                status || "pending",

                id
            ]
        );

        // ==================================================
        // UPDATE MAIN IMAGE
        // ==================================================

        if (
            req.files?.main_image &&
            req.files.main_image.length > 0
        ) {

            const file =
                req.files.main_image[0];

            await connection.query(
                `
                UPDATE stays_to_rent

                SET
                    main_image = ?
                    

                WHERE id = ?
                `,
                [
                    file.buffer,
                    
                    id
                ]
            );
        }

        // ==================================================
        // UPDATE MAIN VIDEO
        // ==================================================

        if (
            req.files?.main_video &&
            req.files.main_video.length > 0
        ) {

            const file =
                req.files.main_video[0];

            await connection.query(
                `
                UPDATE stays_to_rent

                SET
                    main_video = ?
                    

                WHERE id = ?
                `,
                [
                    file.buffer,
                    
                    id
                ]
            );
        }

        // ==================================================
        // KEEP EXISTING GALLERY
        // ==================================================

        let keepGalleryIds = [];

        if (keep_gallery) {

            try {

                keepGalleryIds =
                    typeof keep_gallery === "string"
                        ? JSON.parse(keep_gallery)
                        : keep_gallery;

                if (!Array.isArray(keepGalleryIds)) {
                    keepGalleryIds = [];
                }

            } catch (error) {

                keepGalleryIds = [];
            }
        }

        // Convert to valid numbers

        keepGalleryIds =
            keepGalleryIds
                .map(Number)
                .filter(
                    (imageId) =>
                        Number.isInteger(imageId) &&
                        imageId > 0
                );

      

        // ==================================================
        // ADD NEW GALLERY
        // ==================================================

        if (
            req.files?.images &&
            req.files.images.length > 0
        ) {

            for (
                const file
                of req.files.images
            ) {

                await connection.query(
                    `
                    INSERT INTO stay_to_rent_images
                    (
                        stay_to_rent_id,
                        image
                        
                    )
                    VALUES (?, ?)
                    `,
                    [
                        id,
                        file.buffer
                        
                    ]
                );
            }
        }

        // ==================================================
        // COMMIT
        // ==================================================

        await connection.commit();

        return res.status(200).json({
            success: true,
            message:
                "Stay To Rent updated successfully."
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.error(
            "UPDATE STAY TO RENT ERROR:",
            error
        );

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
// DELETE STAY TO RENT
// ======================================================

export const deleteStayToRent = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const [result] =
            await db.query(
                `
                DELETE FROM stays_to_rent
                WHERE id = ?
                `,
                [id]
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Stay To Rent not found."
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Stay To Rent deleted successfully."
        });

    } catch (error) {

        console.error(
            "DELETE STAY TO RENT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};