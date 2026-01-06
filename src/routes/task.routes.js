const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const controller = require("../controllers/task.controller");

router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.list);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.remove);

module.exports = router;
