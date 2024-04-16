const jwtUtils = require("../utils/jwtUtils");
const blacklist = require("../utils/blacklist");
const Admin = require("../models/admin");
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Authorization denied. No token provided." });
  }

  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ msg: "Unauthorized - Invalid token format" });
  }

  const adminToken = tokenParts[1];

  try {
    if (blacklist.isTokenBlacklisted(token)) {
      return res
        .status(401)
        .json({ msg: "Token is blacklisted. Please log in again." });
    }

    const decoded = jwtUtils.verifyToken(adminToken);
    req.admin = decoded;
    next();
  } catch (error) {
    blacklist.addToBlacklist(token);
    res.status(401).json({ msg: "Token is not valid. Please log in again." });
  }
};

// const isAdmin = (req, res, next) => {
//   if (!req.admin || (req.admin.role !== "admin" && req.admin.role !== "superadmin")) {
//     return res.status(403).json({ msg: "Forbidden - Admin access required" });
//   }
//   next();
// };

const isSuperAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== "superadmin") {
    return res.status(403).json({ msg: "Forbidden - Super Admin access required" });
  }
  next();
};

module.exports = {
  upload,
  authMiddleware,
  // isAdmin,
  isSuperAdmin
};
