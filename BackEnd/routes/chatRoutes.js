const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware"); // Amankan rute dengan login

// Endpoint utama untuk interaksi chatbot SKS
router.post("/", authMiddleware, chatController.handleChatBot);

module.exports = router;
