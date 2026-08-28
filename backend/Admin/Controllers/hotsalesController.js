import db from "../../configuration/db.js";



// ===============================
// ADD HOT SALE
// ===============================

export const addHotSale = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const {
            client_id,
            title,
            description,
            price,
            property_type,
            rate,
            overview,
            highlights,
            area_sqft,
            city,
            map_address,
            location,
            duration
        } = req.body;


        const normalizedClientId =
            client_id && String(client_id).trim() !== ""
                ? Number(client_id)
                : null;


        // ===============================
        // CLIENT VALIDATION
        // ===============================

        if (!normalizedClientId) {

            await connection.rollback();

            return res.status(401).json({
                message: "Please login before adding property"
            });
        }


        // ===============================
        // MAIN IMAGE VALIDATION
        // ===============================

        if (!req.files?.main_image) {

            await connection.rollback();

            return res.status(400).json({
                message: "Main image is required"
            });
        }


        // ===============================
        // MAIN VIDEO
        // ===============================

        const mainVideo =
            req.files?.main_video
                ? req.files.main_video[0].buffer
                : null;


        // ===============================
        // INSERT HOT SALE
        // ===============================

        const [result] = await connection.query(

            `
            INSERT INTO hot_sales
            (
                client_id,
                title,
                description,
                price,
                property_type,
                rate,
                overview,
                highlights,
                area_sqft,
                city,
                map_address,
                location,
                main_image,
                main_video,
                duration
            )

            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `,

            [
                normalizedClientId,
                title,
                description || null,
                price,
                property_type,
                rate || 0,

                overview
                    ? JSON.stringify(overview)
                    : null,

                highlights
                    ? JSON.stringify(highlights)
                    : null,

                area_sqft || null,
                city,
                map_address || null,
                location,

                req.files.main_image[0].buffer,

                mainVideo,

                duration || null
            ]
        );


        const hotSaleId = result.insertId;


        // ===============================
        // GALLERY IMAGES
        // ===============================

        if (req.files?.images) {

            for (const image of req.files.images) {

                await connection.query(

                    `
                    INSERT INTO hot_sale_images
                    (
                        hot_sale_id,
                        image
                    )

                    VALUES (?,?)
                    `,

                    [
                        hotSaleId,
                        image.buffer
                    ]
                );
            }
        }


        // ===============================
        // COMMIT
        // ===============================

        await connection.commit();


        res.status(201).json({

            message: "Hot sale added successfully",

            id: hotSaleId

        });


    } catch (error) {

        await connection.rollback();

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    } finally {

        connection.release();
    }
};



// ===============================
// GET  HOT SALE
// ===============================


