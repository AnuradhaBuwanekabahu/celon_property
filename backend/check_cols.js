import db from "./configuration/db.js";

async function run() {
  try {
    const tables = ['clients', 'admins', 'hot_sales', 'land', 'stays_to_buy', 'stays_to_rent', 'ads', 'payments', 'wanted', 'offers', 'ad_limits'];
    for (const t of tables) {
      try {
        const [cols] = await db.query(`SHOW COLUMNS FROM ${t}`);
        console.log(`=== TABLE: ${t} ===`);
        console.log(cols.map(c => c.Field).join(', '));
      } catch (err) {
        console.log(`TABLE ${t} error:`, err.message);
      }
    }
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

run();
