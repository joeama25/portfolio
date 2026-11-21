const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fix() {
  try {
    console.log("Connecting to database...");
    await pool.query('ALTER TABLE "projects" ADD COLUMN "image2" text;');
    console.log("✅ Success! The 'image2' column has been added.");
  } catch (err) {
    if (err.code === '42701') {
      console.log("ℹ️ The column 'image2' already exists.");
    } else {
      console.error("❌ Error:", err.message);
    }
  } finally {
    await pool.end();
  }
}

fix();