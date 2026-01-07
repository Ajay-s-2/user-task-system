const express = require("express");
const router = express.Router();

const controller = require("../controllers/admin.user.controller");
const {
  verifyToken,
  requireAdmin
} = require("../middlewares/auth.middleware");

/**
 * ADMIN USER MANAGEMENT ROUTES
 * Base path: /api/admin
 */

// Get all users
router.get("/users", verifyToken, requireAdmin, controller.list);

// Enable / Disable user
router.put(
  "/users/:id/status",
  verifyToken,
  requireAdmin,
  controller.updateStatus
);

module.exports = router;
