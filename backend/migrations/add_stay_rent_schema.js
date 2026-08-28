import db from "../configuration/db.js";

async function migrate() {
  await db.query("ALTER TABLE stays_to_rent MODIFY main_image LONGBLOB NOT NULL");
  await db.query("ALTER TABLE stays_to_rent MODIFY status ENUM('pending', 'active', 'rented') DEFAULT 'pending'");
  const [columns] = await db.query(
    `SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'stays_to_rent' AND COLUMN_NAME = 'price_period'`
  );
  if (columns[0].count === 0) {
    await db.query("ALTER TABLE stays_to_rent ADD COLUMN price_period ENUM('monthly', 'yearly') DEFAULT 'monthly'");
  }
  await db.query(`
    CREATE TABLE IF NOT EXISTS stay_to_rent_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      stay_rent_id INT NOT NULL,
      image LONGBLOB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(stay_rent_id) REFERENCES stays_to_rent(id) ON DELETE CASCADE
    )
  `);
  console.log("Stay-to-rent schema migration completed");
}

migrate()
  .catch((error) => {
    console.error("Stay-to-rent schema migration failed", error);
    process.exitCode = 1;
  })
  .finally(() => db.end());