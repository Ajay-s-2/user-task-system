const jwt = require("jsonwebtoken");

/* ======================
   VERIFY TOKEN
====================== */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach full payload
    req.user = decoded;
    req.userId = decoded.userId || decoded.adminId;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* ======================
   USER ACCESS
   (User + Admin)
====================== */
const requireUser = (req, res, next) => {
  if (!req.user.canUser) {
    return res.status(403).json({ message: "User access required" });
  }
  next();
};

/* ======================
   ADMIN ACCESS
====================== */
const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = {
  verifyToken,
  requireUser,
  requireAdmin
};
