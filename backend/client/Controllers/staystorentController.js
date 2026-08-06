import db from "../../configuration/db.js";

const toImageDataUrl = (value, mimeType = "image/jpeg") => {
  if (!value) return null;

  if (typeof value === "string") {
    if (value.startsWith("data:")) return value;
    return `data:${mimeType};base64,${value}`;
  }

  if (Buffer.isBuffer(value)) {
    return `data:${mimeType};base64,${value.toString("base64")}`;
  }

  if (value?.type === "Buffer" && Array.isArray(value.data)) {
    return `data:${mimeType};base64,${Buffer.from(value.data).toString("base64")}`;
  }

  return null;
};


const parseJsonField = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};


const serializeStayToRentRow = (row) => {

  const parsedImages = parseJsonField(row.images);

  return {
    ...row,

    main_image: toImageDataUrl(row.main_image),

    main_video: row.main_video
      ? toImageDataUrl(row.main_video, "video/mp4")
      : null,

    images: parsedImages.map(img => 
      toImageDataUrl(img)
    )
  };
};



const ensureStayToRentTable = async(connection)=>{

await connection.query(`

CREATE TABLE IF NOT EXISTS stays_to_rent(

id INT AUTO_INCREMENT PRIMARY KEY,

client_id INT NOT NULL,

title VARCHAR(150) NOT NULL,

description TEXT,

overview JSON,

price DECIMAL(12,2) NOT NULL,

property_type VARCHAR(50) NOT NULL,

highlights JSON,

area_sqft DECIMAL(10,2),

main_video LONGBLOB,

duration ENUM(
'permanent',
'month',
'year',
'week',
'day'
),

city VARCHAR(100) NOT NULL,

map_address VARCHAR(255),

rate DECIMAL(2,1) DEFAULT 0.0,

location VARCHAR(255),

main_image LONGBLOB NOT NULL,

images JSON,

status ENUM(
'pending',
'active',
'sold'
)
DEFAULT 'pending',

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP,


FOREIGN KEY(client_id)
REFERENCES clients(id)
ON DELETE CASCADE

)

`);

};



// ADD PROPERTY

export const addStayToRent = async(req,res)=>{

let connection;


try{

connection = await db.getConnection();

await connection.beginTransaction();


await ensureStayToRentTable(connection);



const {
client_id,
title,
description,
overview,
price,
property_type,
highlights,
area_sqft,
city,
map_address,
location,
duration
}=req.body;



if(
!client_id ||
!title ||
!price ||
!property_type ||
!city
){

await connection.rollback();

return res.status(400).json({
success:false,
message:"Please fill required fields"
});

}



const mainImage =
req.files?.main_image?.[0]?.buffer;


const mainVideo =
req.files?.main_video?.[0]?.buffer || null;



if(!mainImage){

await connection.rollback();

return res.status(400).json({
success:false,
message:"Main image required"
});

}



const galleryImages =
req.files?.images?.map(
img=>img.buffer
) || [];




await connection.query(

`

INSERT INTO stays_to_rent

(
client_id,
title,
description,
overview,
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
duration
)

VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)

`,

[

client_id,

title,

description,

JSON.stringify(parseJsonField(overview)),

price,

property_type,

JSON.stringify(parseJsonField(highlights)),

area_sqft || null,

city,

map_address,

location,

mainImage,

mainVideo,

JSON.stringify(galleryImages),

duration || "permanent"

]

);



await connection.commit();


res.status(201).json({

success:true,

message:"Stay To Rent added successfully"

});


}

catch(error){

if(connection)
await connection.rollback();


console.log(error);


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





// GET ALL


export const getAllStayToRent = async(req,res)=>{


try{


const [rows] = await db.query(`
    SELECT *
    FROM stays_to_rent
    ORDER BY created_at DESC
  `);



res.json({

success:true,

data:(rows || []).map(serializeStayToRentRow)

});


}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}


};





// GET SINGLE


export const getStayToRentById = async(req,res)=>{


try{


const {id}=req.params;



const [rows]=await db.query(

"SELECT * FROM stays_to_rent WHERE id=?",

[id]

);



if(rows.length===0){

return res.status(404).json({

success:false,

message:"Property not found"

});

}



res.json({

success:true,

data:serializeStayToRentRow(rows[0])

});


}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}


};





// UPDATE

export const updateStayToRent = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    await ensureStayToRentTable(connection);

    const { id } = req.params;
    const {
      client_id,
      title,
      description,
      overview,
      price,
      property_type,
      highlights,
      area_sqft,
      city,
      map_address,
      location,
      duration,
      status,
    } = req.body;

    const updates = [];
    const values = [];

    if (client_id !== undefined) {
      updates.push("client_id = ?");
      values.push(client_id);
    }

    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title);
    }

    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }

    if (overview !== undefined) {
      updates.push("overview = ?");
      values.push(JSON.stringify(parseJsonField(overview)));
    }

    if (price !== undefined) {
      updates.push("price = ?");
      values.push(price);
    }

    if (property_type !== undefined) {
      updates.push("property_type = ?");
      values.push(property_type);
    }

    if (highlights !== undefined) {
      updates.push("highlights = ?");
      values.push(JSON.stringify(parseJsonField(highlights)));
    }

    if (area_sqft !== undefined) {
      updates.push("area_sqft = ?");
      values.push(area_sqft || null);
    }

    if (city !== undefined) {
      updates.push("city = ?");
      values.push(city);
    }

    if (map_address !== undefined) {
      updates.push("map_address = ?");
      values.push(map_address);
    }

    if (location !== undefined) {
      updates.push("location = ?");
      values.push(location);
    }

    if (duration !== undefined) {
      updates.push("duration = ?");
      values.push(duration || "permanent");
    }

    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    const mainImage = req.files?.main_image?.[0]?.buffer;
    if (mainImage) {
      updates.push("main_image = ?");
      values.push(mainImage);
    }

    const mainVideo = req.files?.main_video?.[0]?.buffer;
    if (mainVideo !== undefined) {
      updates.push("main_video = ?");
      values.push(mainVideo || null);
    }

    const galleryImages = req.files?.images?.map((img) => img.buffer) || [];
    if (galleryImages.length > 0) {
      updates.push("images = ?");
      values.push(JSON.stringify(galleryImages));
    }

    if (updates.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    values.push(id);

    await connection.query(
      `UPDATE stays_to_rent SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Stay To Rent updated successfully",
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

// DELETE


export const deleteStayToRent = async(req,res)=>{


try{


const {id}=req.params;



const [result]=await db.query(

"DELETE FROM stays_to_rent WHERE id=?",

[id]

);



if(result.affectedRows===0){

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