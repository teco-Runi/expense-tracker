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
const port = process.env.PORT;

connectDB();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "https://expense-frontend-kiq0.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ ADD THESE TWO LINES
app.use("/api/auth", userRoutes);
app.use("/api/v1", transactionRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});