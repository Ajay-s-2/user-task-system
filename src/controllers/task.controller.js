const taskService = require("../services/task.service");

/**
 * CREATE TASK
 */
exports.create = async (req, res, next) => {
  try {
    const { title, description, status, priority, due_date } = req.body;

    //BACKEND VALIDATION (CORRECT PLACE)
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    if (status && !["TODO", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (priority && !["LOW", "MEDIUM", "HIGH"].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value" });
    }

    await taskService.createTask(req.body, req.userId);

    res.status(201).json({ message: "Task created" });
  } catch (err) {
    next(err);
  }
};

/**
 * LIST TASKS (with filter & sort)
 */
exports.list = async (req, res, next) => {
  try {
    const tasks = await taskService.getFilteredTasks(
      req.userId,
      req.query
    );
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

/**
 * UPDATE TASK
 */
exports.update = async (req, res, next) => {
  try {
    const { title, status, priority } = req.body;

    // BACKEND VALIDATION
    if (title !== undefined && title.trim() === "") {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    if (status && !["TODO", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (priority && !["LOW", "MEDIUM", "HIGH"].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value" });
    }

    const updated = await taskService.updateTask(
      req.params.id,
      req.userId,
      req.body
    );

    if (!updated) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json({ message: "Task updated successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE TASK
 */
exports.remove = async (req, res, next) => {
  try {
    const deleted = await taskService.deleteTask(
      req.params.id,
      req.userId
    );

    if (!deleted) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
