import db from "../../configuration/db.js";




// ===============================
// ADD LAND
// ===============================

const getValidClientId = async (reqClientId) => {
    if (reqClientId) {
        const [found] = await db.query("SELECT id FROM clients WHERE id = ?", [reqClientId]);
        if (found.length) return found[0].id;
    }
    const [first] = await db.query("SELECT id FROM clients LIMIT 1");
    if (first.length) return first[0].id;
    throw new Error("No client account found. Please create a client account first.");
};

export const addLands = async (req, res) => {
    try {
        const {
            client_id,
            title,
            description,
            price,
            land_size,
            size_unit,
            Location,
            location,
            city,
            status,
            main_image
        } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const clientId = await getValidClientId(client_id);
        const loc = Location || location || city || 'Sri Lanka';
        const mainImg = req.files?.main_image?.[0]?.path || req.files?.main_image?.[0]?.buffer?.toString('base64') || main_image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef";
        const extraImages = req.files?.images ? req.files.images.map(img => img.path || img.buffer?.toString('base64')) : [];

        const [result] = await db.query(
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
                main_image,
                images,
                status
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
            `,
            [
                clientId,
                title,
                description || null,
                price || 0,
                land_size || 0,
                size_unit || "perches",
                loc,
                city || "Colombo",
                mainImg,
                JSON.stringify(extraImages),
                status || "active"
            ]
        );

        res.status(201).json({
            success: true,
            message: "Land added successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error("addLands error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
            error: error.message
        });
    }
};







// ===============================
// GET ALL LANDS
// ===============================


export const getlands = async(req,res)=>{


    try{

        const status = req.params?.status || req.query?.status;
        const search = req.query?.search;

        let query = `
            SELECT *

            FROM land
        `;
        const values = [];

        if (status) {
            query += ` WHERE status = ?`;
            values.push(status);
        }

        if (search) {
            const clause = status ? ' AND ' : ' WHERE ';
            query += `${clause} (title LIKE ? OR city LIKE ? OR location LIKE ?)`;
            values.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY created_at DESC`;

        const [lands] = await db.query(query, values);



        res.json({

            success:true,
            data: lands,
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
            status
        } = req.body;





        await db.query(

            `
            UPDATE land SET
                title = ?,
                description = ?,
                price = ?,
                land_size = ?,
                size_unit = ?,
                location = ?,
                city = ?,
                status = ?
            WHERE id = ?
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