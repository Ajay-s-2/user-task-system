const jwt = require("jsonwebtoken");

/**
 * Verify JWT token
 * Attaches decoded payload to req.user
 */
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, adminId, isAdmin, canUser }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * Allow only normal user actions
 * Admin is also allowed because admin has canUser = true
 */
exports.requireUser = (req, res, next) => {
  if (!req.user || !req.user.canUser) {
    return res.status(403).json({ message: "User access required" });
  }
  next();
};

/**
 * Allow only admin actions
 */
exports.requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
