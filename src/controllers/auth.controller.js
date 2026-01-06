const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, status) VALUES (?, ?, ?, 'ACTIVE')",
      [name, email, hash]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    /* ======================
       ADMIN LOGIN
    ====================== */
    const [admins] = await db.query(
      "SELECT * FROM admins WHERE email = ? AND status = 'ACTIVE'",
      [email]
    );

    if (admins.length) {
      const admin = admins[0];
      const match = await bcrypt.compare(password, admin.password);
      if (!match) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        {
          adminId: admin.id,
          isAdmin: true,
          canUser: true
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({ token });
    }

    /* ======================
       USER LOGIN
    ====================== */
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? AND status = 'ACTIVE'",
      [email]
    );

    if (!users.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: false,
        canUser: true
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

