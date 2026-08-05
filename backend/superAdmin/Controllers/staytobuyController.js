import db from "../../configuration/db.js";


// ==========================================
// ADD STAY TO BUY (SUPER ADMIN)
// ==========================================

const getValidClientId = async (reqClientId) => {
    if (reqClientId) {
        const [found] = await db.query("SELECT id FROM clients WHERE id = ?", [reqClientId]);
        if (found.length) return found[0].id;
    }
    const [first] = await db.query("SELECT id FROM clients LIMIT 1");
    if (first.length) return first[0].id;
    throw new Error("No client account found. Please create a client account first.");
};

export const addStayToBuy = async (req, res) => {
    try {
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
            Location,
            location,
            status,
            main_image
        } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const clientId = await getValidClientId(client_id);
        const loc = Location || location || city || 'Sri Lanka';
        const mainImg = req.files?.main_image?.[0]?.path || req.files?.main_image?.[0]?.buffer?.toString('base64') || main_image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";
        const extraImages = req.files?.images ? req.files.images.map(img => img.path || img.buffer?.toString('base64')) : [];

        const sql = `
            INSERT INTO stays_to_buy
            (
                client_id,
                title,
                description,
                price,
                property_type,
                Highlights,
                area_sqft,
                city,
                map_address,
                Location,
                main_image,
                images,
                status
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        const [result] = await db.query(sql, [
            clientId,
            title,
            description || null,
            price || 0,
            property_type || "House",
            highlights ? JSON.stringify(highlights) : JSON.stringify([]),
            area_sqft || null,
            city || "Colombo",
            map_address || null,
            loc,
            mainImg,
            JSON.stringify(extraImages),
            status || "active"
        ]);

        res.status(201).json({
            success: true,
            message: "Stay To Buy added successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error("addStayToBuy error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
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
            status
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