import db from "../../configuration/db.js";

const MAX_MEDIA_BYTES = 12 * 1024 * 1024;

const validateMediaSize = (files = {}) => {
    const uploadedFiles = Object.values(files).flat().filter(Boolean);
    const oversizedFile = uploadedFiles.find((file) => file.size > MAX_MEDIA_BYTES);
    return oversizedFile ? `File ${oversizedFile.originalname || "upload"} is too large. Use files smaller than 12 MB.` : null;
};




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
    const mediaError = validateMediaSize(req.files);
    if (mediaError) return res.status(413).json({ success: false, message: mediaError });

        const {
            client_id,
            title,
            description,
            price,
            rate,
            land_size,
            size_unit,
            district,
            city,
            address,
            map_address,
            duration,
            days,
            overview,
            status,
            main_image,
            location
        } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const clientId = await getValidClientId(client_id);
        const districtValue = district || location || city || 'Colombo';
        const addressValue = address || location || 'Address not provided';
        const overviewJson = overview ? (typeof overview === 'string' ? overview : JSON.stringify(overview)) : '[]';

        let mainImg = null;
        if (req.files?.main_image?.[0]) {
            const file = req.files.main_image[0];
            mainImg = file.buffer || file.path || main_image;
        } else if (main_image) {
            mainImg = main_image;
        } else {
            mainImg = "https://images.unsplash.com/photo-1500382017468-9049fed747ef";
        }

        let mainVid = null;
        if (req.files?.main_video?.[0]) {
            const file = req.files.main_video[0];
            mainVid = file.buffer || file.path;
        }

        const [result] = await db.query(
            `
            INSERT INTO land
            (
                client_id,
                title,
                description,
                price,
                rate,
                overview,
                land_size,
                size_unit,
                duration,
                days,
                address,
                district,
                map_address,
                city,
                main_image,
                main_video,
                status
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `,
            [
                clientId,
                title,
                description || null,
                price || 0,
                rate || 0,
                overviewJson,
                land_size || 0,
                size_unit || "perches",
                duration || "month",
                Number(days) || 30,
                addressValue,
                districtValue,
                map_address || null,
                city || "Colombo",
                mainImg,
                mainVid,
                status || "pending"
            ]
        );

        if (req.files?.images?.length) {
            for (const file of req.files.images) {
                await db.query("INSERT INTO land_images (land_id, image) VALUES (?, ?)", [result.insertId, file.buffer]);
            }
        }

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
            query += `${clause} (title LIKE ? OR city LIKE ? OR address LIKE ? OR district LIKE ?)`;
            values.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
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
            rate,
            land_size,
            size_unit,
            location,
            district,
            address,
            city,
            map_address,
            duration,
            overview,
            status
        } = req.body;

        const [existing] = await db.query("SELECT * FROM land WHERE id = ?", [id]);
        if (!existing.length) {
            return res.status(404).json({ success: false, message: "Land not found" });
        }

        const districtValue = district || location || existing[0].district || 'Colombo';
        const addressValue = address || location || existing[0].address || 'Address not provided';
        const overviewJson = overview ? (typeof overview === 'string' ? overview : JSON.stringify(overview)) : (existing[0].overview || '[]');

        await db.query(
            `
            UPDATE land SET
                title = ?,
                description = ?,
                price = ?,
                rate = ?,
                overview = ?,
                land_size = ?,
                size_unit = ?,
                duration = ?,
                address = ?,
                district = ?,
                map_address = ?,
                city = ?,
                status = ?
            WHERE id = ?
            `,
            [
                title || existing[0].title,
                description ?? existing[0].description,
                price ?? existing[0].price,
                rate ?? existing[0].rate,
                overviewJson,
                land_size ?? existing[0].land_size,
                size_unit || existing[0].size_unit,
                duration || existing[0].duration || 'month',
                addressValue,
                districtValue,
                map_address ?? existing[0].map_address,
                city || existing[0].city,
                status || existing[0].status,
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