export const getHotSales = async (req, res) => {

    try {

        const [hotSales] = await db.query(

            `
            SELECT
                id,
                client_id,
                title,
                description,
                price,
                property_type,
                rate,
                overview,
                highlights,
                area_sqft,
                city,
                map_address,
                location,
                duration,
                status,
                created_at,
                updated_at

            FROM hot_sales

            ORDER BY created_at DESC
            `
        );


        const data = await Promise.all(

            hotSales.map(async (item) => {

                const [images] = await db.query(

                    `
                    SELECT id
                    FROM hot_sale_images
                    WHERE hot_sale_id=?
                    `,

                    [item.id]
                );


                return {

                    ...item,

                    main_image:
                        `/api/hotsales/main-image/${item.id}`,

                    main_video:
                        `/api/hotsales/main-video/${item.id}`,

                    images:
                        images.map(
                            img =>
                                `/api/hotsales/image/${img.id}`
                        )
                };

            })
        );


        res.json({

            message: "Hot sales fetched",

            hotSales: data

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

};






// ===============================
// GET SINGLE HOT SALE
// ===============================

export const getHotSaleById = async (req, res) => {

    try {

        const { id } = req.params;


        const [rows] = await db.query(

            "SELECT * FROM hot_sales WHERE id=?",

            [id]

        );


        if (rows.length === 0) {

            return res.status(404).json({

                message: "Not found"

            });

        }


        const [images] = await db.query(

            `
            SELECT id
            FROM hot_sale_images
            WHERE hot_sale_id=?
            `,

            [id]

        );


        res.json({

            success: true,

            hotSale: {

                ...rows[0],

                main_image:
                    `/api/hotsales/main-image/${id}`,

                main_video:
                    `/api/hotsales/main-video/${id}`,

                images:
                    images.map(
                        img =>
                            `/api/hotsales/image/${img.id}`
                    )

            }

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

};








// ===============================
// UPDATE HOT SALE
// ===============================

export const editHotSale = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();


        const { id } = req.params;


        const {
            client_id,
            title,
            description,
            price,
            property_type,
            rate,
            overview,
            highlights,
            area_sqft,
            city,
            map_address,
            location,
            status,
            duration
        } = req.body;


        // ===============================
        // CHECK HOT SALE
        // ===============================

        const [exist] = await connection.query(

            "SELECT id FROM hot_sales WHERE id=?",

            [id]

        );


        if (exist.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                message: "Hot sale not found"

            });

        }


        // ===============================
        // MAIN VIDEO
        // ===============================

        const hasMainVideo =
            req.files?.main_video &&
            req.files.main_video.length > 0;


        // ===============================
        // MAIN IMAGE
        // ===============================

        const hasMainImage =
            req.files?.main_image &&
            req.files.main_image.length > 0;


        let sql = `
            UPDATE hot_sales SET

                client_id=?,
                title=?,
                description=?,
                price=?,
                property_type=?,
                rate=?,
                overview=?,
                highlights=?,
                area_sqft=?,
                city=?,
                map_address=?,
                location=?,
                status=?,
                duration=?
        `;


        let values = [

            client_id,
            title,
            description || null,
            price,
            property_type,
            rate || 0,

            overview
                ? JSON.stringify(overview)
                : null,

            highlights
                ? JSON.stringify(highlights)
                : null,

            area_sqft || null,
            city,
            map_address || null,
            location,
            status,
            duration || null

        ];


        // ===============================
        // MAIN IMAGE
        // ===============================

        if (hasMainImage) {

            sql += `, main_image=?`;

            values.push(
                req.files.main_image[0].buffer
            );
        }


        // ===============================
        // MAIN VIDEO
        // ===============================

        if (hasMainVideo) {

            sql += `, main_video=?`;

            values.push(
                req.files.main_video[0].buffer
            );
        }


        sql += ` WHERE id=?`;

        values.push(id);


        await connection.query(sql, values);


        // ===============================
        // GALLERY IMAGES
        // ===============================

        if (req.files?.images) {

            for (const image of req.files.images) {

                await connection.query(

                    `
                    INSERT INTO hot_sale_images
                    (
                        hot_sale_id,
                        image
                    )

                    VALUES (?,?)
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

            message: "Updated successfully"

        });


    } catch (error) {

        await connection.rollback();

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    } finally {

        connection.release();

    }

};







// ===============================
// IMAGE APIs
// ===============================


export const getMainImage=async(req,res)=>{


const [rows]=await db.query(

`
SELECT main_image
FROM hot_sales
WHERE id=?
`

,[req.params.id]

);



if(rows.length===0)
return res.sendStatus(404);



res.set("Content-Type", "image/jpeg");




res.send(rows[0].main_image);



};


// ===============================
// MAIN VIDEO API
// ===============================

export const getMainVideo = async (req, res) => {

    try {

        const [rows] = await db.query(

            `
            SELECT main_video
            FROM hot_sales
            WHERE id=?
            `,

            [req.params.id]

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


        res.send(rows[0].main_video);


    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

};







export const getHotSaleImage=async(req,res)=>{


const [rows]=await db.query(

`
SELECT image
FROM hot_sale_images
WHERE id=?
`

,[req.params.id]

);



if(rows.length===0)
return res.sendStatus(404);



res.set("Content-Type", "image/jpeg");



res.send(rows[0].image);



};





// DELETE

export const deleteHotSale=async(req,res)=>{

try{

await db.query(

"DELETE FROM hot_sales WHERE id=?",

[req.params.id]

);


res.json({

message:"Deleted successfully"

});


}catch(error){

res.status(500).json({

message:error.message

});

}


};