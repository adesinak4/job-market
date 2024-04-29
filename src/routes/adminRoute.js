const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const { isSuperAdmin, authMiddleware, upload } = require("../middleware/authMiddleware");

// Add a new admin
router.post("/register", authMiddleware, isSuperAdmin, adminController.createAdmin);

// Login
router.post("/login", adminController.loginAdmin);

// Refresh Token
router.put("/refresh", adminController.refreshToken);

// Create a new user with optional resume upload
router.post('/add', authMiddleware, upload.single('resume'), userController.createUser);

// Fetch users with optional filters
router.get('/fetch', authMiddleware, userController.fetchUsers);

module.exports = router;