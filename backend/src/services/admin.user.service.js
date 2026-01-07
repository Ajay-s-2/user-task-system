const db = require("../config/db");
const logger = require("../utils/logger");

/**
 * Get all users (admin only)
 */
exports.getAllUsers = async () => {
  const [rows] = await db.query(
    "SELECT id, name, email, status, created_by FROM users"
  );
  return rows;
};

/**
 * Enable / Disable user
 */
exports.updateUserStatus = async (userId, status) => {
  await db.query(
    "UPDATE users SET status=? WHERE id=?",
    [status, userId]
  );

  await logger.logAudit({
    actorType: "ADMIN",
    actorId: 0, // real adminId can be passed later
    action: "UPDATE_USER_STATUS",
    entity: "USER",
    entityId: userId,
    details: `Status changed to ${status}`
  });
};
