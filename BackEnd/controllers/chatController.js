const axios = require("axios");

/**
 * Chat Controller
 * Forwards chat requests to AI service (MBKM chatbot)
 */

// Get AI service URL from environment variable
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

/**
 * POST /api/chat
 * Forwards user message to AI service and returns response
 */
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Pesan tidak boleh kosong",
      });
    }

    // Forward request to AI service
    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/api/mbkm/chat`,
      { message },
      {
        timeout: 30000, // 30 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return AI response to frontend
    return res.status(200).json(aiResponse.data);
  } catch (error) {
    console.error("Chat error:", error.message);

    // Handle different error types
    if (error.response) {
      // AI service returned an error
      return res.status(error.response.status || 500).json({
        error: error.response.data?.detail || "AI Service error",
      });
    } else if (error.code === "ECONNREFUSED") {
      // AI service is not running
      return res.status(503).json({
        error: "AI Service tidak tersedia. Pastikan service berjalan di http://localhost:8000",
      });
    } else if (error.code === "ENOTFOUND") {
      // AI service URL not found
      return res.status(503).json({
        error: "AI Service tidak ditemukan",
      });
    } else {
      // Generic error
      return res.status(500).json({
        error: "Terjadi kesalahan pada server",
      });
    }
  }
};

/**
 * GET /api/chat/health
 * Health check for chat service
 */
exports.healthCheck = async (req, res) => {
  try {
    const aiResponse = await axios.get(
      `${AI_SERVICE_URL}/api/mbkm/health`,
      { timeout: 5000 }
    );

    return res.status(200).json({
      status: "ok",
      message: "Chat service connected to AI",
      ai_service: aiResponse.data,
    });
  } catch (error) {
    return res.status(503).json({
      status: "unavailable",
      message: "Chat service cannot connect to AI",
      error: error.message,
    });
  }
};
