const express = require("express");
const router = express.Router();
const plannerController = require("../controllers/plannerController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig"); // Menggunakan konfigurasi multer milik backend-mu

// Daftarkan endpoint POST untuk generate plan studi
router.post(
  "/generate-plan",
  authMiddleware,
  upload.single("transcript"),
  plannerController.generateSemesterPlan,
);

module.exports = router;
