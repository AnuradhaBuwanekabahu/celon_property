import db from "./configuration/db.js";

async function run() {
  try {
    const [result] = await db.query(
      "UPDATE admins SET password = 'SuperAdmin@123', role = 'super_admin' WHERE Name = 'super_admin'"
    );
    console.log("Inserted admin successfully", result);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log("Admin already exists.");
    } else {
      console.error(err);
    }
  }
  process.exit(0);
}

run();
