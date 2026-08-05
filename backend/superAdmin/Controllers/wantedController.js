import db from "../../configuration/db.js";

export const normalizeWantedPayload = (payload = {}) => {
  const normalized = { ...payload };

  if (!normalized.phone_number && normalized.Phone_number) {
    normalized.phone_number = normalized.Phone_number;
  }

  if (!normalized.preferred_city && normalized.Preferred_city) {
    normalized.preferred_city = normalized.Preferred_city;
  }

  if (!normalized.phone_number && normalized.phone) {
    normalized.phone_number = normalized.phone;
  }

  if (!normalized.preferred_city && normalized.city) {
    normalized.preferred_city = normalized.city;
  }

  return normalized;
};

export const getWanted = async (req, res) => {
  try {
    const status = req.params?.status || req.query?.status;
    const search = req.query?.search;

    let query = `
      SELECT
        id,
        client_id,
        title,
        description,
        budget,
        preferred_city,
        phone_number,
        main_image,
        images,
        status,
        created_at,
        updated_at
      FROM wanted
    `;
    const values = [];

    if (status) {
      query += ` WHERE status = ?`;
      values.push(status);
    }

    if (search) {
      const clause = status ? ' AND ' : ' WHERE ';
      query += `${clause} (title LIKE ? OR preferred_city LIKE ? OR description LIKE ?)`;
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await db.query(query, values);

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getValidClientId = async (reqClientId) => {
    if (reqClientId) {
        const [found] = await db.query("SELECT id FROM clients WHERE id = ?", [reqClientId]);
        if (found.length) return found[0].id;
    }
    const [first] = await db.query("SELECT id FROM clients LIMIT 1");
    if (first.length) return first[0].id;
    throw new Error("No client account found. Please create a client account first.");
};

export const createWanted = async (req, res) => {
  try {
    const payload = normalizeWantedPayload(req.body);
    const {
      client_id,
      title,
      description,
      budget,
      preferred_city,
      phone_number,
      main_image,
      status
    } = payload;

    const clientId = await getValidClientId(client_id);
    const phone = phone_number || '0700000000';

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const [result] = await db.query(
      `INSERT INTO wanted (client_id, title, description, budget, preferred_city, Phone_number, main_image, images, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [clientId, title, description || null, budget || null, preferred_city || null, phone, main_image || null, JSON.stringify(req.files?.images ? req.files.images.map(img => img.path || img.buffer?.toString('base64')) : []), status || 'active']
    );

    res.status(201).json({ success: true, message: "Wanted listing created", data: { id: result.insertId } });
  } catch (error) {
    console.error("createWanted error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWanted = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = normalizeWantedPayload(req.body);
    const {
      client_id,
      title,
      description,
      budget,
      preferred_city,
      phone_number,
      main_image,
      status
    } = payload;

    const [existing] = await db.query('SELECT id FROM wanted WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Wanted request not found' });
    }

    await db.query(
      `UPDATE wanted SET client_id=?, title=?, description=?, budget=?, preferred_city=?, Phone_number=?, main_image=?, images=?, status=? WHERE id=?`,
      [(await getValidClientId(client_id)), title, description || null, budget || null, preferred_city || null, phone, main_image || null, JSON.stringify(req.files?.images ? req.files.images.map(img => img.path || img.buffer?.toString('base64')) : []), status || 'active', id]
    );

    res.status(200).json({ success: true, message: 'Wanted request updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteWanted = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM wanted WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Wanted request not found' });
    }

    res.status(200).json({ success: true, message: 'Wanted request deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWantedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'active', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await db.query('UPDATE wanted SET status = ? WHERE id = ?', [status, id]);
    res.status(200).json({ success: true, message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
