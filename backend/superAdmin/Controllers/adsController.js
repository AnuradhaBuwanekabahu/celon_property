import db from "../../configuration/db.js";

const getOwnerId = async (req) => {
    const rawValue = req.body?.client_id ?? req.body?.admin_id ?? req.body?.created_by ?? req.admin?.id;
    if (rawValue) {
        const [found] = await db.query("SELECT id FROM clients WHERE id = ?", [rawValue]);
        if (found.length) return found[0].id;
    }
    const [first] = await db.query("SELECT id FROM clients LIMIT 1");
    if (first.length) return first[0].id;
    throw new Error("No client account found in database.");
};

const getImageBuffer = (req) => {
    if (req.file?.buffer?.length) {
        return req.file.buffer;
    }

    const imageValue = req.body?.image_url ?? req.body?.image;
    if (typeof imageValue === "string" && imageValue.trim()) {
        return Buffer.from(imageValue.trim());
    }

    return Buffer.from("placeholder");
};

const normalizePosition = (value) => {
    if (value === 'front_page_bottom') return 'front_page_bottom';
    if (value === 'front_page_top') return 'front_page_top';
    if (String(value) === '1') return 'front_page_bottom';
    if (String(value) === '2') return 'front_page_top';
    return 'sub_pages';
};

// Create Advertisement

export const createAd = async (req, res) => {

    try {

        const title = req.body?.title?.trim();
        const link_url = req.body?.link_url || null;
        const position = normalizePosition(req.body?.position);
        const clientId = await getOwnerId(req);

        if (!title) {

            return res.status(400).json({
                message: "Title is required"
            });

        }

        const imageBuffer = getImageBuffer(req);

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
            VALUES (?,?,?,?,?,?)
        `;


        const [result] = await db.query(sql, [
            clientId,
            title,
            imageBuffer,
            link_url,
            position,
            1
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

        const title = req.body?.title?.trim();
        const link_url = req.body?.link_url || null;
        const position = normalizePosition(req.body?.position);
        const clientId = await getOwnerId(req);

        const [existingAd] = await db.query(

            "SELECT * FROM ads WHERE id = ?",

            [id]

        );


        if (existingAd.length === 0) {

            return res.status(404).json({

                message: "Advertisement not found"

            });

        }

        const shouldUpdateImage = Boolean(req.file || req.body?.image_url || req.body?.image);

        let sql;

        let values;


        if (shouldUpdateImage) {

            sql = `
                UPDATE ads
                SET
                    client_id=?,
                    title=?,
                    image=?,
                    link_url=?,
                    position=?
                WHERE id=?
            `;


            values = [
                clientId,
                title,
                getImageBuffer(req),
                link_url,
                position,
                id
            ];

        }

        else {

            sql = `
                UPDATE ads
                SET
                    client_id=?,
                    title=?,
                    link_url=?,
                    position=?
                WHERE id=?
            `;


            values = [
                clientId,
                title,
                link_url,
                position,
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
                client_id,
                title,
                link_url,
                position,
                is_active,
                created_at
            FROM ads
            ORDER BY position ASC
            `

        );


        const adsWithImage = ads.map((ad) => ({

            ...ad,

            position: normalizePosition(ad.position),

            image: `/api/super-admin/ads/image/${ad.id}`

        }));


        res.status(200).json({

            success: true,

            message: "Advertisements fetched successfully",
            data: adsWithImage,
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

            "SELECT is_active FROM ads WHERE id = ?",

            [id]

        );


        if (rows.length === 0) {

            return res.status(404).json({

                message: "Advertisement not found"

            });

        }


        const newStatus = rows[0].is_active ? 0 : 1;


        await db.query(

            "UPDATE ads SET is_active = ? WHERE id = ?",

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