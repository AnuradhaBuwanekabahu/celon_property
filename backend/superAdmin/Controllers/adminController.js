import db from "../../configuration/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Admin / Super Admin Login
export const loginAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const identifier = name || email;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Admin name/email and password are required"
            });
        }

        // Search in admins table
        const [rows] = await db.query(
            "SELECT * FROM admins WHERE Name = ? OR email = ?",
            [identifier, identifier]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        const admin = rows[0];

        // Verify password (check plain text or bcrypt)
        let isMatch = false;
        if (admin.password === password) {
            isMatch = true;
        } else {
            try {
                isMatch = await bcrypt.compare(password, admin.password);
            } catch (err) {
                isMatch = false;
            }
        }

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_key_here";
        const token = jwt.sign(
            { id: admin.id, name: admin.Name, email: admin.email, role: admin.role || "super_admin" },
            jwtSecret,
            { expiresIn: "7d" }
        );

        const adminData = {
            id: admin.id,
            name: admin.Name,
            email: admin.email,
            role: admin.role || "super_admin"
        };

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            admin: adminData,
            data: {
                token,
                admin: adminData
            }
        });

    } catch (error) {
        console.error("Admin Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

// Get All Admins
export const getAdmins = async (req, res) => {
    try {
        const [admins] = await db.query(
            "SELECT id, Name, email, role, is_approved, created_at FROM admins"
        );
        return res.status(200).json({
            success: true,
            admins,
            data: admins
        });
    } catch (error) {
        console.error("Get Admins Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admins"
        });
    }
};

export const getPendingAdmins = async (req, res) => {
    try {
        const [admins] = await db.query(
            "SELECT id, Name, email, role, is_approved, created_at FROM admins WHERE is_approved = 0"
        );
        return res.status(200).json({ success: true, data: admins });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch pending admins" });
    }
};

export const getApprovedAdmins = async (req, res) => {
    try {
        const [admins] = await db.query(
            "SELECT id, Name, email, role, is_approved, created_at FROM admins WHERE is_approved = 1"
        );
        return res.status(200).json({ success: true, data: admins });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch approved admins" });
    }
};

export const createAdmin = async (req, res) => {
    try {
        const { Name, name, email, password, role = 'admin', is_approved } = req.body;
        const adminName = Name || name;
        if (!adminName || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email and password are required" });
        }

        let hashedPassword = password;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (hashErr) {
            console.error("Password hash error:", hashErr);
        }

        const approvedVal = is_approved === false || is_approved === 0 ? 0 : 1;

        await db.query(
            "INSERT INTO admins (Name, email, password, role, is_approved) VALUES (?, ?, ?, ?, ?)",
            [adminName, email, hashedPassword, role, approvedVal]
        );
        return res.status(201).json({ success: true, message: "Admin created successfully" });
    } catch (error) {
        console.error("Create Admin Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Failed to create admin" });
    }
};

export const approveAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE admins SET is_approved = 1 WHERE id = ?", [id]);
        return res.status(200).json({ success: true, message: "Admin approved" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to approve admin" });
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM admins WHERE id = ?", [id]);
        return res.status(200).json({ success: true, message: "Admin deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to delete admin" });
    }
};
