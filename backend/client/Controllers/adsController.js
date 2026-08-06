import db from "../../configuration/db.js";


// Add Advertisement

export const addAds = async (req, res) => {

    try {

        const {
            client_id,
            title,
            link_url,
            position
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
                position
            )
            VALUES (?, ?, ?, ?, ?)
        `;


        const [result] = await db.query(sql, [

            client_id,

            title,

            req.file.buffer,

            link_url || null,

            position || 0

        ]);


        res.status(201).json({

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
            position
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
                    position = ?
                WHERE id = ?
            `;


            values = [

                client_id,

                title,

                req.file.buffer,

                link_url || null,

                position || 0,

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
                    position = ?
                WHERE id = ?
            `;


            values = [

                client_id,

                title,

                link_url || null,

                position || 0,

                id

            ];

        }


        const [result] = await db.query(sql, values);


        res.status(200).json({

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

    try {

        const [ads] = await db.query(
            `
            SELECT 
                id,
                client_id,
                title,
                link_url,
                position,
                created_at
            FROM ads
            ORDER BY position ASC
            `
        );


        const adsWithImage = ads.map((ad) => ({

            ...ad,

            image: `/api/ads/image/${ad.id}`

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