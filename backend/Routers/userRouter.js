import express from "express";
import { registerControllers, loginControllers } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerControllers);
router.post("/login", loginControllers);

export default router;