const db = require("../config/db");

// Get all tasks with user info
exports.getAllTasks = async () => {
  const [rows] = await db.query(`
    SELECT 
      tasks.id,
      tasks.title,
      tasks.description,
      tasks.status,
      tasks.created_at,
      users.id AS user_id,
      users.name AS user_name,
      users.email AS user_email
    FROM tasks
    JOIN users ON tasks.user_id = users.id
  `);

  return rows;
};

// Update task status
exports.updateTaskStatus = async (taskId, status) => {
  await db.query(
    "UPDATE tasks SET status = ? WHERE id = ?",
    [status, taskId]
  );
};

// Reassign task to another user
exports.reassignTask = async (taskId, userId) => {
  await db.query(
    "UPDATE tasks SET user_id = ? WHERE id = ?",
    [userId, taskId]
  );
};
