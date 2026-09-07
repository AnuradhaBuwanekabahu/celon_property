import jwt from "jsonwebtoken";
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

const normalizeEmail = (value) => (value || "").trim().toLowerCase();

const getAuthenticatedOwner = (req) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.role === "user") {
      return {
        type: "user",
        id: decoded.id,
        email: decoded.email,
      };
    }

    if (decoded?.role === "client") {
      return {
        type: "client",
        id: decoded.id,
        email: decoded.email,
      };
    }

    return null;
  } catch {
    return null;
  }
};

const ensureClientForUser = async (user) => {
  if (!user?.email) {
    throw new Error("User email is required to create a wanted request");
  }

  const normalizedEmail = normalizeEmail(user.email);

  const [existingClients] = await db.query(
    "SELECT id, full_name, email FROM clients WHERE email = ? LIMIT 1",
    [normalizedEmail]
  );

  if (existingClients.length > 0) {
    return existingClients[0].id;
  }

  const [result] = await db.query(
    `INSERT INTO clients (full_name, email, password, auth_type, is_active, is_verified)
     VALUES (?, ?, NULL, 'email', 1, 1)`,
    [user.full_name || "User", normalizedEmail]
  );

  return result.insertId;
};

const resolveClientId = async (req, body = {}) => {
  const providedClientId = body.client_id ?? body.clientId ?? req.query?.client_id ?? req.query?.clientId;
  if (providedClientId) return Number(providedClientId);

  const providedUserId = body.user_id ?? body.userId ?? req.query?.user_id ?? req.query?.userId;
  if (providedUserId) {
    const numericUserId = Number(providedUserId);
    if (!Number.isNaN(numericUserId)) {
      const [userRows] = await db.query("SELECT * FROM users WHERE id = ? LIMIT 1", [numericUserId]);
      if (userRows.length > 0) {
        return await ensureClientForUser(userRows[0]);
      }
    }
  }

  const owner = getAuthenticatedOwner(req);
  if (!owner) return null;

  if (owner.type === "client") {
    return Number(owner.id);
  }

  if (owner.type === "user") {
    const [userRows] = await db.query("SELECT * FROM users WHERE id = ? LIMIT 1", [Number(owner.id)]);
    if (userRows.length === 0) {
      throw new Error("User account not found");
    }

    return await ensureClientForUser(userRows[0]);
  }

  return null;
};

const ensureWantedTable = async (connection) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS wanted (
      id INT AUTO_INCREMENT PRIMARY KEY,
      client_id INT NOT NULL,
      limit_id INT NULL,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      budget DECIMAL(12,2),
      preferred_city VARCHAR(100),
      phone_number VARCHAR(20) NOT NULL,
      days INT NOT NULL DEFAULT 30,
      expires_at TIMESTAMP NULL,
      status ENUM('pending','active','closed','expired') DEFAULT 'active',
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

/**
 * Fetches gallery images for one or more wanted requests and returns them
 * grouped by wanted_id, e.g. { 12: [{ id, url }], 13: [...] }
 */
const getWantedGalleryImages = async (wantedIds) => {
  if (!wantedIds || wantedIds.length === 0) return {};

  const [rows] = await db.query(
    `SELECT id, wanted_id, image FROM wanted_images WHERE wanted_id IN (?) ORDER BY id ASC`,
    [wantedIds]
  );

  return rows.reduce((acc, row) => {
    if (!acc[row.wanted_id]) acc[row.wanted_id] = [];
    acc[row.wanted_id].push({
      id: row.id,
      url: toImageDataUrl(row.image),
    });
    return acc;
  }, {});
};

export const addWanted = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    await ensureWantedTable(connection);

    const body = req.body || {};
    const clientId = await resolveClientId(req, body);

    if (!clientId) {
      await connection.rollback();
      return res.status(401).json({
        success: false,
        message: "Please log in with a user or client account to add a wanted request",
      });
    }

    const title = (body.title || "").trim();
    const description = (body.description || "").trim();
    const budget = body.budget || null;
    const preferredCity = (body.preferred_city || body.preferredCity || "").trim();
    const phoneNumber = (body.phone_number || body.phoneNumber || "").trim();
    const days = Number(body.days || 30);
    const status = body.status || "active";

    if (!title) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    if (!phoneNumber) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const [result] = await connection.query(
      `INSERT INTO wanted (client_id, title, description, budget, preferred_city, phone_number, days, expires_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [
        clientId,
        title,
        description || null,
        budget || null,
        preferredCity || null,
        phoneNumber,
        days,
        days,
        status,
      ]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Wanted request added successfully",
      wantedId: result.insertId,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("ADD WANTED ERROR:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  } finally {
    if (connection) connection.release();
  }
};

export const showAllWanted = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM wanted ORDER BY created_at DESC`
    );

    const galleryMap = await getWantedGalleryImages(rows.map((row) => row.id));

    return res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        ...row,
        gallery_images: galleryMap[row.id] || [],
      })),
    });
  } catch (error) {
    console.error("GET WANTEDS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const showWantedByUserId = async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id) {
      return res.status(400).json({ success: false, message: "User or client id is required" });
    }

    const [rows] = await db.query(
      `SELECT * FROM wanted WHERE client_id = ? ORDER BY created_at DESC`,
      [Number(id)]
    );

    const galleryMap = await getWantedGalleryImages(rows.map((row) => row.id));

    return res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        ...row,
        gallery_images: galleryMap[row.id] || [],
      })),
    });
  } catch (error) {
    console.error("GET USER WANTEDS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const deleteWanted = async (req, res) => {
  try {
    const { id } = req.params || {};
    const [result] = await db.query("DELETE FROM wanted WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Wanted request not found" });
    }

    return res.status(200).json({ success: true, message: "Wanted request deleted successfully" });
  } catch (error) {
    console.error("DELETE WANTED ERROR:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};