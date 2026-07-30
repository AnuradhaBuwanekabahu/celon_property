import db from "../../configuration/db.js";

// Create Advertisement

export const createAd = async (req, res) => {

    try {

        const {
            title,
            link_url,
            position,
            created_by
        } = req.body;


        if (!title) {

            return res.status(400).json({
                message: "Title is required"
            });

        }


        if (!req.file) {

            return res.status(400).json({
                message: "Image is required"
            });

        }


        const sql = `
            INSERT INTO ads
            (
                title,
                image,
                link_url,
                position,
                created_by
            )
            VALUES (?,?,?,?,?)
        `;


        const [result] = await db.query(sql, [

            title,

            req.file.buffer,

            link_url || null,

            position || 0,

            created_by

        ]);


        res.status(201).json({

            success: true,

            message: "Advertisement created successfully",

            adId: result.insertId

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

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


        res.setHeader("Content-Type", "image/jpeg");

        res.send(result[0].image);

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Internal server error"

        });

    }

};



// Update Advertisement

export const updateAd = async (req, res) => {

    try {

        const { id } = req.params;

        const {

            title,

            link_url,

            position,

            created_by

        } = req.body;


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


        if (req.file) {

            sql = `
                UPDATE ads
                SET
                    title=?,
                    image=?,
                    link_url=?,
                    position=?,
                    created_by=?
                WHERE id=?
            `;


            values = [

                title,

                req.file.buffer,

                link_url || null,

                position || 0,

                created_by,

                id

            ];

        }

        else {

            sql = `
                UPDATE ads
                SET
                    title=?,
                    link_url=?,
                    position=?,
                    created_by=?
                WHERE id=?
            `;


            values = [

                title,

                link_url || null,

                position || 0,

                created_by,

                id

            ];

        }


        await db.query(sql, values);


        res.status(200).json({

            success: true,

            message: "Advertisement updated successfully"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

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
                title,
                link_url,
                position,
                status,
                created_by,
                created_at
            FROM ads
            ORDER BY position ASC
            `

        );


        const adsWithImage = ads.map((ad) => ({

            ...ad,

            image: `/api/super-admin/ads/image/${ad.id}`

        }));


        res.status(200).json({

            success: true,

            message: "Advertisements fetched successfully",

            ads: adsWithImage

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal server error",

            error: error.message

        });

    }

};



// Delete Advertisement

export const deleteAd = async (req, res) => {

    try {

        const { id } = req.params;


        const [existingAd] = await db.query(

            "SELECT * FROM ads WHERE id = ?",

            [id]

        );


        if (existingAd.length === 0) {

            return res.status(404).json({

                message: "Advertisement not found"

            });

        }


        await db.query(

            "DELETE FROM ads WHERE id = ?",

            [id]

        );


        res.status(200).json({

            success: true,

            message: "Advertisement deleted successfully"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal server error"

        });

    }

};



// Toggle Advertisement Status

export const toggleAdStatus = async (req, res) => {

    try {

        const { id } = req.params;


        const [rows] = await db.query(

            "SELECT status FROM ads WHERE id = ?",

            [id]

        );


        if (rows.length === 0) {

            return res.status(404).json({

                message: "Advertisement not found"

            });

        }


        const newStatus = rows[0].status === "active"

            ? "inactive"

            : "active";


        await db.query(

            "UPDATE ads SET status = ? WHERE id = ?",

            [

                newStatus,

                id

            ]

        );


        res.status(200).json({

            success: true,

            message: "Advertisement status updated",

            status: newStatus

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal server error"

        });

    }

};