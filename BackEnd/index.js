require("dotenv").config(); // WAJIB DI BARIS PERTAMA

const express = require("express");
const cors = require("cors");
// Import routes dan config lainnya setelah dotenv
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const chatRoutes = require("./routes/chatRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const academicRoutes = require("./routes/academicRoutes");
const cvRoutes = require("./routes/cvRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Logging untuk memastikan env terbaca (Hapus jika sudah lancar)
console.log(
  "DEBUG: JWT_SECRET is",
  process.env.JWT_SECRET ? "LOADED" : "MISSING",
);

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/courses", academicRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/admin", adminRoutes);

// Jalur penanganan rute jika tidak ditemukan (404) di tingkat backend
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Rute URL ${req.originalUrl} tidak ditemukan di server backend.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Server Error:", err.stack);
  res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan internal pada server.",
    detail: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server SPARK DTI Backend berjalan aman di port ${PORT}`);
});
