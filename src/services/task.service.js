const db = require("../config/db");

/**
 * CREATE TASK
 */
exports.createTask = async (task, userId) => {
  await db.query(
    `INSERT INTO tasks 
     (title, description, status, priority, due_date, user_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      task.title,
      task.description || null,
      task.status || "TODO",
      task.priority || "MEDIUM",
      task.due_date || null,
      userId
    ]
  );
};

/**
 * GET TASKS (FILTER + SORT)
 */
exports.getFilteredTasks = async (userId, filters) => {
  let query = "SELECT * FROM tasks WHERE user_id = ?";
  const params = [userId];

  // FILTERS
  if (filters.status) {
    query += " AND status = ?";
    params.push(filters.status);
  }

  if (filters.priority) {
    query += " AND priority = ?";
    params.push(filters.priority);
  }

  // SORTING
  if (filters.sortBy) {
    const allowedSortFields = ["due_date", "created_at", "priority"];
    const sortBy = allowedSortFields.includes(filters.sortBy)
      ? filters.sortBy
      : "created_at";

    const sortOrder = filters.order === "asc" ? "ASC" : "DESC";

    query += ` ORDER BY ${sortBy} ${sortOrder}`;
  } else {
    query += " ORDER BY created_at DESC";
  }

  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * UPDATE TASK (ONLY OWNER)
 */
exports.updateTask = async (taskId, userId, data) => {
  const [result] = await db.query(
    `UPDATE tasks 
     SET title = ?, description = ?, status = ?, priority = ?, due_date = ?
     WHERE id = ? AND user_id = ?`,
    [
      data.title,
      data.description,
      data.status,
      data.priority,
      data.due_date,
      taskId,
      userId
    ]
  );

  return result.affectedRows;
};

/**
 * DELETE TASK (ONLY OWNER)
 */
exports.deleteTask = async (taskId, userId) => {
  const [result] = await db.query(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [taskId, userId]
  );

  return result.affectedRows;
};
