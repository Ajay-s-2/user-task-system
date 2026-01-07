const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

/**
 * Register new user (self registration)
 */
exports.registerUser = async ({ name, email, password }) => {
  const hash = await bcrypt.hash(password, 10);

  await db.query(
    `INSERT INTO users (name, email, password, status, created_by)
     VALUES (?, ?, ?, 'ACTIVE', 'SELF')`,
    [name, email, hash]
  );
};

/**
 * Login user or admin
 */
exports.loginUser = async ({ email, password }) => {
  if (!email || !password) return null;

  /* ======================
     ADMIN LOGIN
  ====================== */
  const [admins] = await db.query(
    "SELECT * FROM admins WHERE email=? AND status='ACTIVE'",
    [email]
  );

  if (admins.length) {
    const admin = admins[0];
    const match = await bcrypt.compare(password, admin.password);

    await logger.logLogin({
      actorType: "ADMIN",
      actorId: admin.id,
      email,
      success: match
    });

    if (!match) return null;

    return jwt.sign(
      { adminId: admin.id, isAdmin: true, canUser: true },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  }

  /* ======================
     USER LOGIN
  ====================== */
  const [users] = await db.query(
    "SELECT * FROM users WHERE email=? AND status='ACTIVE'",
    [email]
  );

  if (!users.length) {
    await logger.logLogin({
      actorType: "USER",
      email,
      success: false
    });
    return null;
  }

  const user = users[0];
  const match = await bcrypt.compare(password, user.password);

  await logger.logLogin({
    actorType: "USER",
    actorId: user.id,
    email,
    success: match
  });

  if (!match) return null;

  return jwt.sign(
    { userId: user.id, isAdmin: false, canUser: true },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};
