import db from "../../configuration/db.js";




// ===============================
// ADD LAND
// ===============================

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




        if (!req.files?.main_image?.length) {


            return res.status(400).json({

                message:"Main image is required"

            });


        }





        const mainImage = req.files.main_image[0].path;



        let mainVideo = null;


        if(req.files?.main_video?.length){


            mainVideo = req.files.main_video[0].path;


        }





        const [result] = await connection.query(

            `
            INSERT INTO land
            (
                client_id,
                title,
                description,
                price,
                land_size,
                size_unit,
                location,
                city,
                status,
                duration,
                main_image,
                main_video
            )

            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)

            `,


            [

                client_id,
                title,
                description || null,
                price,
                land_size,
                size_unit,
                location,
                city,
                status || "available",
                duration || "month",
                mainImage,
                mainVideo

            ]

        );





        const landId = result.insertId;





        if(req.files?.images?.length){


            for(const image of req.files.images){


                await connection.query(

                    `
                    INSERT INTO land_images
                    (
                        land_id,
                        image
                    )

                    VALUES (?,?)

                    `,


                    [

                        landId,
                        image.path

                    ]

                );


            }


        }





        await connection.commit();




        res.status(201).json({

            success:true,

            message:"Land added successfully",

            id:landId

        });




    }catch(error){


        await connection.rollback();


        console.log(error);



        res.status(500).json({

            success:false,

            message:"Internal server error",

            error:error.message

        });



    }finally{


        connection.release();


    }


};







// ===============================
// GET ALL LANDS
// ===============================


export const getlands = async(req,res)=>{


    try{


        const [lands] = await db.query(

            `
            SELECT *

            FROM land

            ORDER BY created_at DESC

            `

        );



        res.json({

            success:true,

            lands

        });



    }catch(error){


        console.log(error);


        res.status(500).json({

            message:"Internal server error"

        });


    }


};







// ===============================
// GET SINGLE LAND
// ===============================


export const getLandById = async(req,res)=>{


    try{


        const {id}=req.params;



        const [land] = await db.query(

            `
            SELECT *

            FROM land

            WHERE id=?

            `,

            [id]

        );




        if(land.length===0){


            return res.status(404).json({

                message:"Land not found"

            });


        }





        const [images] = await db.query(

            `
            SELECT *

            FROM land_images

            WHERE land_id=?

            `,

            [id]

        );




        res.json({

            land:{

                ...land[0],

                images

            }

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};







// ===============================
// UPDATE LAND
// ===============================


export const updateLand = async(req,res)=>{


    try{


        const {id}=req.params;


        const {

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





        await db.query(

            `
            UPDATE land SET

            title=?,
            description=?,
            price=?,
            land_size=?,
            size_unit=?,
            location=?,
            city=?,
            status=?,
            duration=?

            WHERE id=?

            `,


            [

                title,
                description,
                price,
                land_size,
                size_unit,
                location,
                city,
                status,
                duration,
                id

            ]

        );





        res.json({

            success:true,

            message:"Land updated successfully"

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};







// ===============================
// DELETE LAND
// ===============================


export const deleteLand = async(req,res)=>{


    try{


        const {id}=req.params;




        await db.query(

            "DELETE FROM land_images WHERE land_id=?",

            [id]

        );



        await db.query(

            "DELETE FROM land WHERE id=?",

            [id]

        );




        res.json({

            success:true,

            message:"Land deleted successfully"

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};