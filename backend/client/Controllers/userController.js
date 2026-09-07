import db from "../../configuration/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/nodemailer.js";

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
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const createUserOtp = async (email) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await db.query("UPDATE user_otp_verifications SET is_used = 1 WHERE email = ? AND is_used = 0", [email]);
  await db.query(
    "INSERT INTO user_otp_verifications (email, otp_code, expires_at) VALUES (?, ?, ?)",
    [email, otp, expiresAt]
  );
  await sendOtpEmail(email, otp);
};

export const registerUserWithEmail = async (req, res) => {
  try {
    const { full_name, email, password } = req.body || {};

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: "Full name, email and password are required" });
    }

    const normalizedEmail = normalizeEmail(email);

    const [existing] = await db.query("SELECT id, is_verified FROM users WHERE email = ?", [normalizedEmail]);
    if (existing.length > 0) {
      if (existing[0].is_verified) {
        return res.status(409).json({ success: false, message: "Email already registered" });
      }
      await db.query("DELETE FROM user_otp_verifications WHERE email = ?", [normalizedEmail]);
      await db.query("DELETE FROM users WHERE id = ?", [existing[0].id]);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password, auth_type, is_active, is_verified) VALUES (?, ?, ?, 'email', 1, 0)`,
      [full_name, normalizedEmail, hashedPassword]
    );

    await createUserOtp(normalizedEmail);

    const user = {
      id: result.insertId,
      full_name,
      email: normalizedEmail,
      auth_type: "email",
      is_active: true,
    };

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify the OTP sent to your email.",
      email: normalizedEmail,
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

    if (!user.is_verified) {
      return res.status(403).json({ success: false, message: "Please verify your email before logging in" });
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
        is_verified: true,
      };

      return res.status(200).json({
        success: true,
        message: "Google login successful",
        token: generateToken(safeUser),
        user: safeUser,
      });
    }

    const [result] = await db.query(
      `INSERT INTO users (full_name, email, google_id, auth_type, is_active, is_verified) VALUES (?, ?, ?, 'google', 1, 1)`,
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

export const verifyUserRegistrationOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const otp = String(req.body?.otp || "").trim();

    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: "Email and a valid 6-digit OTP are required" });
    }

    const [rows] = await db.query(
      `SELECT * FROM user_otp_verifications
       WHERE email = ? AND otp_code = ? AND is_used = 0
       ORDER BY created_at DESC LIMIT 1`,
      [email, otp]
    );

    if (!rows.length) return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (new Date(rows[0].expires_at) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    await db.query("UPDATE user_otp_verifications SET is_used = 1 WHERE id = ?", [rows[0].id]);
    await db.query("UPDATE users SET is_verified = 1 WHERE email = ? AND auth_type = 'email'", [email]);
    const [users] = await db.query("SELECT id, full_name, email, auth_type, is_active FROM users WHERE email = ?", [email]);

    if (!users.length) return res.status(404).json({ success: false, message: "User not found" });
    const user = users[0];
    return res.status(200).json({ success: true, message: "Email verified successfully", token: generateToken(user), user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resendUserRegistrationOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const [users] = await db.query("SELECT is_verified FROM users WHERE email = ? AND auth_type = 'email'", [email]);
    if (!users.length) return res.status(404).json({ success: false, message: "User not found" });
    if (users[0].is_verified) return res.status(400).json({ success: false, message: "Email already verified" });

    await createUserOtp(email);
    return res.status(200).json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const sendPropertyInquiry = async (req, res) => {
  try {
    const {
      clientEmail,
      propertyTitle,
      userEmail,
      message
    } = req.body || {};

    if (!clientEmail) {
      return res.status(400).json({
        success: false,
        message: "Client email is required"
      });
    }

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required"
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    await sendPropertyInquiryEmail({
      clientEmail,
      propertyTitle,
      userEmail,
      message
    });

    return res.status(200).json({
      success: true,
      message: "Message sent to the property client successfully"
    });

  } catch (error) {
    console.error("Send property inquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message to client"
    });
  }
};