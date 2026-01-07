const taskService = require("../services/task.service");

/**
 * Create a new task
 * Allowed: User & Admin (admin acts as user)
 */
const create = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.adminId;

    await taskService.createTask(userId, req.body);
    res.json({ message: "Task created successfully" });
  } catch (err) {
    console.error("Create task error:", err.message);
    res.status(500).json({ message: "Failed to create task" });
  }
};

/**
 * Get logged-in user's tasks
 */
const list = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.adminId;
    const tasks = await taskService.getUserTasks(userId);

    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err.message);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};


/**
 * Create task
 */
exports.create = async (req, res) => {
  const userId = req.user.userId || req.user.adminId;
  await taskService.createTask(userId, req.body);
  res.json({ message: "Task created" });
};

/**
 * Get tasks
 */
exports.list = async (req, res) => {
  const userId = req.user.userId || req.user.adminId;
  const tasks = await taskService.getUserTasks(userId);
  res.json(tasks);
};

/**
 * UPDATE TASK
 */
exports.update = async (req, res) => {
  const userId = req.user.userId || req.user.adminId;
  await taskService.updateTask(req.params.id, userId, req.body);
  res.json({ message: "Task updated" });
};

/**
 * DELETE TASK
 */
exports.remove = async (req, res) => {
  const userId = req.user.userId || req.user.adminId;
  await taskService.deleteTask(req.params.id, userId);
  res.json({ message: "Task deleted" });
};
