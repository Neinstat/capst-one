const express = require("express");
const router = express.Router();
const academicController = require("../controllers/academicController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig"); // Menggunakan multer penangkap PDF kita

// Endpoint penanganan analisis transkrip akademik bertenaga AI
// Frontend mengirimkan key file bernama 'transcript' melalui FormData
router.post(
  "/analyze",
  authMiddleware,
  upload.single("transcript"),
  academicController.analyzeTranscript,
);

module.exports = router;
