import db from "../../configuration/db.js";



// ==========================
// Add Hot Sale Property
// ==========================

export const addHotSale = async (req, res) => {

    try {

        const {
            title,
            description,
            price,
            property_type,
            city,
            status
        } = req.body;


        if (!title) {

            return res.status(400).json({

                message: "Title is required"

            });

        }


        if (!req.files || !req.files.main_image) {

            return res.status(400).json({

                message: "Main image is required"

            });

        }


        const mainImage = req.files.main_image[0].buffer;


        const images = req.files.images
            ? req.files.images.map(
                file => file.buffer
            )
            : [];



        const sql = `

            INSERT INTO hot_sales
            (
                title,
                description,
                price,
                property_type,
                city,
                main_image,
                images,
                status
            )

            VALUES (?,?,?,?,?,?,?,?)

        `;


        await db.query(sql, [

            title,

            description || null,

            price || null,

            property_type || null,

            city || null,

            mainImage,

            JSON.stringify(images),

            status || "pending"

        ]);



        res.status(201).json({

            success: true,

            message: "Hot Sale added successfully"

        });



    } catch(error) {


        console.log(error);


        res.status(500).json({

            success:false,

            message:"Server Error",

            error:error.message

        });


    }

};






// ==========================
// Get All Hot Sales
// ==========================

export const getHotSales = async (req,res)=>{


    try {


        const [rows] = await db.query(`

            SELECT
                id,
                title,
                description,
                price,
                property_type,
                city,
                status,
                created_at

            FROM hot_sales

            ORDER BY created_at DESC

        `);



        res.status(200).json({

            success:true,

            hotSales:rows

        });



    } catch(error){


        console.log(error);


        res.status(500).json({

            success:false,

            message:"Server Error"

        });


    }


};






// ==========================
// Update Hot Sale
// ==========================

export const updateHotSale = async(req,res)=>{


    try {


        const {id} = req.params;


        const {

            title,
            description,
            price,
            property_type,
            city,
            status

        } = req.body;



        const [existing] = await db.query(

            "SELECT * FROM hot_sales WHERE id=?",

            [id]

        );



        if(existing.length === 0){


            return res.status(404).json({

                message:"Property not found"

            });


        }



        await db.query(

            `

            UPDATE hot_sales

            SET

                title=?,

                description=?,

                price=?,

                property_type=?,

                city=?,

                status=?

            WHERE id=?

            `,


            [

                title,

                description,

                price,

                property_type,

                city,

                status,

                id

            ]


        );




        res.json({

            success:true,

            message:"Hot Sale updated successfully"

        });



    } catch(error){


        console.log(error);


        res.status(500).json({

            success:false,

            message:"Server Error"

        });


    }


};







// ==========================
// Delete Hot Sale
// ==========================

export const deleteHotSale = async(req,res)=>{


    try{


        const {id}=req.params;



        const [existing] = await db.query(

            "SELECT * FROM hot_sales WHERE id=?",

            [id]

        );



        if(existing.length===0){


            return res.status(404).json({

                message:"Property not found"

            });


        }



        await db.query(

            "DELETE FROM hot_sales WHERE id=?",

            [id]

        );



        res.json({

            success:true,

            message:"Hot Sale deleted successfully"

        });



    }catch(error){


        console.log(error);


        res.status(500).json({

            success:false,

            message:"Server Error"

        });


    }


};






// ==========================
// Approve / Reject Hot Sale
// ==========================

export const updatePropertyStatus = async(req,res)=>{


    try{


        const {id}=req.params;


        const {status}=req.body;



        if(
            ![
                "approved",
                "rejected",
                "pending"
            ].includes(status)
        ){

            return res.status(400).json({

                message:"Invalid status"

            });

        }



        await db.query(

            "UPDATE hot_sales SET status=? WHERE id=?",

            [

                status,

                id

            ]

        );



        res.json({

            success:true,

            message:`Property ${status} successfully`

        });



    }catch(error){


        console.log(error);


        res.status(500).json({

            success:false,

            message:"Server Error"

        });


    }


};