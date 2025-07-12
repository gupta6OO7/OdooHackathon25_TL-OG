import { Router } from "express";
import { AuthController } from "../controller/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const authController = new AuthController();

// Public routes (no authentication required)
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected routes (authentication required)
router.get("/profile", authMiddleware.verifyToken, authController.getProfile);
router.post("/verify-token", authMiddleware.verifyToken, authController.verifyToken);
router.post("/logout", authMiddleware.verifyToken, authController.logout);

export default router;
