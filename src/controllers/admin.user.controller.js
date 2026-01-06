const db = require("../config/db");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, email, role, status FROM users"
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Update user status (ACTIVE / DISABLED)
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query(
      "UPDATE users SET status = ? WHERE id = ?",
      [status, id]
    );
    res.json({ message: "User status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// Make user ADMIN
exports.updateRole = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      "UPDATE users SET role = 'ADMIN' WHERE id = ?",
      [id]
    );
    res.json({ message: "User promoted to ADMIN" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update role" });
  }
};
