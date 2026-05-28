const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

/**
 * Chat Routes
 * Routes untuk MBKM Chatbot
 */

// POST /api/chat - Send message to chatbot
router.post("/", chatController.chat);

// GET /api/chat/health - Health check
router.get("/health", chatController.healthCheck);

module.exports = router;
