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
      images JSON,
      status ENUM('pending','active','closed') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
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
      images,
      status,
    } = req.body;

    const mainImageBuffer = req.file?.buffer ?? null;

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

    const parsedImages = parseJsonField(images);

    const sql = `
      INSERT INTO wanted (
        client_id,
        title,
        description,
        budget,
        preferred_city,
        phone_number,
        main_image,
        images,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(sql, [
      client_id,
      title,
      description || null,
      budget || null,
      preferred_city || null,
      phone_number,
      mainImageBuffer,
      JSON.stringify(parsedImages),
      status || 'active',
    ]);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Wanted request added successfully",
      wantedId: result.insertId,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
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
      SELECT *
      FROM wanted
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        ...row,
        main_image: toImageDataUrl(row.main_image),
        images: parseJsonField(row.images),
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
        images: parseJsonField(row.images),
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
