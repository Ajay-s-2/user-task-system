const db = require("../config/db");
const logger = require("../utils/logger");

/**
 * Get all tasks (admin)
 */
exports.getAllTasks = async () => {
  const [rows] = await db.query(
    `SELECT t.*, u.name AS user_name, u.email
     FROM tasks t
     JOIN users u ON t.user_id = u.id
     ORDER BY t.created_at DESC`
  );
  return rows;
};

/**
 * Delete any task (admin)
 */
exports.deleteAnyTask = async (taskId, adminId) => {
  await db.query("DELETE FROM tasks WHERE id=?", [taskId]);

  await logger.logAudit({
    actorType: "ADMIN",
    actorId: adminId,
    action: "ADMIN_DELETE_TASK",
    entity: "TASK",
    entityId: taskId
  });
};
