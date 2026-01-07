const adminUserService = require("../services/admin.user.service");

/**
 * Get all users
 * Admin-only
 */
const list = async (req, res) => {
  try {
    const users = await adminUserService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/**
 * Enable / Disable a user
 * Admin-only
 */
const updateStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    await adminUserService.updateUserStatus(userId, status);
    res.json({ message: "User status updated successfully" });
  } catch (err) {
    console.error("Update user status error:", err.message);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

module.exports = {
  list,
  updateStatus
};
