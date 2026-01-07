const mysql = require("mysql2/promise");

/**
 * Create a MySQL connection pool
 * Using pool is better than single connection
 * because it handles multiple requests efficiently
 */
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Optional: Test DB connection on startup
 */
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("MySQL connected");
    connection.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
})();

module.exports = db;
