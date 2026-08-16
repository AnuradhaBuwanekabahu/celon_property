import db from "../../configuration/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: "user",
      auth_type: user.auth_type,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

export const registerUserWithEmail = async (req, res) => {
  try {
    const { full_name, email, password } = req.body || {};

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: "Full name, email and password are required" });
    }

    const normalizedEmail = normalizeEmail(email);

    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password, auth_type, is_active) VALUES (?, ?, ?, 'email', 1)`,
      [full_name, normalizedEmail, hashedPassword]
    );

    const user = {
      id: result.insertId,
      full_name,
      email: normalizedEmail,
      auth_type: "email",
      is_active: true,
    };

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user),
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const loginUserWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = normalizeEmail(email);

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const user = rows[0];

    if (user.auth_type !== "email") {
      return res.status(400).json({ success: false, message: "Please use Google login for this account" });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: "Account is deactivated" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      auth_type: user.auth_type,
      is_active: user.is_active,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(safeUser),
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const loginUserWithGoogle = async (req, res) => {
  try {
    let { google_id, email, full_name, id_token } = req.body || {};

    if (id_token) {
      const tokenResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(id_token)}`);
      if (!tokenResponse.ok) {
        return res.status(401).json({ success: false, message: "Invalid Google token" });
      }

      const tokenData = await tokenResponse.json();
      google_id = tokenData.sub;
      email = tokenData.email;
      full_name = tokenData.name;

      if (!google_id || !email) {
        return res.status(400).json({ success: false, message: "Google token did not return required user information" });
      }
    }

    if (!google_id || !email) {
      return res.status(400).json({ success: false, message: "Google account details are required" });
    }

    const normalizedEmail = normalizeEmail(email);

    const [existingRows] = await db.query("SELECT * FROM users WHERE google_id = ? OR email = ?", [google_id, normalizedEmail]);

    if (existingRows.length > 0) {
      const existingUser = existingRows[0];
      const updateFields = [];
      const values = [];

      if (!existingUser.google_id) {
        updateFields.push("google_id = ?");
        values.push(google_id);
      }

      if (!existingUser.full_name && full_name) {
        updateFields.push("full_name = ?");
        values.push(full_name);
      }

      if (updateFields.length > 0) {
        await db.query(`UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`, [...values, existingUser.id]);
      }

      const safeUser = {
        id: existingUser.id,
        full_name: existingUser.full_name || full_name || "Google User",
        email: existingUser.email || normalizedEmail,
        auth_type: existingUser.auth_type || "google",
        is_active: existingUser.is_active,
      };

      return res.status(200).json({
        success: true,
        message: "Google login successful",
        token: generateToken(safeUser),
        user: safeUser,
      });
    }

    const [result] = await db.query(
      `INSERT INTO users (full_name, email, google_id, auth_type, is_active) VALUES (?, ?, ?, 'google', 1)`,
      [full_name || "Google User", normalizedEmail, google_id]
    );

    const user = {
      id: result.insertId,
      full_name: full_name || "Google User",
      email: normalizedEmail,
      auth_type: "google",
      is_active: true,
    };

    return res.status(201).json({
      success: true,
      message: "Google account created successfully",
      token: generateToken(user),
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
