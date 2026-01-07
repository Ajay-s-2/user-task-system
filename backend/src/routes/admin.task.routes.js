const express = require("express");
const router = express.Router();

const controller = require("../controllers/admin.task.controller");
const {
  verifyToken,
  requireAdmin
} = require("../middlewares/auth.middleware");

/**
 * ADMIN TASK ROUTES
 */

router.get("/tasks", verifyToken, requireAdmin, controller.list);
router.delete("/tasks/:id", verifyToken, requireAdmin, controller.remove);

module.exports = router;
