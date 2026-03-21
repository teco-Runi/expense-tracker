import express from "express";
import { registerControllers, loginControllers, setAvatarController } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerControllers);
router.post("/login", loginControllers);
router.post("/setAvatar", setAvatarController); // <-- NEW

export default router;