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

const ensureWantedTable = async (connection) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS wanted (
      id INT AUTO_INCREMENT PRIMARY KEY,
      client_id INT NOT NULL,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      budget DECIMAL(12,2),
      preferred_city VARCHAR(100),
      phone_number VARCHAR(20) NOT NULL,
      main_image LONGBLOB,
      status ENUM('pending','active','closed') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS wanted_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      wanted_id INT NOT NULL,
      image LONGBLOB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (wanted_id) REFERENCES wanted(id) ON DELETE CASCADE
    )
  `);
};

export const addWanted = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    await ensureWantedTable(connection);

    const {
      client_id,
      title,
      description,
      budget,
      preferred_city,
      phone_number,
      status,
      days,
    } = req.body;

    const mainImageBuffer = req.file?.buffer ?? req.files?.main_image?.[0]?.buffer ?? null;
    const galleryImageFiles = req.files?.images || req.files?.gallery_images || [];

    if (!client_id || !title || !phone_number) {
      return res.status(400).json({
        success: false,
        message: "client_id, title, and phone_number are required",
      });
    }

    if (!mainImageBuffer) {
      return res.status(400).json({
        success: false,
        message: "main_image file is required",
      });
    }

    const limitInfo = await getApplicableLimit(connection, client_id);
    const listingDays = Number(limitInfo.applicableLimit.days);
    const expiresAt = new Date(Date.now() + (listingDays * 24 * 60 * 60 * 1000));
    const listingStatus = Number(limitInfo.applicableLimit.price) > 0 ? 'pending' : 'active';

    const sql = `
      INSERT INTO wanted (
        client_id,
        limit_id,
        title,
        description,
        budget,
        preferred_city,
        phone_number,
        main_image,
        status,
        days,
        expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(sql, [
      client_id,
      limitInfo.applicableLimit.id,
      title,
      description || null,
      budget || null,
      preferred_city || null,
      phone_number,
      mainImageBuffer,
      listingStatus,
      listingDays,
      expiresAt,
    ]);

    const wantedId = result.insertId;

    if (galleryImageFiles.length > 0) {
      for (const imageFile of galleryImageFiles) {
        if (imageFile?.buffer) {
          await connection.query(
            `INSERT INTO wanted_images (wanted_id, image) VALUES (?, ?)`,
            [wantedId, imageFile.buffer]
          );
        }
      }
    }

    let paymentId = null;
    if (Number(limitInfo.applicableLimit.price) > 0) {
      const [paymentResult] = await connection.query(
        `INSERT INTO payments (client_id, property_type, property_id, amount, status, created_at)
         VALUES (?, 'wanted', ?, ?, 'pending', NOW())`,
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

    res.status(201).json({
      success: true,
      message: "Wanted request added successfully",
      wantedId: result.insertId,
      status: listingStatus,
      payment_id: paymentId,
      tier: publicLimitInfo(limitInfo.applicableLimit),
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error(error);
    res.status(error.code === 'NO_TIER_AVAILABLE' ? 409 : 500).json({ success: false, message: error.message });
  } finally {
    if (connection) connection.release();
  }
};

export const showAllWanted = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await ensureWantedTable(connection);

    const [rows] = await connection.query(`
      SELECT
        w.*,
        CASE
          WHEN w.expires_at IS NULL THEN NULL
          WHEN DATEDIFF(w.expires_at, CURRENT_TIMESTAMP) < 0 THEN 0
          ELSE DATEDIFF(w.expires_at, CURRENT_TIMESTAMP)
        END AS remaining_days,
        (w.expires_at IS NOT NULL AND DATEDIFF(w.expires_at, CURRENT_TIMESTAMP) <= 0 AND w.status <> 'expired') AS needs_expiry_update
      FROM wanted w
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        ...row,
        main_image: toImageDataUrl(row.main_image),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) connection.release();
  }
};

export const showWantedByUserId = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await ensureWantedTable(connection);

    const { id } = req.params;

    const [rows] = await connection.query(
      `SELECT * FROM wanted WHERE client_id = ? ORDER BY created_at DESC`,
      [id]
    );

    res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        ...row,
        main_image: toImageDataUrl(row.main_image),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) connection.release();
  }
};

export const deleteWanted = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(`DELETE FROM wanted WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Wanted request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wanted request deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
