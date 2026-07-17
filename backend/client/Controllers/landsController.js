import db from "../../configuration/db.js"


export const addLands = async(req,res) =>{

    const connection = await db.getConnection();

    try{
       
       await connection .beginTransaction();

        const {
            client_id,
            title,
            description,
            price,
            land_size,
            size_unit ,
            location,
            city,
            status
            
        }=req.body;

        if(!req.files ||!req.files.main_image){

              return res.status(400).json({

                message: "Main image is required"

            });
        }


        const [result] =await  connection.query(

            `INSERT INTO lands (
            
                client_id,
            title,
            description,
            price,
            land_size,
            size_unit ,
            location,
            city,
            status
            
            ) `
        )

        
    }
    catch(error){

         console.log(error);


        res.status(500).json({

            message:"Internal server error",

            error:error.message

        });

    }
}

