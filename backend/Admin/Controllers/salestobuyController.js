import db from "../../configuration/db.js";

// ======================================================
// ADD STAY TO BUY
// ======================================================

export const addStayToBuy = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const {
            client_id,
            title,
            description,
            overview,
            price,
            property_type,
            highlights,
            area_sqft,
            duration,
            district,
            city,
            address,
            map_address,
            rate,
            status
        } = req.body;


        // ==================================================
        // VALIDATION
        // ==================================================

        const normalizedClientId =
            client_id && String(client_id).trim() !== ""
                ? Number(client_id)
                : null;


        if (!normalizedClientId) {

            await connection.rollback();

            return res.status(401).json({
                success: false,
                message: "Please login before adding property"
            });

        }


        if (
            !title ||
            !price ||
            !property_type ||
            !district ||
            !city ||
            !address
        ) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message:
                    "Title, price, property type, district, city and address are required."
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


        const mainImage =
            req.files.main_image[0];


        // ==================================================
        // MAIN VIDEO
        // ==================================================

        let mainVideo = null;

        if (
            req.files?.main_video &&
            req.files.main_video.length > 0
        ) {

            mainVideo =
                req.files.main_video[0];

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
        // INSERT PROPERTY
        // ==================================================

        const [result] =
            await connection.query(

                `
                INSERT INTO stays_to_buy
                (
                    client_id,
                    title,
                    description,
                    overview,
                    price,
                    property_type,
                    highlights,
                    area_sqft,
                    duration,
                    district,
                    city,
                    address,
                    map_address,
                    rate,
                    main_image,
                    main_video,
                    status
                )

                VALUES
                (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?
                )
                `,

                [

                    normalizedClientId,

                    title,

                    description || null,

                    JSON.stringify(
                        overviewData
                    ),

                    price,

                    property_type,

                    JSON.stringify(
                        highlightsData
                    ),

                    area_sqft || null,

                    duration || "month",

                    district,

                    city,

                    address,

                    map_address || null,

                    rate || 0,

                    mainImage.buffer,

                    mainVideo
                        ? mainVideo.buffer
                        : null,

                    status || "pending"

                ]

            );


        const stayToBuyId =
            result.insertId;


        // ==================================================
        // GALLERY IMAGES
        // ==================================================

        if (
            req.files?.images &&
            req.files.images.length > 0
        ) {

            for (
                const image
                of req.files.images
            ) {

                await connection.query(

                    `
                    INSERT INTO stay_to_buy_images
                    (
                        stay_buy_id,
                        image
                    )

                    VALUES (?, ?)
                    `,

                    [
                        stayToBuyId,
                        image.buffer
                    ]

                );

            }

        }


        // ==================================================
        // COMMIT
        // ==================================================

        await connection.commit();


        return res.status(201).json({

            success: true,

            message:
                "Stay To Buy added successfully",

            id: stayToBuyId

        });


    } catch (error) {

        await connection.rollback();

        console.error(
            "ADD STAY TO BUY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    } finally {

        connection.release();

    }

};


// ======================================================
// GET ALL STAY TO BUY
// ======================================================

