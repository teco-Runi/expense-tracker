import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./DB/Database.js";
import userRoutes from "./Routers/userRouter.js";

dotenv.config({ path: "./config/config.env" });

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://expense-frontend-kiq0.onrender.com"], 
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", userRoutes);

// Test route
app.get("/", (req, res) => res.send("Backend running 🚀"));

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));