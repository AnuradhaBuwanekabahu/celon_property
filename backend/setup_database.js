// backend/setup_database.js
import db from "./configuration/db.js";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

// -----------------------------------------------------------------------------
// Helper: add column only if it does not already exist
// -----------------------------------------------------------------------------
async function addColumnIfMissing(table, column, definition) {
  const checkQuery = `
    SELECT COUNT(*) AS cnt
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
      AND COLUMN_NAME = ?
  `;
  const [rows] = await db.query(checkQuery, [table, column]);
  if (rows[0].cnt === 0) {
    await db.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    console.log(`✅ Added ${column} to ${table}`);
  } else {
    console.log(`ℹ️ Column ${column} already exists in ${table}`);
  }
}

// -----------------------------------------------------------------------------
// CREATE TABLE statements (full set)
// -----------------------------------------------------------------------------
const tableDDLs = [
  // clients
  `CREATE TABLE IF NOT EXISTS clients (
     id INT AUTO_INCREMENT PRIMARY KEY,
     password VARCHAR(255) NOT NULL,
     email VARCHAR(150) NOT NULL UNIQUE,
     phone_number VARCHAR(20),
     avatar LONGBLOB,
     whatsapp_number VARCHAR(20),
     full_name VARCHAR(100) NOT NULL,
     ads_count INT NOT NULL DEFAULT 0,
     is_active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   )`,

  // admins
  `CREATE TABLE IF NOT EXISTS admins (
     id INT AUTO_INCREMENT PRIMARY KEY,
     Name VARCHAR(100) NOT NULL,
     password VARCHAR(255) NOT NULL,
     email VARCHAR(150) NOT NULL UNIQUE,
     role ENUM('admin','super_admin') DEFAULT 'admin',
     is_approved BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   )`,

  // hot_sales
  `CREATE TABLE IF NOT EXISTS hot_sales (
     id INT AUTO_INCREMENT PRIMARY KEY,
     client_id INT NOT NULL,
     title VARCHAR(150) NOT NULL,
     description TEXT,
     price DECIMAL(12,2) NOT NULL,
     property_type VARCHAR(50) NOT NULL,
     overview JSON,
     rate DECIMAL(12,2) DEFAULT 0.00,
     duration VARCHAR(50) DEFAULT 'month',
     highlights JSON,
     area_sqft DECIMAL(10,2),
     city VARCHAR(100) NOT NULL,
     map_address VARCHAR(255),
     location VARCHAR(255),
     main_image LONGBLOB NOT NULL,
     main_video LONGBLOB,
     images JSON,
     status ENUM('pending','active','sold') DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
   )`,

  // hot_sale_images
  `CREATE TABLE IF NOT EXISTS hot_sale_images (
     id INT AUTO_INCREMENT PRIMARY KEY,
     hot_sale_id INT NOT NULL,
     image LONGBLOB NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (hot_sale_id) REFERENCES hot_sales(id) ON DELETE CASCADE
   )`,

  // stays_to_buy
  `CREATE TABLE IF NOT EXISTS stays_to_buy (
     id INT AUTO_INCREMENT PRIMARY KEY,
     client_id INT NOT NULL,
     title VARCHAR(150) NOT NULL,
     description TEXT,
     price DECIMAL(12,2) NOT NULL,
     property_type VARCHAR(50) NOT NULL,
     overview JSON,
     rate DECIMAL(12,2) DEFAULT 0.00,
     duration VARCHAR(50) DEFAULT 'month',
     highlights JSON,
     area_sqft DECIMAL(10,2),
     city VARCHAR(100) NOT NULL,
     map_address VARCHAR(255),
     location VARCHAR(255),
     main_image LONGBLOB NOT NULL,
     images JSON,
     status ENUM('pending','active','sold') DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
   )`,

  // stays_to_rent
  `CREATE TABLE IF NOT EXISTS stays_to_rent (
     id INT AUTO_INCREMENT PRIMARY KEY,
     client_id INT NOT NULL,
     title VARCHAR(150) NOT NULL,
     description TEXT,
     price DECIMAL(12,2) NOT NULL,
     property_type VARCHAR(50) NOT NULL,
     overview JSON,
     rate DECIMAL(12,2) DEFAULT 0.00,
     duration VARCHAR(50) DEFAULT 'month',
     highlights JSON,
     area_sqft DECIMAL(10,2),
     city VARCHAR(100) NOT NULL,
     map_address VARCHAR(255),
     location VARCHAR(255),
     main_image LONGBLOB NOT NULL,
     images JSON,
     price_period VARCHAR(50),
     status ENUM('pending','active','sold') DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
   )`,

  // land
  `CREATE TABLE IF NOT EXISTS land (
     id INT AUTO_INCREMENT PRIMARY KEY,
     client_id INT NOT NULL,
     title VARCHAR(150) NOT NULL,
     description TEXT,
     price DECIMAL(12,2) NOT NULL,
     rate DECIMAL(12,2) DEFAULT 0.00,
     duration VARCHAR(50) DEFAULT 'month',
     overview JSON,
     land_size DECIMAL(12,2),
     size_unit VARCHAR(20),
     location VARCHAR(255),
     city VARCHAR(100) NOT NULL,
     main_image LONGBLOB NOT NULL,
     images JSON,
     status ENUM('pending','active','sold') DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
   )`,

  // land_images
  `CREATE TABLE IF NOT EXISTS land_images (
     id INT AUTO_INCREMENT PRIMARY KEY,
     land_id INT NOT NULL,
     image LONGBLOB NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (land_id) REFERENCES land(id) ON DELETE CASCADE
   )`,

  // ads
  `CREATE TABLE IF NOT EXISTS ads (
     id INT AUTO_INCREMENT PRIMARY KEY,
     client_id INT NOT NULL,
     title VARCHAR(150) NOT NULL,
     image LONGBLOB NOT NULL,
     link_url VARCHAR(255),
     position VARCHAR(50),
     is_active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
   )`,

  // payments
  `CREATE TABLE IF NOT EXISTS payments (
     id INT AUTO_INCREMENT PRIMARY KEY,
     client_id INT NOT NULL,
     property_type VARCHAR(50) NOT NULL,
     property_id INT NOT NULL,
     amount DECIMAL(12,2) NOT NULL,
     payment_method VARCHAR(50),
     transaction_ref VARCHAR(100),
     status ENUM('pending','completed','failed') DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
   )`,

  // offers
  `CREATE TABLE IF NOT EXISTS offers (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(150) NOT NULL,
     description TEXT,
     discount_percent DECIMAL(5,2),
     discount_amount DECIMAL(12,2),
     offer_type ENUM('percentage','fixed') DEFAULT 'percentage',
     applicable_to VARCHAR(255),
     promo_code VARCHAR(50),
     start_date DATE,
     end_date DATE,
     max_uses INT,
     used_count INT DEFAULT 0,
     status ENUM('active','expired') DEFAULT 'active',
     created_by INT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   )`,

  // ad_limits
  `CREATE TABLE IF NOT EXISTS ad_limits (
     id INT AUTO_INCREMENT PRIMARY KEY,
     free_ad_limit INT NOT NULL,
     second_limit INT NOT NULL,
     second_limit_charge DECIMAL(12,2) NOT NULL,
     third_limit INT NOT NULL,
     third_limit_charge DECIMAL(12,2) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   )`,

  // users
  `CREATE TABLE IF NOT EXISTS users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     email VARCHAR(150) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     role ENUM('client','admin','super_admin') DEFAULT 'client',
     is_active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   )`,

  // wanted
  `CREATE TABLE IF NOT EXISTS wanted (
     id INT AUTO_INCREMENT PRIMARY KEY,
     client_id INT NOT NULL,
     title VARCHAR(150) NOT NULL,
     description TEXT,
     budget DECIMAL(12,2),
     preferred_city VARCHAR(100),
     phone_number VARCHAR(20),
     main_image LONGBLOB,
     images JSON,
     status ENUM('pending','fulfilled','closed') DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
   )`
];

