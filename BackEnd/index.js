require("dotenv").config(); // WAJIB DI BARIS PERTAMA

const express = require("express");
const cors = require("cors");
// Import routes dan config lainnya setelah dotenv
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const chatRoutes = require("./routes/chatRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const plannerRoutes = require("./routes/plannerRoutes");

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Spark DTI running on port ${PORT}`);
});
