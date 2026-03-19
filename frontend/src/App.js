import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// import your routes
import authRoutes from "./Routers/auth.js"; // adjust path if needed

dotenv.config();

const app = express();

// ✅ CORS FIX (VERY IMPORTANT)
app.use(cors({
  origin: "https://expense-frontend-kiq0.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Test route (optional)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect DB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});