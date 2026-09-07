import db from "../../configuration/db.js";
import { getApplicableLimit, publicLimitInfo } from '../utils/limitUtils.js';

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

const serializeStayToBuyRow = (row, images = []) => {
  return {
    ...row,
    main_image: toImageDataUrl(row.main_image),
    main_video: row.main_video ? toImageDataUrl(row.main_video, "video/mp4") : null,
    images: images.map((image) => toImageDataUrl(image.image)),
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
      district VARCHAR(100) NOT NULL,
      address VARCHAR(255) NOT NULL,
      main_video LONGBLOB,
      duration ENUM('permanent','month','year','week','day'),
      city VARCHAR(100) NOT NULL,
      map_address VARCHAR(255),
      rate DECIMAL(2,1) DEFAULT 0.0,
      main_image LONGBLOB NOT NULL,
      status ENUM('pending','active','sold') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS stay_to_buy_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      stay_buy_id INT NOT NULL,
      image LONGBLOB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(stay_buy_id) REFERENCES stays_to_buy(id) ON DELETE CASCADE
    )
  `);
};

const getGalleryImages = async (ids, connection = db) => {
  if (!ids.length) return new Map();

  const [rows] = await connection.query(
    "SELECT stay_buy_id, image FROM stay_to_buy_images WHERE stay_buy_id IN (?) ORDER BY id",
    [ids]
  );
  const images = new Map();

  for (const row of rows) {
    if (!images.has(row.stay_buy_id)) images.set(row.stay_buy_id, []);
    images.get(row.stay_buy_id).push(row);
  }

  return images;
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
      district,
      city,
      address,
      map_address,
      duration,
      rate,
      days,
    } = req.body;

    if (!client_id || !title || !price || !property_type || !district || !city || !address) {
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

    const limitInfo = await getApplicableLimit(connection, client_id);
    const listingDays = Number(limitInfo.applicableLimit.days);
    const expiresAt = new Date(Date.now() + (listingDays * 24 * 60 * 60 * 1000));
    const listingStatus = Number(limitInfo.applicableLimit.price) > 0 ? 'pending' : 'active';

    const sql = `
      INSERT INTO stays_to_buy
      (
        client_id, limit_id, title, description, overview, price, property_type,
        highlights, area_sqft, district, city, address, map_address,
        main_image, main_video, duration, rate, days, expires_at, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(sql, [
      client_id,
      limitInfo.applicableLimit.id,
      title,
      description,
      overview ? JSON.stringify(JSON.parse(overview)) : JSON.stringify([]),
      price,
      property_type,
      highlights ? JSON.stringify(JSON.parse(highlights)) : JSON.stringify([]),
      area_sqft || null,
      district,
      city,
      address,
      map_address,
      mainImageBuffer,
      mainVideoBuffer,
      duration || 'permanent',
      rate || null,
      listingDays,
      expiresAt,
      listingStatus,
    ]);

    for (const image of imageBuffers) {
      await connection.query(
        "INSERT INTO stay_to_buy_images (stay_buy_id, image) VALUES (?, ?)",
        [result.insertId, image]
      );
    }

    let paymentId = null;
    if (Number(limitInfo.applicableLimit.price) > 0) {
      const [paymentResult] = await connection.query(
        `INSERT INTO payments (client_id, property_type, property_id, amount, status, created_at)
         VALUES (?, 'stays_to_buy', ?, ?, 'pending', NOW())`,
        [client_id, result.insertId, Number(limitInfo.applicableLimit.price)]
      );
      paymentId = paymentResult.insertId;
    }

    if (Number(limitInfo.applicableLimit.price) === 0) {
      await connection.query(
        `UPDATE clients SET total_ads_count = total_ads_count + 1 WHERE id = ?`,
        [client_id]
      );
    }

    await connection.commit();
    res.status(201).json({ success: true, message: "Stay To Buy added successfully.", status: listingStatus, payment_id: paymentId, tier: publicLimitInfo(limitInfo.applicableLimit) });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error(error);
    res.status(error.code === 'NO_TIER_AVAILABLE' ? 409 : 500).json({ success: false, message: error.message });
  } finally {
    if (connection) connection.release();
  }
};


export const showAllStayToBuy = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        s.*,
        CASE
          WHEN s.expires_at IS NULL THEN NULL
          WHEN DATEDIFF(s.expires_at, CURRENT_TIMESTAMP) < 0 THEN 0
          ELSE DATEDIFF(s.expires_at, CURRENT_TIMESTAMP)
        END AS remaining_days,
        (s.expires_at IS NOT NULL AND DATEDIFF(s.expires_at, CURRENT_TIMESTAMP) <= 0 AND s.status <> 'expired') AS needs_expiry_update,
        c.full_name,
        c.email,
        c.phone_number
      FROM stays_to_buy s
      JOIN clients c
      ON s.client_id = c.id
      ORDER BY s.created_at DESC
    `);

    const gallery = await getGalleryImages(rows.map((row) => row.id));
    res.json({
      success: true,
      data: rows.map((row) => serializeStayToBuyRow(row, gallery.get(row.id) || [])),
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

    const gallery = await getGalleryImages([rows[0].id]);
    res.json({
      success: true,
      data: serializeStayToBuyRow(rows[0], gallery.get(rows[0].id) || []),
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
      district,
      city,
      address,
      map_address,
      status,
      duration,
      rate,
      overview,
    } = req.body;

    let mainImage = null;
    let mainVideo = null;

    if (req.files?.main_image?.length > 0) {
      mainImage = req.files.main_image[0].buffer;
    }

    if (req.files?.main_video?.length > 0) {
      mainVideo = req.files.main_video[0].buffer;
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
      district=?,
      city=?,
      address=?,
      map_address=?,
      status=?,
      duration=?,
      rate=?,
      overview=?,
      main_image=COALESCE(?, main_image),
        main_video=COALESCE(?, main_video)
      WHERE id=?
    `;

    await db.query(sql, [
      title,
      description,
      price,
      property_type,
      highlights ? JSON.stringify(JSON.parse(highlights)) : JSON.stringify([]),
      area_sqft,
      district,
      city,
      address,
      map_address,
      status,
      duration || 'month',
      rate,
      overview ? JSON.stringify(JSON.parse(overview)) : JSON.stringify([]),
      mainImage,
      mainVideo,
      id,
    ]);

    if (req.files?.images?.length > 0) {
      await db.query("DELETE FROM stay_to_buy_images WHERE stay_buy_id = ?", [id]);
      for (const image of req.files.images) {
        await db.query(
          "INSERT INTO stay_to_buy_images (stay_buy_id, image) VALUES (?, ?)",
          [id, image.buffer]
        );
      }
    }

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