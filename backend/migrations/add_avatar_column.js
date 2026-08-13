// add_avatar_column.js – migration script to ensure avatar column exists in clients table
import db from "../configuration/db.js";

// Helper: add column if it does not exist
async function addColumnIfMissing(table, column, definition) {
  const checkQuery = `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`;
  const [rows] = await db.query(checkQuery, [table, column]);
  if (rows[0].cnt === 0) {
    await db.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    console.log(`✅ Added ${column} to ${table}`);
  } else {
    console.log(`ℹ️ Column ${column} already exists in ${table}`);
  }
}

(async () => {
  try {
    await addColumnIfMissing('clients', 'avatar', 'LONGBLOB');
    console.log('✅ Migration completed');
  } catch (e) {
    console.error('❌ Migration failed', e);
  } finally {
    process.exit(0);
  }
})();
