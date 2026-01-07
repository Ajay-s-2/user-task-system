const service = require("../services/admin.task.service");

/**
 * Get all tasks (admin)
 */
exports.list = async (req, res) => {
  const tasks = await service.getAllTasks();
  res.json(tasks);
};

/**
 * Delete any task (admin)
 */
exports.remove = async (req, res) => {
  await service.deleteAnyTask(req.params.id, req.user.adminId);
  res.json({ message: "Task deleted by admin" });
};
