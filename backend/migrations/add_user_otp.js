import db from "../configuration/db.js";

async function addColumnIfMissing(table, column, definition) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );

  if (rows[0].count === 0) {
    await db.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    console.log(`Added ${column} to ${table}`);
  }
}

async function migrate() {
  await addColumnIfMissing("users", "is_verified", "TINYINT(1) NOT NULL DEFAULT 0");
  await db.query(`
    CREATE TABLE IF NOT EXISTS user_otp_verifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(150) NOT NULL,
      otp_code VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      is_used TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_email_otp (email, otp_code)
    )
  `);
  console.log("User OTP migration completed");
}

migrate()
  .catch((error) => {
    console.error("User OTP migration failed", error);
    process.exitCode = 1;
  })
  .finally(() => db.end());