// -----------------------------------------------------------------------------
// Column fixes (already defined for hot_sales)
// -----------------------------------------------------------------------------
const columnFixes = [
  { table: "hot_sales", column: "main_video", def: "LONGBLOB AFTER location" },
  { table: "hot_sales", column: "images", def: "JSON AFTER main_image" },
  { table: "hot_sales", column: "overview", def: "JSON AFTER property_type" },
  { table: "hot_sales", column: "rate", def: "DECIMAL(12,2) DEFAULT 0.00 AFTER price" },
  { table: "hot_sales", column: "duration", def: "VARCHAR(50) DEFAULT 'month' AFTER rate" },
  { table: "clients", column: "avatar", def: "LONGBLOB" }
];

// -----------------------------------------------------------------------------
// Super‑admin seeding
// -----------------------------------------------------------------------------
async function seedSuperAdmin() {
  const name = process.env.SUPER_ADMIN_NAME ?? "Super Admin";
  const email = process.env.SUPER_ADMIN_EMAIL ?? "superadmin@example.com";
  const rawPwd = process.env.SUPER_ADMIN_PASSWORD ?? "supersecret";

  const hash = await bcrypt.hash(rawPwd, 10);

  await db.query(
    `INSERT INTO admins (Name, email, password, role, is_approved)
     VALUES (?,?,?,?,1)
     ON DUPLICATE KEY UPDATE
       password = VALUES(password),
       role = VALUES(role),
       is_approved = 1`,
    [name, email, hash, "super_admin"]
  );
  console.log("✅ Super admin seeded/updated");
}

// -----------------------------------------------------------------------------
// Main setup function
// -----------------------------------------------------------------------------
export async function setupDatabase() {
  // 1) Create/ensure tables
  for (const sql of tableDDLs) {
    try {
      await db.query(sql);
      console.log("✅ Table ensured");
    } catch (e) {
      console.error("❌ Table error:", e.message);
    }
  }

  // 2) Apply column fixes
  for (const { table, column, def } of columnFixes) {
    try {
      await addColumnIfMissing(table, column, def);
    } catch (e) {
      console.error(`❌ Column error ${table}.${column}:`, e.message);
    }
  }

  // 3) Seed super admin
  await seedSuperAdmin();

  console.log("🚀 Database setup complete");
}

// -----------------------------------------------------------------------------
// ES‑module entry point (run directly)
// -----------------------------------------------------------------------------
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
