import db from "../../configuration/db.js";

// =======================================================
// ADD WANTED PROPERTY
// =======================================================

export const addWanted = async (req, res) => {
    let connection;

    try {
        const {
            client_id,
            title,
            description,
            budget,
            preferred_city,
            phone_number
        } = req.body;

        // -----------------------------
        // Validation
        // -----------------------------

        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: "Client ID is required"
            });
        }

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        if (!phone_number) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }

        // -----------------------------
        // Get uploaded main image
        // -----------------------------

        const mainImageFile =
            req.files?.main_image?.length > 0
                ? req.files.main_image[0]
                : null;

        // -----------------------------
        // Get gallery images
        // -----------------------------

        const galleryImages =
            req.files?.images?.length > 0
                ? req.files.images
                : [];

        // -----------------------------
        // Start transaction
        // -----------------------------

        connection = await db.getConnection();

        await connection.beginTransaction();

        // -----------------------------
        // Insert wanted property
        // -----------------------------

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

        // -----------------------------
        // Insert gallery images
        // -----------------------------

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

        // -----------------------------
        // Commit
        // -----------------------------

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Wanted Property Added Successfully",
            id: wantedId
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.log("Add Wanted Error:", error);

        res.status(500).json({
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
// GET ALL WANTED PROPERTIES
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
                w.main_image,
                
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

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.log("Get Wanted Error:", error);

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
                w.main_image,
                
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

        // -----------------------------
        // Get gallery images
        // -----------------------------

        const [imageRows] = await db.query(
            `
            SELECT
                id,
                wanted_id,
                image
                
                created_at
            FROM wanted_images
            WHERE wanted_id = ?
            ORDER BY id ASC
            `,
            [id]
        );

        res.json({
            success: true,
            data: {
                ...wantedRows[0],
                images: imageRows
            }
        });

    } catch (error) {

        console.log("Get Wanted By ID Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


export const updateWanted = async (req, res) => {

    let connection;

    try {

        const { id } = req.params;

        const {
            title,
            description,
            budget,
            preferred_city,
            phone_number,
            status
        } = req.body;

        // ==========================================
        // Check property exists
        // ==========================================

        const [existingRows] = await db.query(
            `
            SELECT id
            FROM wanted
            WHERE id = ?
            `,
            [id]
        );

        if (existingRows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Wanted Property not found"
            });

        }

        // ==========================================
        // Main image
        // ==========================================

        const mainImageFile =
            req.files?.main_image?.length > 0
                ? req.files.main_image[0]
                : null;

        // ==========================================
        // Gallery images
        // ==========================================

        const galleryImages =
            req.files?.images?.length > 0
                ? req.files.images
                : [];

        // ==========================================
        // Start transaction
        // ==========================================

        connection = await db.getConnection();

        await connection.beginTransaction();

        // ==========================================
        // Update wanted table
        // ==========================================

        if (mainImageFile) {

            await connection.query(
                `
                UPDATE wanted
                SET
                    title = ?,
                    description = ?,
                    budget = ?,
                    preferred_city = ?,
                    phone_number = ?,
                    status = ?,
                    main_image = ?
                   
                WHERE id = ?
                `,
                [
                    title,
                    description || null,
                    budget || null,
                    preferred_city || null,
                    phone_number,
                    status || "pending",
                    mainImageFile.buffer,
                    
                    id
                ]
            );

        } else {

            await connection.query(
                `
                UPDATE wanted
                SET
                    title = ?,
                    description = ?,
                    budget = ?,
                    preferred_city = ?,
                    phone_number = ?,
                    status = ?
                WHERE id = ?
                `,
                [
                    title,
                    description || null,
                    budget || null,
                    preferred_city || null,
                    phone_number,
                    status || "pending",
                    id
                ]
            );

        }

        // ==========================================
        // Add gallery images
        // ==========================================

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

        // ==========================================
        // Commit
        // ==========================================

        await connection.commit();

        res.json({
            success: true,
            message: "Wanted Property Updated Successfully"
        });

    } catch (error) {

    if (connection) {
        await connection.rollback();
    }

    console.error("=================================");
    console.error("UPDATE WANTED ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("SQL State:", error.sqlState);
    console.error("SQL Message:", error.sqlMessage);
    console.error("Stack:", error.stack);
    console.error("=================================");

    res.status(500).json({
        success: false,
        message: error.message,
        code: error.code
    });

} finally {

    if (connection) {
        connection.release();
    }

}

};