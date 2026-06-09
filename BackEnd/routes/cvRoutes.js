const express = require("express");
const router = express.Router();
const multer = require("multer");
const cvController = require("../controllers/cvController");
const authMiddleware = require("../middleware/authMiddleware");

// Konfigurasi folder sementara untuk file PDF
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Hanya file berformat PDF yang diizinkan."), false);
    }
  },
});

// Endpoint POST /api/cv/review
// Middleware authMiddleware mengecek Token JWT Mahasiswa, upload.single membaca file dari form
router.post("/review", authMiddleware, upload.single("cv_file"), cvController.reviewCV);

module.exports = router;