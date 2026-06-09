const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // Pastikan middleware ini sudah di-import

// Rute Publik
router.post("/register", authController.register);
router.post("/login", authController.login);

// Rute Terproteksi JWT (User harus login untuk ganti password)
router.put("/change-password", authMiddleware, authController.changePassword);

module.exports = router;
