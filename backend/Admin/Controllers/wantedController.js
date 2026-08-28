import db from "../../configuration/db.js";

// =======================================================
// ADD WANTED PROPERTY
// =======================================================

export const addWanted = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const {
            client_id,
            title,
            description,
            budget,
            preferred_city,
            phone_number
        } = req.body;

        // =================================================
        // VALIDATION
        // =================================================

        if (!client_id) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Client ID is required"
            });
        }

        if (!title) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        if (!phone_number) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }

        // =================================================
        // MAIN IMAGE
        // =================================================

        const mainImageFile =
            req.files?.main_image?.length > 0
                ? req.files.main_image[0]
                : null;

        // =================================================
        // GALLERY IMAGES
        // =================================================

        const galleryImages =
            req.files?.images?.length > 0
                ? req.files.images
                : [];

        // =================================================
        // INSERT WANTED
        // =================================================

        const [result] = await connection.query(
            `
            INSERT INTO wanted
            (
                client_id,
                title,
                description,
                budget,
                preferred_city,
                phone_number,
                main_image
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                client_id,
                title,
                description || null,
                budget || null,
                preferred_city || null,
                phone_number,
                mainImageFile
                    ? mainImageFile.buffer
                    : null
            ]
        );

        const wantedId = result.insertId;

        // =================================================
        // INSERT GALLERY
        // =================================================

        if (galleryImages.length > 0) {

            for (const image of galleryImages) {

                await connection.query(
                    `
                    INSERT INTO wanted_images
                    (
                        wanted_id,
                        image
                    )
                    VALUES (?, ?)
                    `,
                    [
                        wantedId,
                        image.buffer
                    ]
                );

            }

        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Wanted Property Added Successfully",
            id: wantedId
        });

    } catch (error) {

        await connection.rollback();

        console.error("ADD WANTED ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {

        connection.release();

    }

};


// =======================================================
// GET ALL WANTED
// =======================================================

export const getWanted = async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT
                w.id,
                w.client_id,
                w.title,
                w.description,
                w.budget,
                w.preferred_city,
                w.phone_number,
                w.status,
                w.created_at,
                w.updated_at,
                c.full_name,
                c.email
            FROM wanted w
            JOIN clients c
                ON w.client_id = c.id
            ORDER BY w.created_at DESC
            `
        );

        const data = await Promise.all(

            rows.map(async (item) => {

                // -----------------------------------------
                // Gallery images
                // -----------------------------------------

                const [images] = await db.query(
                    `
                    SELECT id
                    FROM wanted_images
                    WHERE wanted_id = ?
                    ORDER BY id ASC
                    `,
                    [item.id]
                );

                return {

                    ...item,

                    // Main image API
                    main_image:
                        `/api/wanted/main-image/${item.id}`,

                    // Gallery image API URLs
                    images:
                        images.map(
                            image =>
                                `/api/wanted/image/${image.id}`
                        )

                };

            })

        );

        res.json({
            success: true,
            data
        });

    } catch (error) {

        console.error("GET WANTED ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =======================================================
// GET WANTED BY ID
// =======================================================

export const getWantedById = async (req, res) => {

    try {

        const { id } = req.params;

        // =================================================
        // WANTED PROPERTY
        // =================================================

        const [wantedRows] = await db.query(
            `
            SELECT
                w.id,
                w.client_id,
                w.title,
                w.description,
                w.budget,
                w.preferred_city,
                w.phone_number,
                w.status,
                w.created_at,
                w.updated_at,
                c.full_name,
                c.email
            FROM wanted w
            JOIN clients c
                ON w.client_id = c.id
            WHERE w.id = ?
            `,
            [id]
        );

        if (wantedRows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Wanted Property not found"
            });

        }

        // =================================================
        // GALLERY
        // =================================================

        const [images] = await db.query(
            `
            SELECT
                id
            FROM wanted_images
            WHERE wanted_id = ?
            ORDER BY id ASC
            `,
            [id]
        );

        // =================================================
        // RESPONSE
        // =================================================

        res.json({

            success: true,

            data: {

                ...wantedRows[0],

                // Main image
                main_image:
                    `/api/wanted/main-image/${id}`,

                // Gallery
                images:
                    images.map(
                        image =>
                            `/api/wanted/image/${image.id}`
                    )

            }

        });

    } catch (error) {

        console.error(
            "GET WANTED BY ID ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =======================================================
// MAIN IMAGE API
// =======================================================

export const getMainImage = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                main_image
            FROM wanted
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

        res.send(rows[0].main_image);

    } catch (error) {

        console.error(
            "GET WANTED MAIN IMAGE ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =======================================================
// GALLERY IMAGE API
// =======================================================

export const getWantedImage = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                image
            FROM wanted_images
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

        res.send(rows[0].image);

    } catch (error) {

        console.error(
            "GET WANTED GALLERY IMAGE ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =======================================================
// UPDATE WANTED
// =======================================================

export const updateWanted = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const { id } = req.params;

        const {
            title,
            description,
            budget,
            preferred_city,
            phone_number,
            status
        } = req.body;

        // =================================================
        // CHECK PROPERTY
        // =================================================

        const [existingRows] = await connection.query(
            `
            SELECT id
            FROM wanted
            WHERE id = ?
            `,
            [id]
        );

        if (existingRows.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Wanted Property not found"
            });

        }

        // =================================================
        // MAIN IMAGE
        // =================================================

        const mainImageFile =
            req.files?.main_image?.length > 0
                ? req.files.main_image[0]
                : null;

        // =================================================
        // GALLERY
        // =================================================

        const galleryImages =
            req.files?.images?.length > 0
                ? req.files.images
                : [];

        // =================================================
        // UPDATE
        // =================================================

        let sql = `
            UPDATE wanted SET

                title = ?,
                description = ?,
                budget = ?,
                preferred_city = ?,
                phone_number = ?,
                status = ?
        `;

        const values = [
            title,
            description || null,
            budget || null,
            preferred_city || null,
            phone_number,
            status || "pending"
        ];

        // =================================================
        // NEW MAIN IMAGE
        // =================================================

        if (mainImageFile) {

            sql += `,
                main_image = ?
            `;

            values.push(
                mainImageFile.buffer
            );

        }

        sql += `
            WHERE id = ?
        `;

        values.push(id);

        await connection.query(
            sql,
            values
        );

        // =================================================
        // ADD NEW GALLERY IMAGES
        // =================================================

        if (galleryImages.length > 0) {

            for (const image of galleryImages) {

                await connection.query(
                    `
                    INSERT INTO wanted_images
                    (
                        wanted_id,
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

        await connection.commit();

        res.json({
            success: true,
            message: "Wanted Property Updated Successfully"
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "UPDATE WANTED ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {

        connection.release();

    }

};