import db from "../../configuration/db.js";

// ==============================
// Add Stay To Buy
// ==============================
export const addStayToBuy = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

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
      location,
    } = req.body;

    // Validation
    if (
      !client_id ||
      !title ||
      !price ||
      !property_type ||
      !city
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Main Image
    let mainImage = null;
    if (req.files?.main_image?.length > 0) {
      mainImage = req.files.main_image[0].filename;
    }

    if (!mainImage) {
      return res.status(400).json({
        success: false,
        message: "Main image is required.",
      });
    }

    // Additional Images
    let images = [];

    if (req.files?.images?.length > 0) {
      images = req.files.images.map((img) => img.filename);
    }

    const sql = `
      INSERT INTO stays_to_buy
      (
        client_id,
        title,
        description,
        price,
        property_type,
        highlights,
        area_sqft,
        city,
        map_address,
        location,
        main_image,
        images
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.query(sql, [
      client_id,
      title,
      description,
      price,
      property_type,
      highlights ? JSON.stringify(JSON.parse(highlights)) : JSON.stringify([]),
      area_sqft || null,
      city,
      map_address,
      location,
      mainImage,
      JSON.stringify(images),
    ]);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Stay To Buy added successfully.",
    });
  } catch (error) {
    if (connection) await connection.rollback();

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

// ==============================
// Get All Stay To Buy
// ==============================
export const getAllStayToBuy = async (req, res) => {
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
      data: rows,
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
      data: rows[0],
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
    } = req.body;

    let mainImage = null;

    if (req.files?.main_image?.length > 0) {
      mainImage = req.files.main_image[0].filename;
    }

    let images = [];

    if (req.files?.images?.length > 0) {
      images = req.files.images.map((img) => img.filename);
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
      main_image=COALESCE(?, main_image),
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
      mainImage,
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