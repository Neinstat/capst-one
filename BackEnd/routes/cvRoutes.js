const express = require("express");
const router = express.Router();
const cvController = require("../controllers/cvController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig"); // Menggunakan multer penangkap berkas kita

// Endpoint penanganan ulasan CV berbasis AI
// Kita gunakan key berkas 'cv_file' saat diunggah dari FormData Frontend
router.post(
  "/review",
  authMiddleware,
  upload.single("cv_file"),
  cvController.reviewCV,
);

module.exports = router;
