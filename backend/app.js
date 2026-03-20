import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";

dotenv.config({ path: "./config/config.env" });

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Logger
app.use(morgan("dev"));

// CORS - allow frontend domain
app.use(
  cors({
    origin: "https://expense-frontend-kiq0.onrender.com", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", userRoutes);        // Auth routes: register, login, setAvatar
app.use("/api/v1", transactionRoutes);  // Transaction routes: add, get, update, delete

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Handle unknown routes
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});