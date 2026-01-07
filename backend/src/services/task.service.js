const db = require("../config/db");
const logger = require("../utils/logger");

/**
 * Create task
 */
exports.createTask = async (userId, data) => {
  const [result] = await db.query(
    `INSERT INTO tasks (title, description, priority, user_id)
     VALUES (?, ?, ?, ?)`,
    [data.title, data.description || null, data.priority || "MEDIUM", userId]
  );

  await logger.logAudit({
    actorType: "USER",
    actorId: userId,
    action: "CREATE_TASK",
    entity: "TASK",
    entityId: result.insertId
  });
};

/**
 * Get user tasks
 */
exports.getUserTasks = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM tasks WHERE user_id=? ORDER BY created_at DESC",
    [userId]
  );
  return rows;
};

/**
 * UPDATE TASK (USER / ADMIN-AS-USER)
 */
exports.updateTask = async (taskId, userId, data) => {
  await db.query(
    `UPDATE tasks
     SET title=?, description=?, priority=?, status=?
     WHERE id=? AND user_id=?`,
    [
      data.title,
      data.description,
      data.priority,
      data.status,
      taskId,
      userId
    ]
  );

  await logger.logAudit({
    actorType: "USER",
    actorId: userId,
    action: "UPDATE_TASK",
    entity: "TASK",
    entityId: taskId
  });
};

/**
 * DELETE TASK (USER)
 */
exports.deleteTask = async (taskId, userId) => {
  await db.query(
    "DELETE FROM tasks WHERE id=? AND user_id=?",
    [taskId, userId]
  );

  await logger.logAudit({
    actorType: "USER",
    actorId: userId,
    action: "DELETE_TASK",
    entity: "TASK",
    entityId: taskId
  });
};
