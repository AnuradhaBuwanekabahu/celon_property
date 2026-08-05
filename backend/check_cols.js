import db from "./configuration/db.js";

async function run() {
  try {
    const [rows] = await db.query("SHOW COLUMNS FROM admins");
    console.log(rows);
    const [rows2] = await db.query("SHOW COLUMNS FROM clients");
    console.log(rows2);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

run();
