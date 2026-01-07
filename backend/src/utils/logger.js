const db = require("../config/db");

/**
 * Audit logs
 * Used for admin/user actions
 */
exports.logAudit = async ({
  actorType,
  actorId,
  action,
  entity = null,
  entityId = null,
  details = null,
  ipAddress = null
}) => {
  try {
    await db.query(
      `INSERT INTO audit_logs
       (actor_type, actor_id, action, entity, entity_id, details, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [actorType, actorId, action, entity, entityId, details, ipAddress]
    );
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};

/**
 * Login logs
 */
exports.logLogin = async ({
  actorType,
  actorId = null,
  email,
  success,
  ipAddress = null,
  userAgent = null
}) => {
  try {
    await db.query(
      `INSERT INTO login_logs
       (actor_type, actor_id, email, success, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [actorType, actorId, email, success, ipAddress, userAgent]
    );
  } catch (err) {
    console.error("Login log failed:", err.message);
  }
};
