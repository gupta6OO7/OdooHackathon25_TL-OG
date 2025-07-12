import { Router } from "express";
import authRoutes from "./auth";
import exampleRoutes from "./examples";
import imageRoutes from "./images";
import questionRoutes from "./question";
import answerRoutes from "./answer";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// API version info
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AskUp API v1.0.0",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: {
        signup: "/api/auth/signup",
        login: "/api/auth/login",
        profile: "/api/auth/profile",
        verifyToken: "/api/auth/verify-token",
        logout: "/api/auth/logout",
      },
      examples: {
        public: "/api/examples/public",
        protected: "/api/examples/protected",
        adminOnly: "/api/examples/admin-only",
        adminOrModerator: "/api/examples/admin-or-moderator",
        customRole: "/api/examples/custom-role",
        optionalAuth: "/api/examples/optional-auth",
        myData: "/api/examples/my-data",
      },
      images: {
        getById: "/api/images/:id",
      },
      dummy: "/api/dummy",
    },
  });
});

// Authentication routes
router.use("/auth", authRoutes);

// Image routes
router.use("/images", imageRoutes);

// Example routes demonstrating authentication middleware usage
router.use("/examples", exampleRoutes);

// Question routes
router.use("/questions", questionRoutes);

// Answer routes
router.use("/answers", answerRoutes);

export default router;
