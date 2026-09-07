import db from "../../configuration/db.js";
import { getApplicableLimit, publicLimitInfo } from '../utils/limitUtils.js';

/* =========================================================
   HELPERS
========================================================= */

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

const serializeStayToRentRow = (row, images = []) => {
  return {
    ...row,

    main_image: toImageDataUrl(row.main_image),

    main_video: row.main_video
      ? toImageDataUrl(row.main_video, "video/mp4")
      : null,

    images: images.map((image) => toImageDataUrl(image.image)),
  };
};


/* =========================================================
   CREATE TABLES
========================================================= */

const ensureStayToRentTable = async (connection) => {

  await connection.query(`
    CREATE TABLE IF NOT EXISTS stays_to_rent (

      id INT AUTO_INCREMENT PRIMARY KEY,

      client_id INT NOT NULL,

      title VARCHAR(150) NOT NULL,

      description TEXT,

      price DECIMAL(12,2) NOT NULL,

      overview JSON,

      duration ENUM(
        'permanent',
        'month',
        'year',
        'week',
        'day'
      ),

      property_type VARCHAR(50) NOT NULL,

      highlights JSON,

      rate DECIMAL(2,1) DEFAULT 0.0,

      area_sqft DECIMAL(10,2),

      district VARCHAR(100) NOT NULL,

      city VARCHAR(100) NOT NULL,

      address VARCHAR(255) NOT NULL,

      map_address VARCHAR(255),

      main_image LONGBLOB NOT NULL,

      main_video LONGBLOB,

      price_period ENUM(
        'monthly',
        'yearly'
      ) DEFAULT 'monthly',

      status ENUM(
        'pending',
        'active',
        'rented'
      ) DEFAULT 'pending',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP,

      FOREIGN KEY(client_id)
      REFERENCES clients(id)
      ON DELETE CASCADE

    )
  `);


  await connection.query(`
    CREATE TABLE IF NOT EXISTS stay_to_rent_images (

      id INT AUTO_INCREMENT PRIMARY KEY,

      stay_rent_id INT NOT NULL,

      image LONGBLOB NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY(stay_rent_id)
      REFERENCES stays_to_rent(id)
      ON DELETE CASCADE

    )
  `);
};


/* =========================================================
   GET GALLERY IMAGES
========================================================= */

const getGalleryImages = async (ids, connection = db) => {

  if (!ids.length) {
    return new Map();
  }

  const [rows] = await connection.query(
    `
      SELECT stay_rent_id, image
      FROM stay_to_rent_images
      WHERE stay_rent_id IN (?)
      ORDER BY id
    `,
    [ids]
  );

  const gallery = new Map();

  for (const row of rows) {

    if (!gallery.has(row.stay_rent_id)) {
      gallery.set(row.stay_rent_id, []);
    }

    gallery.get(row.stay_rent_id).push(row);
  }

  return gallery;
};


/* =========================================================
   ADD STAY TO RENT
========================================================= */

export const addStayToRent = async (req, res) => {

  let connection;

  try {

    connection = await db.getConnection();

    await connection.beginTransaction();

    await ensureStayToRentTable(connection);


    /* -----------------------------------------------------
       REQUEST BODY
    ----------------------------------------------------- */

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
      price_period,
      status,
      rate,
      days
    } = req.body;


    /* -----------------------------------------------------
       REQUIRED VALIDATION
    ----------------------------------------------------- */

    if (
      !client_id ||
      !title ||
      !price ||
      !property_type ||
      !district ||
      !city ||
      !address
    ) {

      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Please fill required fields"
      });
    }


    /* -----------------------------------------------------
       MAIN IMAGE
    ----------------------------------------------------- */

    const mainImage =
      req.files?.main_image?.[0]?.buffer;


    /* -----------------------------------------------------
       MAIN VIDEO
    ----------------------------------------------------- */

    const mainVideo =
      req.files?.main_video?.[0]?.buffer || null;


    if (!mainImage) {

      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Main image required"
      });
    }


    /* -----------------------------------------------------
       GALLERY IMAGES
    ----------------------------------------------------- */

    const galleryImages =
      req.files?.images?.map(
        (img) => img.buffer
      ) || [];


    const limitInfo = await getApplicableLimit(connection, client_id);
    const listingDays = Number(limitInfo.applicableLimit.days);
    const expiresAt = new Date(Date.now() + (listingDays * 24 * 60 * 60 * 1000));
    const listingStatus = Number(limitInfo.applicableLimit.price) > 0 ? 'pending' : 'active';

    /* -----------------------------------------------------
       INSERT PROPERTY
    ----------------------------------------------------- */

    const insertQuery = `
      INSERT INTO stays_to_rent
      (
        client_id,
        limit_id,
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
        main_image,
        main_video,
        duration,
        price_period,
        status,
        rate,
        days,
        expires_at
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `;


    const insertValues = [
      client_id,
      limitInfo.applicableLimit.id,
      title,
      description,
      JSON.stringify(parseJsonField(overview)),
      price,
      property_type,
      JSON.stringify(parseJsonField(highlights)),
      area_sqft || null,
      district,
      city,
      address,
      map_address || null,
      mainImage,
      mainVideo,
      duration || "permanent",
      price_period || "monthly",
      listingStatus,
      rate || null,
      listingDays,
      expiresAt
    ];


    const [insertResult] =
      await connection.query(
        insertQuery,
        insertValues
      );


    const propertyId = insertResult.insertId;

    if (galleryImages.length > 0) {
      const galleryValues = galleryImages.map((image) => [propertyId, image]);

      await connection.query(
        `INSERT INTO stay_to_rent_images (stay_rent_id, image) VALUES ?`,
        [galleryValues]
      );
    }

    let paymentId = null;
    if (Number(limitInfo.applicableLimit.price) > 0) {
      const [paymentResult] = await connection.query(
        `INSERT INTO payments (client_id, property_type, property_id, amount, status, created_at)
         VALUES (?, 'stays_to_rent', ?, ?, 'pending', NOW())`,
        [client_id, propertyId, Number(limitInfo.applicableLimit.price)]
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

    return res.status(201).json({
      success: true,
      message: "Stay To Rent added successfully",
      property_id: propertyId,
      status: listingStatus,
      payment_id: paymentId,
      tier: publicLimitInfo(limitInfo.applicableLimit)
    });

  } catch (error) {

    if (connection) {
      await connection.rollback();
    }

    console.log("ADD STAY TO RENT ERROR:", error);

    return res.status(error.code === 'NO_TIER_AVAILABLE' ? 409 : 500).json({
      success: false,
      message: error.message
    });

  } finally {

    if (connection) {
      connection.release();
    }
  }
};


