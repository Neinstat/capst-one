const express = require("express");
const router = express.Router();
const opportunityController = require("../controllers/opportunityController");
const authMiddleware = require("../middleware/authMiddleware");

// Akses publik untuk melihat semua lowongan kerja/magang
router.get("/", opportunityController.getAllOpportunities);

// Akses terproteksi untuk memposting lowongan baru
router.post("/", authMiddleware, opportunityController.createOpportunity);

module.exports = router;
