const router = require("express").Router();
const { verifyToken, requireAdmin } = require("../middlewares/auth.middleware");
const controller = require("../controllers/admin.user.controller");

router.get("/users", verifyToken, requireAdmin, controller.getAllUsers);
router.put("/users/:id/status", verifyToken, requireAdmin, controller.updateStatus);
router.put("/users/:id/role", verifyToken, requireAdmin, controller.updateRole);

module.exports = router;
