const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();

let db;

(async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    });

    console.log("✅ MySQL Connected!");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
})();

module.exports = {
  execute: async (sql, params) => {
    if (!db) throw new Error("Database not connected yet");
    return db.execute(sql, params);
  },
};