/* =========================================================
   GET ALL STAY TO RENT
========================================================= */

export const showAllStayToRent = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        s.*,
        CASE
          WHEN s.expires_at IS NULL THEN NULL
          WHEN DATEDIFF(s.expires_at, CURRENT_TIMESTAMP) < 0 THEN 0
          ELSE DATEDIFF(s.expires_at, CURRENT_TIMESTAMP)
        END AS remaining_days,
        (s.expires_at IS NOT NULL AND DATEDIFF(s.expires_at, CURRENT_TIMESTAMP) <= 0 AND s.status <> 'expired') AS needs_expiry_update
      FROM stays_to_rent s
      ORDER BY created_at DESC
    `);


    const gallery = await getGalleryImages(
      (rows || []).map((row) => row.id)
    );


    const data = (rows || []).map(
      (row) =>
        serializeStayToRentRow(
          row,
          gallery.get(row.id) || []
        )
    );


    return res.json({
      success: true,
      data
    });

  } catch (error) {

    console.log(
      "GET ALL STAY TO RENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* =========================================================
   GET ALL ALIAS
========================================================= */

export const getAllStayToRent = async (req, res) => {

  return showAllStayToRent(req, res);

};


/* =========================================================
   GET SINGLE STAY TO RENT
========================================================= */

export const getStayToRentById = async (req, res) => {

  try {

    const { id } = req.params;


    const [rows] = await db.query(
      `
        SELECT *
        FROM stays_to_rent
        WHERE id = ?
      `,
      [id]
    );


    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }


    const gallery =
      await getGalleryImages([rows[0].id]);


    const property =
      serializeStayToRentRow(
        rows[0],
        gallery.get(rows[0].id) || []
      );


    return res.json({
      success: true,
      data: property
    });

  } catch (error) {

    console.log(
      "GET STAY TO RENT BY ID ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* =========================================================
   UPDATE STAY TO RENT
========================================================= */

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
      district,
      city,
      address,
      map_address,
      duration,
      price_period,
      status,
      rate
    } = req.body;


    const updates = [];

    const values = [];


    /* -----------------------------------------------------
       CLIENT ID
    ----------------------------------------------------- */

    if (client_id !== undefined) {

      updates.push(
        "client_id = ?"
      );

      values.push(client_id);
    }


    /* -----------------------------------------------------
       TITLE
    ----------------------------------------------------- */

    if (title !== undefined) {

      updates.push(
        "title = ?"
      );

      values.push(title);
    }


    /* -----------------------------------------------------
       DESCRIPTION
    ----------------------------------------------------- */

    if (description !== undefined) {

      updates.push(
        "description = ?"
      );

      values.push(description);
    }


    /* -----------------------------------------------------
       OVERVIEW
    ----------------------------------------------------- */

    if (overview !== undefined) {

      updates.push(
        "overview = ?"
      );

      values.push(
        JSON.stringify(
          parseJsonField(overview)
        )
      );
    }


    /* -----------------------------------------------------
       PRICE
    ----------------------------------------------------- */

    if (price !== undefined) {

      updates.push(
        "price = ?"
      );

      values.push(price);
    }


    /* -----------------------------------------------------
       PROPERTY TYPE
    ----------------------------------------------------- */

    if (property_type !== undefined) {

      updates.push(
        "property_type = ?"
      );

      values.push(property_type);
    }


    /* -----------------------------------------------------
       HIGHLIGHTS
    ----------------------------------------------------- */

    if (highlights !== undefined) {

      updates.push(
        "highlights = ?"
      );

      values.push(
        JSON.stringify(
          parseJsonField(highlights)
        )
      );
    }


    /* -----------------------------------------------------
       AREA
    ----------------------------------------------------- */

    if (area_sqft !== undefined) {

      updates.push(
        "area_sqft = ?"
      );

      values.push(
        area_sqft || null
      );
    }


    /* -----------------------------------------------------
       DISTRICT
    ----------------------------------------------------- */

    if (district !== undefined) {

      updates.push(
        "district = ?"
      );

      values.push(district);
    }


    /* -----------------------------------------------------
       CITY
    ----------------------------------------------------- */

    if (city !== undefined) {

      updates.push(
        "city = ?"
      );

      values.push(city);
    }


    /* -----------------------------------------------------
       ADDRESS
    ----------------------------------------------------- */

    if (address !== undefined) {

      updates.push(
        "address = ?"
      );

      values.push(address);
    }


    /* -----------------------------------------------------
       RATE
    ----------------------------------------------------- */

    if (rate !== undefined) {

      updates.push(
        "rate = ?"
      );

      values.push(
        rate || null
      );
    }


    /* -----------------------------------------------------
       MAP ADDRESS
    ----------------------------------------------------- */

    if (map_address !== undefined) {

      updates.push(
        "map_address = ?"
      );

      values.push(map_address);
    }


    /* -----------------------------------------------------
       DURATION
    ----------------------------------------------------- */

    if (duration !== undefined) {

      updates.push(
        "duration = ?"
      );

      values.push(
        duration || "permanent"
      );
    }


    /* -----------------------------------------------------
       PRICE PERIOD
    ----------------------------------------------------- */

    if (price_period !== undefined) {

      updates.push(
        "price_period = ?"
      );

      values.push(
        price_period || "monthly"
      );
    }


    /* -----------------------------------------------------
       STATUS
    ----------------------------------------------------- */

    if (status !== undefined) {

      updates.push(
        "status = ?"
      );

      values.push(status);
    }


    /* -----------------------------------------------------
       MAIN IMAGE
    ----------------------------------------------------- */

    const mainImage =
      req.files?.main_image?.[0]?.buffer;


    if (mainImage) {

      updates.push(
        "main_image = ?"
      );

      values.push(mainImage);
    }


    /* -----------------------------------------------------
       MAIN VIDEO
    ----------------------------------------------------- */

    const mainVideo =
      req.files?.main_video?.[0]?.buffer;


    if (mainVideo) {

      updates.push(
        "main_video = ?"
      );

      values.push(mainVideo);

    } else if (
      req.body.remove_main_video === "true"
    ) {

      updates.push(
        "main_video = ?"
      );

      values.push(null);
    }


    /* -----------------------------------------------------
       GALLERY
    ----------------------------------------------------- */

    const galleryImages =
      req.files?.images?.map(
        (img) => img.buffer
      ) || [];


    /* -----------------------------------------------------
       NO UPDATE DATA
    ----------------------------------------------------- */

    if (updates.length === 0) {

      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "No update data provided"
      });
    }


    /* -----------------------------------------------------
       WHERE ID
    ----------------------------------------------------- */

    values.push(id);


    /* -----------------------------------------------------
       UPDATE
    ----------------------------------------------------- */

    await connection.query(
      `
        UPDATE stays_to_rent
        SET ${updates.join(", ")}
        WHERE id = ?
      `,
      values
    );


    /* -----------------------------------------------------
       UPDATE GALLERY
    ----------------------------------------------------- */

    if (galleryImages.length > 0) {

      await connection.query(
        `
          DELETE FROM stay_to_rent_images
          WHERE stay_rent_id = ?
        `,
        [id]
      );


      const galleryValues =
        galleryImages.map(
          (image) => [
            id,
            image
          ]
        );


      await connection.query(
        `
          INSERT INTO stay_to_rent_images
          (
            stay_rent_id,
            image
          )
          VALUES ?
        `,
        [galleryValues]
      );
    }


    /* -----------------------------------------------------
       COMMIT
    ----------------------------------------------------- */

    await connection.commit();


    return res.json({
      success: true,
      message: "Stay To Rent updated successfully"
    });

  } catch (error) {

    if (connection) {
      await connection.rollback();
    }

    console.log(
      "UPDATE STAY TO RENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {

    if (connection) {
      connection.release();
    }
  }
};


/* =========================================================
   DELETE STAY TO RENT
========================================================= */

export const deleteStayToRent = async (req, res) => {

  try {

    const { id } = req.params;


    const [result] = await db.query(
      `
        DELETE FROM stays_to_rent
        WHERE id = ?
      `,
      [id]
    );


    if (result.affectedRows === 0) {

      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }


    return res.json({
      success: true,
      message: "Property deleted successfully"
    });

  } catch (error) {

    console.log(
      "DELETE STAY TO RENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};