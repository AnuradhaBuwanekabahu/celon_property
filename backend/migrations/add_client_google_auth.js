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
    await db.query("ALTER TABLE clients MODIFY password VARCHAR(255) NULL");
    await addColumnIfMissing("clients", "google_id", "VARCHAR(100) NULL UNIQUE");
    await addColumnIfMissing("clients", "auth_type", "ENUM('email', 'google') NOT NULL DEFAULT 'email'");
    console.log("Client Google authentication migration completed");
}

migrate()
    .catch((error) => {
        console.error("Client Google authentication migration failed", error);
        process.exitCode = 1;
    })
    .finally(() => db.end());