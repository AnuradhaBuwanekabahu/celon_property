import db from "./configuration/db.js";
import bcrypt from "bcrypt";

async function run() {
  try {
    const adminName = 'super_admin';
    const adminEmail = 'superadmin@gmail.com';
    const plainPassword = 'SuperAdmin@123';

    // Hash password with bcrypt for security
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Check if super_admin exists
    const [existing] = await db.query(
      "SELECT * FROM admins WHERE Name = ? OR email = ?",
      [adminName, adminEmail]
    );

    if (existing.length > 0) {
      // Update existing admin
      const [updateResult] = await db.query(
        "UPDATE admins SET password = ?, role = 'super_admin', is_approved = 1 WHERE id = ?",
        [hashedPassword, existing[0].id]
      );
      console.log("✅ Super Admin updated successfully:", updateResult);
    } else {
      // Insert new super admin
      const [insertResult] = await db.query(
        "INSERT INTO admins (Name, email, password, role, is_approved) VALUES (?, ?, ?, 'super_admin', 1)",
        [adminName, adminEmail, hashedPassword]
      );
      console.log("✅ Super Admin inserted successfully:", insertResult);
    }
  } catch (err) {
    console.error("❌ Error setting up Super Admin:", err);
  }
  process.exit(0);
}

run();

