const axios = require("axios");

exports.handleChatBot = async (req, res) => {
  // Kita ekspektasikan Frontend mengirim message, jalur, dan subJalur
  const { message, jalur, subJalur } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Pesan teks tidak boleh kosong." });
  }

  try {
    // Tembak ke layanan AI Python menggunakan DNS internal Docker 'ai-service'
    // Sesuaikan port dan rute internal jika tim AI kamu memiliki endpoint spesifik (misal: /api/chat atau /api/mbkm/chat)
    const aiResponse = await axios.post("http://ai-service:8000/api/mbkm/chat", {
      message: message,
      context_jalur: jalur || "Umum",
      context_sub_jalur: subJalur || "Umum",
    });

    // Kembalikan jawaban dari AI Agent ke Frontend
    return res.json({
      status: "success",
      reply:
        aiResponse.data?.reply ||
        aiResponse.data?.message ||
        "AI tidak memberikan respons.",
      data: aiResponse.data?.data || null,
    });
  } catch (err) {
    console.error("🔥 SKS Chatbot Error:", err.response?.data || err.message);
    return res.status(500).json({
      message: "Gagal mendapatkan respons dari AI Agent Konversi SKS.",
      detail: err.response?.data?.detail || err.message,
    });
  }
};
