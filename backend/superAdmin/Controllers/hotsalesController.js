import db from "../../configuration/db.js";



// ==========================
// Add Hot Sale Property
// ==========================

const getValidClientId = async (reqClientId) => {
    if (reqClientId) {
        const [found] = await db.query("SELECT id FROM clients WHERE id = ?", [reqClientId]);
        if (found.length) return found[0].id;
    }
    const [first] = await db.query("SELECT id FROM clients LIMIT 1");
    if (first.length) return first[0].id;
    throw new Error("No client account found. Please create a client account first.");
};

export const addHotSale = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            property_type,
            city,
            Location,
            location,
            map_address,
            area_sqft,
            status,
            client_id,
            main_image
        } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const clientId = await getValidClientId(client_id);
        const loc = Location || location || city || 'Sri Lanka';
        
        let imageBuffer = null;
        if (req.files && req.files.main_image && req.files.main_image[0]) {
            imageBuffer = req.files.main_image[0].buffer;
        } else if (main_image) {
            imageBuffer = main_image;
        } else {
            imageBuffer = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6";
        }

        const extraImages = req.files?.images
            ? req.files.images.map(file => file.buffer ? file.buffer.toString('base64') : file.path)
            : [];

        const sql = `
            INSERT INTO hot_sales
            (
                client_id,
                title,
                description,
                price,
                property_type,
                city,
                Location,
                map_address,
                area_sqft,
                main_image,
                images,
                status
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        await db.query(sql, [
            clientId,
            title,
            description || null,
            price || 0,
            property_type || "House",
            city || "Colombo",
            loc,
            map_address || null,
            area_sqft || null,
            imageBuffer,
            JSON.stringify(extraImages),
            status || "active"
        ]);

        res.status(201).json({
            success: true,
            message: "Hot Sale added successfully"
        });

    } catch (error) {
        console.error("addHotSale error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: " + error.message,
            error: error.message
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

            success: true,

            data: rows

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
                "pending",
                "active",
                "approved",
                "rejected",
                "sold"
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