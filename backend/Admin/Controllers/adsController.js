import db from "../../configuration/db.js";


// Add Advertisement

export const addAds = async (req, res) => {

    try {

        const {
            client_id,
            title,
            link_url,
            position,
            is_active
        } = req.body;


        // Check image
        if (!req.file) {

            return res.status(400).json({
                message: "Image is required"
            });

        }


        const sql = `
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
        `;


        const [result] = await db.query(sql, [

            client_id,

            title,

            req.file.buffer,

            link_url || null,

            position || 'sub_pages',

            is_active === undefined || is_active === null || is_active === '' ? 1 : is_active

        ]);


        res.status(201).json({

            success: true,

            message: "Advertisement added successfully",

            adId: result.insertId

        });


    } catch (error) {

        console.log(error);


        res.status(500).json({

            message: "Internal server error",

            error: error.message

        });

    }

};




// Get All Advertisements (show all without client filtering)

export const showAllAds = async (req, res) => {

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
            ORDER BY CASE position
                WHEN 'front_page_top' THEN 1
                WHEN 'front_page_bottom' THEN 2
                WHEN 'sub_pages' THEN 3
                ELSE 4
            END, id ASC
            `
        );

        const adsWithImage = ads.map((ad) => ({
            ...ad,
            image: `/api/ads/image/${ad.id}?v=${Date.now()}`
        }));

        res.status(200).json({
            message: "Advertisements fetched successfully",
            ads: adsWithImage
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get one advertisement

export const getAdById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
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

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Advertisement not found"
            });
        }

        res.status(200).json({
            ad: {
                ...rows[0],
                image: `/api/ads/image/${rows[0].id}?v=${Date.now()}`
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

// Get Advertisement Image

export const getAdImage = async (req, res) => {

    try {

        const { id } = req.params;


        const [result] = await db.query(
            "SELECT image FROM ads WHERE id = ?",
            [id]
        );


        if (result.length === 0) {

            return res.status(404).json({

                message: "Image not found"

            });

        }


        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        // Default image type
        res.setHeader(
            "Content-Type",
            "image/jpeg"
        );


        res.send(result[0].image);


    } catch (error) {

        console.log(error);


        res.status(500).json({

            message: "Internal server error"

        });

    }

};

//edit ads

export const editAds = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            client_id,
            title,
            link_url,
            position,
            is_active
        } = req.body;


        // Check existing ad
        const [existingAd] = await db.query(
            "SELECT * FROM ads WHERE id = ?",
            [id]
        );


        if (existingAd.length === 0) {

            return res.status(404).json({
                message: "Advertisement not found"
            });

        }


        let sql;
        let values;


        // If new image uploaded
        if (req.file) {

            sql = `
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


            values = [

                client_id,

                title,

                req.file.buffer,

                link_url || null,

                position || 'sub_pages',

                is_active === undefined || is_active === null || is_active === '' ? 1 : is_active,

                id

            ];


        } else {


            // Update without changing image

            sql = `
                UPDATE ads
                SET
                    client_id = ?,
                    title = ?,
                    link_url = ?,
                    position = ?,
                    is_active = ?
                WHERE id = ?
            `;


            values = [

                client_id,

                title,

                link_url || null,

                position || 'sub_pages',

                is_active === undefined || is_active === null || is_active === '' ? 1 : is_active,

                id

            ];

        }


        const [result] = await db.query(sql, values);


        res.status(200).json({

            success: true,

            message: "Advertisement updated successfully"

        });


    } catch (error) {

        console.log(error);


        res.status(500).json({

            message: "Internal server error",

            error: error.message

        });

    }

};




// Get All Advertisements

export const getAds = async (req, res) => {
    return showAllAds(req, res);
};




// Delete Advertisement

export const deleteAds = async (req, res) => {

    try {

        const { id } = req.params;


        // Check existing ad

        const [existingAd] = await db.query(
            "SELECT * FROM ads WHERE id = ?",
            [id]
        );


        if (existingAd.length === 0) {

            return res.status(404).json({

                message: "Advertisement not found"

            });

        }


        // Delete ad

        await db.query(
            "DELETE FROM ads WHERE id = ?",
            [id]
        );


        res.status(200).json({

            message: "Advertisement deleted successfully"

        });


    } catch (error) {

        console.log(error);


        res.status(500).json({

            message: "Internal server error",

            error: error.message

        });

    }

};