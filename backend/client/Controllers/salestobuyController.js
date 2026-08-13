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

const serializeStayToBuyRow = (row) => {
  const parsedImages = parseJsonField(row.images);

  return {
    ...row,
    main_image: toImageDataUrl(row.main_image),
    main_video: row.main_video ? toImageDataUrl(row.main_video, "video/mp4") : null,
    images: Array.isArray(parsedImages)
      ? parsedImages.map((image) => toImageDataUrl(image))
      : [],
  };
};

const ensureStayToBuyTable = async (connection) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS stays_to_buy (
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
      duration ENUM('permanent','month','year','week','day'),
      city VARCHAR(100) NOT NULL,
      map_address VARCHAR(255),
      rate DECIMAL(2,1) DEFAULT 0.0,
      location VARCHAR(255),
      main_image LONGBLOB NOT NULL,
      images JSON,
      status ENUM('pending','active','sold') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
    )
  `);
};

export const addStayToBuy = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    await ensureStayToBuyTable(connection);

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
    } = req.body;

    if (!client_id || !title || !price || !property_type || !city) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const mainImageBuffer = req.files?.main_image?.[0]?.buffer ?? null;
    const mainVideoBuffer = req.files?.main_video?.[0]?.buffer ?? null;

    if (!mainImageBuffer) {
      return res.status(400).json({
        success: false,
        message: "Main image is required.",
      });
    }

    let imageBuffers = [];
    if (req.files?.images?.length > 0) {
      imageBuffers = req.files.images.map((img) => img.buffer);
    }

    const sql = `
      INSERT INTO stays_to_buy
      (
        client_id, title, description, overview, price, property_type,
        highlights, area_sqft, city, map_address, location,
        main_image, main_video, images, duration
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.query(sql, [
      client_id,
      title,
      description,
      overview ? JSON.stringify(JSON.parse(overview)) : JSON.stringify([]),
      price,
      property_type,
      highlights ? JSON.stringify(JSON.parse(highlights)) : JSON.stringify([]),
      area_sqft || null,
      city,
      map_address,
      location,
      mainImageBuffer,
      mainVideoBuffer,
      JSON.stringify(imageBuffers),
      duration || 'permanent',
    ]);

    await connection.commit();
    res.status(201).json({ success: true, message: "Stay To Buy added successfully." });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) connection.release();
  }
};


export const showAllStayToBuy = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        s.*,
        c.full_name,
        c.email,
        c.phone_number
      FROM stays_to_buy s
      JOIN clients c
      ON s.client_id = c.id
      ORDER BY s.created_at DESC
    `);

    res.json({
      success: true,
      data: rows.map(serializeStayToBuyRow),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllStayToBuy = async (req, res) => {
  return showAllStayToBuy(req, res);
};

// ==============================
// Get Single Stay To Buy
// ==============================
export const getStayToBuyById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM stays_to_buy WHERE id=?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    res.json({
      success: true,
      data: serializeStayToBuyRow(rows[0]),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Stay To Buy
// ==============================
export const updateStayToBuy = async (req, res) => {
  try {
    const { id } = req.params;

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
      duration,
    } = req.body;

    let mainImage = null;
    let mainVideo = null;

    if (req.files?.main_image?.length > 0) {
      mainImage = req.files.main_image[0].path;
    }

    if (req.files?.main_video?.length > 0) {
      mainVideo = req.files.main_video[0].path;
    }

    let images = [];

    if (req.files?.images?.length > 0) {
      images = req.files.images.map((img) => img.path);
    }

    const sql = `
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
      main_image=COALESCE(?, main_image),
      main_video=COALESCE(?, main_video),
      images=CASE
          WHEN ? IS NULL THEN images
          ELSE ?
      END
      WHERE id=?
    `;

    await db.query(sql, [
      title,
      description,
      price,
      property_type,
      highlights ? JSON.stringify(JSON.parse(highlights)) : JSON.stringify([]),
      area_sqft,
      city,
      map_address,
      location,
      status,
      duration || 'month',
      mainImage,
      mainVideo,
      images.length ? JSON.stringify(images) : null,
      images.length ? JSON.stringify(images) : null,
      id,
    ]);

    res.json({
      success: true,
      message: "Property updated successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Stay To Buy
// ==============================
export const deleteStayToBuy = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM stays_to_buy WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    res.json({
      success: true,
      message: "Property deleted successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};