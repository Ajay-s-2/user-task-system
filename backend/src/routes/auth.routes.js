const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

/**
 * AUTH ROUTES
 * Base path: /api/auth
 */

// User/Admin login
router.post("/login", authController.login);

// User self-registration
router.post("/register", authController.register);

module.exports = router;
