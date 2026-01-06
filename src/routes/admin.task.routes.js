const router = require("express").Router();
const controller = require("../controllers/admin.task.controller");
const { verifyToken, requireAdmin } = require("../middlewares/auth.middleware");

// Admin-only routes
router.get(
  "/tasks",
  verifyToken,
  requireAdmin,
  controller.getAllTasks
);

router.put(
  "/tasks/:taskId/status",
  verifyToken,
  requireAdmin,
  controller.updateStatus
);

router.put(
  "/tasks/:taskId/reassign",
  verifyToken,
  requireAdmin,
  controller.reassign
);

module.exports = router;
