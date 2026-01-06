const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (user) => {
  const hash = await bcrypt.hash(user.password, 10);
  await db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [user.name, user.email, hash]
  );
};

exports.loginUser = async (user) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [user.email]
  );

  if (!rows.length) return null;

  const valid = await bcrypt.compare(user.password, rows[0].password);
  if (!valid) return null;

  return jwt.sign(
    { id: rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
