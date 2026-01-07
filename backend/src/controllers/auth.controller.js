const authService = require("../services/auth.service");

/**
 * User self-registration
 * Public API
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    await authService.registerUser(req.body);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(400).json({ message: "Registration failed" });
  }
};

/**
 * User / Admin login
 * Public API
 */
const login = async (req, res) => {
  try {
    const token = await authService.loginUser(req.body);

    if (!token) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};

module.exports = {
  register,
  login
};
