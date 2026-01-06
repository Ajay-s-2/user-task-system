const adminTaskService = require("../services/admin.task.service");

// Get all tasks
exports.getAllTasks = async (req, res) => {
  const tasks = await adminTaskService.getAllTasks();
  res.json(tasks);
};

// Update task status
exports.updateStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  await adminTaskService.updateTaskStatus(taskId, status);
  res.json({ message: "Task status updated" });
};

// Reassign task
exports.reassign = async (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.body;

  await adminTaskService.reassignTask(taskId, userId);
  res.json({ message: "Task reassigned successfully" });
};
