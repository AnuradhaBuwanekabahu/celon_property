import db from "../../configuration/db.js"


export const addLands = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const {
            client_id,
            title,
            description,
            price,
            land_size,
            size_unit,
            location,
            city,
            status,
            duration

        } = req.body;

        let mainVideo = null;
        if (req.files?.main_video?.length > 0) {
            mainVideo = req.files.main_video[0].path;
        }

        if (!req.files || !req.files.main_image) {

            return res.status(400).json({

                message: "Main image is required"

            });
        }


        const [result] = await connection.query(

            `INSERT INTO land (
            
            client_id,
            title,
            description,
            price,
            land_size,
            size_unit ,
            location,
            city,
            status,
            duration,
            main_video
            
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?) `,

            [
                client_id,
                title,
                description || null,
                price,
                land_size,
                size_unit,
                location,
                city,
                status,
                duration || 'month',
                mainVideo,
                req.files.main_image[0].path
            ]

        );

        const landsID = result.insertId;

        //insert multiple images

        if (req.files.images) {

            for (const image of req.files.images) {


                await connection.query(
                    `insert into land_images
                    (
                    land_id,
                    image
                    )
                    VALUES(?,?)`,
                    [
                        landsID,
                        image.path
                    ]
                );

            }
        }


        await connection.commit();



        res.status(201).json({

            message: "lands added successfully",

            id: hotSaleId

        });


    }
    catch (error) {

        console.log(error);


        res.status(500).json({

            message: "Internal server error",

            error: error.message

        });

    }
    finally {

        connection.release();
    }
}

//get all lands

export const getlands = async (req, res) => {

    try {

        const [lands] = await db.query(
            `
            select 
            id,
            client_id,
            title,
            description,
            price,
            land_size,
            size_unit ,
            location,
            city,
            status,
             created_at,
            updated_at

            from land
            order by created_at desc
             `
        );

        const lands_with_image = await Promise.all(

            lands.map(async (land) => {

                const [images] = await db.query(
                    `
                    select id from land_images where land_id =? 
                    `, [land.id]
                );
                return {
                    ...land,

                    main_image:
                        `/api/lands/main-image/${land.id}`,
                }

            })
        )

    }
    catch (error) {

    }

}

