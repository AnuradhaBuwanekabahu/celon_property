import db from "../../configuration/db.js";


// Add Hot Sale Property

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
            highlights,
            area_sqft,
            city,
            map_address,
            location
        } = req.body;



        // Check main image

        if (!req.files || !req.files.main_image) {

            return res.status(400).json({

                message: "Main image is required"

            });

        }


        // Insert Hot Sale

        const [result] = await connection.query(

            `
            INSERT INTO hot_sales
            (
                client_id,
                title,
                description,
                price,
                property_type,
                highlights,
                area_sqft,
                city,
                map_address,
                location,
                main_image
            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,

            [

                client_id,

                title,

                description || null,

                price,

                property_type,

                highlights ? JSON.stringify(highlights) : null,

                area_sqft || null,

                city,

                map_address || null,

                location,

                req.files.main_image[0].buffer

            ]

        );


        const hotSaleId = result.insertId;



        // Insert Multiple Images

        if (req.files.images) {


            for (const image of req.files.images) {


                await connection.query(

                    `
                    INSERT INTO hot_sale_images
                    (
                        hot_sale_id,
                        image
                    )

                    VALUES (?, ?)
                    `,

                    [

                        hotSaleId,

                        image.buffer

                    ]

                );


            }


        }



        await connection.commit();


        res.status(201).json({

            message: "Hot sale added successfully",

            id: hotSaleId

        });



    } catch (error) {


        await connection.rollback();


        console.log(error);


        res.status(500).json({

            message: "Internal server error",

            error: error.message

        });



    } finally {


        connection.release();


    }

};



// Get All Hot Sales

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
                highlights,
                area_sqft,
                city,
                map_address,
                location,
                status,
                created_at,
                updated_at

            FROM hot_sales

            ORDER BY created_at DESC
            `

        );



        const salesWithImages = await Promise.all(

            hotSales.map(async (sale) => {


                const [images] = await db.query(

                    `
                    SELECT id
                    FROM hot_sale_images
                    WHERE hot_sale_id = ?
                    `,

                    [sale.id]

                );



                return {

                    ...sale,

                    main_image:
                    `/api/hot-sales/main-image/${sale.id}`,

                    images:
                    images.map(img => 
                        `/api/hot-sales/image/${img.id}`
                    )

                };


            })

        );



        res.status(200).json({

            message: "Hot sales fetched successfully",

            hotSales: salesWithImages

        });



    } catch(error) {


        console.log(error);


        res.status(500).json({

            message:"Internal server error",

            error:error.message

        });


    }

};


// Edit Hot Sale

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
            highlights,
            area_sqft,
            city,
            map_address,
            location,
            status
        } = req.body;



        // Check existing hot sale

        const [existing] = await connection.query(

            "SELECT * FROM hot_sales WHERE id = ?",

            [id]

        );


        if(existing.length === 0){

            return res.status(404).json({

                message:"Hot sale not found"

            });

        }



        let sql;
        let values;



        // If new main image uploaded

        if(req.files?.main_image){


            sql = `

            UPDATE hot_sales SET

                client_id = ?,
                title = ?,
                description = ?,
                price = ?,
                property_type = ?,
                highlights = ?,
                area_sqft = ?,
                city = ?,
                map_address = ?,
                location = ?,
                status = ?,
                main_image = ?

            WHERE id = ?

            `;


            values = [

                client_id,

                title,

                description || null,

                price,

                property_type,

                highlights ? JSON.stringify(highlights) : null,

                area_sqft || null,

                city,

                map_address || null,

                location,

                status,

                req.files.main_image[0].buffer,

                id

            ];



        } else {


            // Without changing main image


            sql = `

            UPDATE hot_sales SET

                client_id = ?,
                title = ?,
                description = ?,
                price = ?,
                property_type = ?,
                highlights = ?,
                area_sqft = ?,
                city = ?,
                map_address = ?,
                location = ?,
                status = ?

            WHERE id = ?

            `;



            values = [

                client_id,

                title,

                description || null,

                price,

                property_type,

                highlights ? JSON.stringify(highlights) : null,

                area_sqft || null,

                city,

                map_address || null,

                location,

                status,

                id

            ];


        }



        await connection.query(sql, values);



        // Add new additional images

        if(req.files?.images){


            for(const image of req.files.images){


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



        res.status(200).json({

            message:"Hot sale updated successfully"

        });



    } catch(error){


        await connection.rollback();


        console.log(error);


        res.status(500).json({

            message:"Internal server error",

            error:error.message

        });



    } finally {


        connection.release();


    }

};



// Delete Hot Sale

export const deleteHotSale = async (req, res) => {

    try {

        const { id } = req.params;


        // Check if the hot sale exists

        const [existing] = await db.query(

            "SELECT id FROM hot_sales WHERE id = ?",

            [id]

        );


        if (existing.length === 0) {

            return res.status(404).json({

                message: "Hot sale not found"

            });

        }


        // Delete the hot sale
        // Related records in hot_sale_images will be deleted automatically

        await db.query(

            "DELETE FROM hot_sales WHERE id = ?",

            [id]

        );


        res.status(200).json({

            message: "Hot sale deleted successfully"

        });


    } catch (error) {

        console.log(error);


        res.status(500).json({

            message: "Internal server error",

            error: error.message

        });

    }

};

