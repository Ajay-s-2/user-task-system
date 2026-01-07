const express = require("express");
const router = express.Router();

const controller = require("../controllers/task.controller");
const {
  verifyToken,
  requireUser
} = require("../middlewares/auth.middleware");

/**
 * USER + ADMIN-AS-USER TASK ROUTES
 */

router.post("/", verifyToken, requireUser, controller.create);
router.get("/", verifyToken, requireUser, controller.list);
router.put("/:id", verifyToken, requireUser, controller.update);
router.delete("/:id", verifyToken, requireUser, controller.remove);

module.exports = router;
