import db from "../../configuration/db.js";


// ==========================================
// ADD STAY TO BUY (SUPER ADMIN)
// ==========================================

export const addStayToBuy = async (req,res)=>{

    let connection;


    try{

        connection = await db.getConnection();

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
            location,
            duration,
            status


        } = req.body;




        if(
            !client_id ||
            !title ||
            !price ||
            !property_type ||
            !city
        ){

            return res.status(400).json({

                success:false,

                message:"Required fields missing"

            });

        }




        let mainImage=null;

        let mainVideo=null;



        if(req.files?.main_image?.length){

            mainImage=req.files.main_image[0].path;

        }


        if(req.files?.main_video?.length){

            mainVideo=req.files.main_video[0].path;

        }



        if(!mainImage){

            return res.status(400).json({

                success:false,

                message:"Main image required"

            });

        }




        let images=[];


        if(req.files?.images?.length){

            images=req.files.images.map(

                img=>img.path

            );

        }




        const sql=`

        INSERT INTO stays_to_buy

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
        main_image,
        main_video,
        images,
        duration,
        status

        )

        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)

        `;



        const [result]=await connection.query(

            sql,

            [

                client_id,
                title,
                description || null,
                price,
                property_type,
                highlights 
                ? JSON.stringify(JSON.parse(highlights))
                : JSON.stringify([]),

                area_sqft || null,
                city,
                map_address,
                location,
                mainImage,
                mainVideo,
                JSON.stringify(images),
                duration || "month",
                status || "pending"

            ]

        );



        await connection.commit();



        res.status(201).json({

            success:true,

            message:"Stay To Buy added successfully",

            id:result.insertId

        });



    }
    catch(error){


        if(connection)
            await connection.rollback();



        res.status(500).json({

            success:false,

            message:error.message

        });


    }
    finally{


        if(connection)
            connection.release();

    }


};






// ==========================================
// GET ALL STAY TO BUY
// ==========================================


export const getAllStayToBuy = async(req,res)=>{


    try{


        const {

            status,
            city,
            property_type


        }=req.query;




        let sql=`

        SELECT

        s.*,

        c.full_name,
        c.email,
        c.phone_number


        FROM stays_to_buy s


        LEFT JOIN clients c

        ON s.client_id=c.id


        `;



        let conditions=[];

        let values=[];



        if(status){

            conditions.push("s.status=?");

            values.push(status);

        }



        if(city){

            conditions.push("s.city=?");

            values.push(city);

        }



        if(property_type){

            conditions.push("s.property_type=?");

            values.push(property_type);

        }




        if(conditions.length){

            sql += " WHERE " + conditions.join(" AND ");

        }



        sql += " ORDER BY s.created_at DESC";




        const [rows]=await db.query(

            sql,

            values

        );




        res.json({

            success:true,

            count:rows.length,

            data:rows

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};







// ==========================================
// GET SINGLE PROPERTY
// ==========================================


export const getStayToBuyById=async(req,res)=>{


    try{


        const {id}=req.params;



        const [rows]=await db.query(

            `

            SELECT

            s.*,

            c.full_name,
            c.email,
            c.phone_number


            FROM stays_to_buy s


            LEFT JOIN clients c

            ON s.client_id=c.id


            WHERE s.id=?


            `,

            [id]

        );



        if(!rows.length){


            return res.status(404).json({

                success:false,

                message:"Property not found"

            });


        }




        res.json({

            success:true,

            data:rows[0]

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};








// ==========================================
// UPDATE PROPERTY
// ==========================================


export const updateStayToBuy=async(req,res)=>{


    try{


        const {id}=req.params;



        const {

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
            duration


        }=req.body;




        let mainImage=null;

        let mainVideo=null;

        let images=null;




        if(req.files?.main_image?.length){

            mainImage=req.files.main_image[0].path;

        }



        if(req.files?.main_video?.length){

            mainVideo=req.files.main_video[0].path;

        }



        if(req.files?.images?.length){

            images=JSON.stringify(

                req.files.images.map(

                    img=>img.path

                )

            );

        }




        await db.query(

        `

        UPDATE stays_to_buy

        SET

        title=?,
        description=?,
        price=?,
        property_type=?,
        highlights=?,
        area_sqft=?,
        city=?,
        map_address=?,
        location=?,
        status=?,
        duration=?,
        main_image=COALESCE(?,main_image),
        main_video=COALESCE(?,main_video),
        images=COALESCE(?,images)


        WHERE id=?


        `,


        [

            title,
            description,
            price,
            property_type,

            highlights
            ? JSON.stringify(JSON.parse(highlights))
            : JSON.stringify([]),

            area_sqft,
            city,
            map_address,
            location,
            status,
            duration || "month",

            mainImage,
            mainVideo,
            images,

            id

        ]


        );




        res.json({

            success:true,

            message:"Property updated successfully"

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};








// ==========================================
// DELETE PROPERTY
// ==========================================


export const deleteStayToBuy=async(req,res)=>{


    try{


        const {id}=req.params;



        const [result]=await db.query(

            `DELETE FROM stays_to_buy WHERE id=?`,

            [id]

        );




        if(!result.affectedRows){


            return res.status(404).json({

                success:false,

                message:"Property not found"

            });


        }




        res.json({

            success:true,

            message:"Property deleted successfully"

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};