export const getStayToBuy = async (req, res) => {

    try {

        const [rows] =
            await db.query(

                `
                SELECT
                    id,
                    client_id,
                    title,
                    description,
                    overview,
                    price,
                    property_type,
                    highlights,
                    area_sqft,
                    duration,
                    district,
                    city,
                    address,
                    map_address,
                    rate,
                    status

                FROM stays_to_buy

                ORDER BY id DESC
                `

            );


        const data =
            await Promise.all(

                rows.map(
                    async (item) => {

                        const [images] =
                            await db.query(

                                `
                                SELECT id
                                FROM stay_to_buy_images
                                WHERE stay_buy_id = ?
                                ORDER BY id ASC
                                `,

                                [item.id]

                            );


                        return {

                            ...item,

                            main_image:
                                `/api/stays-to-buy/image/${item.id}`,

                            main_video:
                                `/api/stays-to-buy/video/${item.id}`,

                            images:
                                images.map(
                                    (image) =>
                                        `/api/stays-to-buy/gallery-image/${image.id}`
                                )

                        };

                    }
                )

            );


        return res.status(200).json({

            success: true,

            message:
                "Stay To Buy properties fetched",

            data

        });


    } catch (error) {

        console.error(
            "GET STAY TO BUY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// Alias
export const getAllStayToBuy =
    getStayToBuy;


// ======================================================
// GET SINGLE STAY TO BUY
// ======================================================

export const getStayToBuyById =
    async (req, res) => {

        try {

            const { id } =
                req.params;


            const [rows] =
                await db.query(

                    `
                    SELECT
                        id,
                        client_id,
                        title,
                        description,
                        overview,
                        price,
                        property_type,
                        highlights,
                        area_sqft,
                        duration,
                        district,
                        city,
                        address,
                        map_address,
                        rate,
                        status,

                        CASE
                            WHEN main_video IS NOT NULL
                            THEN 1
                            ELSE 0
                        END AS has_video

                    FROM stays_to_buy

                    WHERE id = ?
                    `,

                    [id]

                );


            if (rows.length === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Stay To Buy not found"

                });

            }


            const [images] =
                await db.query(

                    `
                    SELECT
                        id

                    FROM stay_to_buy_images

                    WHERE stay_buy_id = ?

                    ORDER BY id ASC
                    `,

                    [id]

                );


            const property = {

                ...rows[0],

                main_image:
                    `/api/stays-to-buy/image/${id}`,

                main_video:
                    rows[0].has_video
                        ? `/api/stays-to-buy/video/${id}`
                        : null,

                images:
                    images.map(
                        (image) =>
                            `/api/stays-to-buy/gallery-image/${image.id}`
                    )

            };


            return res.status(200).json({

                success: true,

                data: property

            });


        } catch (error) {

            console.error(
                "GET SINGLE STAY TO BUY ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    };


// ======================================================
// GET MAIN IMAGE
// ======================================================

export const getStayToBuyImage =
    async (req, res) => {

        try {

            const { id } =
                req.params;


            const [rows] =
                await db.query(

                    `
                    SELECT
                        main_image

                    FROM stays_to_buy

                    WHERE id = ?
                    `,

                    [id]

                );


            if (rows.length === 0) {

                return res.sendStatus(404);

            }


            if (!rows[0].main_image) {

                return res.sendStatus(404);

            }


            res.set(
                "Content-Type",
                "image/jpeg"
            );


            return res.send(
                rows[0].main_image
            );


        } catch (error) {

            console.error(
                "GET STAY TO BUY IMAGE ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    };


// ======================================================
// GET MAIN VIDEO
// ======================================================

export const getStayToBuyVideo =
    async (req, res) => {

        try {

            const { id } =
                req.params;


            const [rows] =
                await db.query(

                    `
                    SELECT
                        main_video

                    FROM stays_to_buy

                    WHERE id = ?
                    `,

                    [id]

                );


            if (rows.length === 0) {

                return res.sendStatus(404);

            }


            if (!rows[0].main_video) {

                return res.sendStatus(404);

            }


            res.set(
                "Content-Type",
                "video/mp4"
            );


            return res.send(
                rows[0].main_video
            );


        } catch (error) {

            console.error(
                "GET STAY TO BUY VIDEO ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    };


// ======================================================
// GET GALLERY
// ======================================================

export const getStayToBuyGallery =
    async (req, res) => {

        try {

            const { id } =
                req.params;


            const [rows] =
                await db.query(

                    `
                    SELECT
                        id,
                        stay_buy_id

                    FROM stay_to_buy_images

                    WHERE stay_buy_id = ?

                    ORDER BY id ASC
                    `,

                    [id]

                );


            const gallery =
                rows.map(
                    (image) => ({

                        id:
                            image.id,

                        stay_buy_id:
                            image.stay_buy_id,

                        image:
                            `/api/stays-to-buy/gallery-image/${image.id}`,

                        url:
                            `/api/stays-to-buy/gallery-image/${image.id}`

                    })

                );


            return res.status(200).json({

                success: true,

                data: gallery

            });


        } catch (error) {

            console.error(
                "GET STAY TO BUY GALLERY ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    };


// ======================================================
// GET SINGLE GALLERY IMAGE
// ======================================================

export const getStayToBuyGalleryImage =
    async (req, res) => {

        try {

            const { id } =
                req.params;


            const [rows] =
                await db.query(

                    `
                    SELECT
                        image

                    FROM stay_to_buy_images

                    WHERE id = ?
                    `,

                    [id]

                );


            if (rows.length === 0) {

                return res.sendStatus(404);

            }


            if (!rows[0].image) {

                return res.sendStatus(404);

            }


            res.set(
                "Content-Type",
                "image/jpeg"
            );


            return res.send(
                rows[0].image
            );


        } catch (error) {

            console.error(
                "GET STAY TO BUY GALLERY IMAGE ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    };


// ======================================================
// UPDATE STAY TO BUY
// ======================================================

export const updateStayToBuy =
    async (req, res) => {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();


            const { id } =
                req.params;


            // ==================================================
            // CHECK PROPERTY
            // ==================================================

            const [existing] =
                await connection.query(

                    `
                    SELECT id
                    FROM stays_to_buy
                    WHERE id = ?
                    `,

                    [id]

                );


            if (existing.length === 0) {

                await connection.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Stay To Buy not found"

                });

            }


            // ==================================================
            // REQUEST DATA
            // ==================================================

            const {

                client_id,
                title,
                description,
                overview,
                price,
                property_type,
                highlights,
                area_sqft,
                duration,
                district,
                city,
                address,
                map_address,
                rate,
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
                !district ||
                !city ||
                !address
            ) {

                await connection.rollback();

                return res.status(400).json({

                    success: false,

                    message:
                        "Title, price, property type, district, city and address are required."

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
                UPDATE stays_to_buy

                SET
                    client_id = ?,
                    title = ?,
                    description = ?,
                    overview = ?,
                    price = ?,
                    property_type = ?,
                    highlights = ?,
                    area_sqft = ?,
                    duration = ?,
                    district = ?,
                    city = ?,
                    address = ?,
                    map_address = ?,
                    rate = ?,
                    status = ?

                WHERE id = ?
                `,

                [

                    client_id || null,

                    title,

                    description || null,

                    JSON.stringify(
                        overviewData
                    ),

                    price,

                    property_type,

                    JSON.stringify(
                        highlightsData
                    ),

                    area_sqft || null,

                    duration || "month",

                    district,

                    city,

                    address,

                    map_address || null,

                    rate || 0,

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
                    UPDATE stays_to_buy

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
                    UPDATE stays_to_buy

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


                    if (
                        !Array.isArray(
                            keepGalleryIds
                        )
                    ) {

                        keepGalleryIds = [];

                    }

                } catch {

                    keepGalleryIds = [];

                }

            }


            keepGalleryIds =
                keepGalleryIds
                    .map(Number)
                    .filter(
                        (imageId) =>
                            Number.isInteger(imageId) &&
                            imageId > 0
                    );


            // ==================================================
            // DELETE GALLERY IMAGES NOT KEPT
            // ==================================================

            if (keep_gallery !== undefined) {

                if (keepGalleryIds.length > 0) {

                    await connection.query(

                        `
                        DELETE FROM stay_to_buy_images

                        WHERE stay_buy_id = ?

                        AND id NOT IN (?)
                        `,

                        [
                            id,
                            keepGalleryIds
                        ]

                    );

                } else {

                    await connection.query(

                        `
                        DELETE FROM stay_to_buy_images

                        WHERE stay_buy_id = ?
                        `,

                        [id]

                    );

                }

            }


            // ==================================================
            // ADD NEW GALLERY IMAGES
            // ==================================================

            if (
                req.files?.images &&
                req.files.images.length > 0
            ) {

                for (
                    const image
                    of req.files.images
                ) {

                    await connection.query(

                        `
                        INSERT INTO stay_to_buy_images
                        (
                            stay_buy_id,
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


            // ==================================================
            // COMMIT
            // ==================================================

            await connection.commit();


            return res.status(200).json({

                success: true,

                message:
                    "Stay To Buy updated successfully"

            });


        } catch (error) {

            await connection.rollback();

            console.error(
                "UPDATE STAY TO BUY ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    error.message

            });

        } finally {

            connection.release();

        }

    };


// ======================================================
// DELETE STAY TO BUY
// ======================================================

export const deleteStayToBuy =
    async (req, res) => {

        try {

            const { id } =
                req.params;


            const [result] =
                await db.query(

                    `
                    DELETE FROM stays_to_buy

                    WHERE id = ?
                    `,

                    [id]

                );


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Stay To Buy not found"

                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Stay To Buy deleted successfully"

            });


        } catch (error) {

            console.error(
                "DELETE STAY TO BUY ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    };