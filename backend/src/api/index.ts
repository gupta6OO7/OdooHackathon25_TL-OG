import { Router } from "express";
import { DummyController } from "../controller/DummyController";
import authRoutes from "./auth";
import exampleRoutes from "./examples";
import imageRoutes from "./images";

const router = Router();

// Health check for API
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString()
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
        logout: "/api/auth/logout"
      },
      examples: {
        public: "/api/examples/public",
        protected: "/api/examples/protected",
        adminOnly: "/api/examples/admin-only",
        adminOrModerator: "/api/examples/admin-or-moderator",
        customRole: "/api/examples/custom-role",
        optionalAuth: "/api/examples/optional-auth",
        myData: "/api/examples/my-data"
      },
      images: {
        getById: "/api/images/:id"
      },
      dummy: "/api/dummy"
    }
  });
});

// Authentication routes
router.use("/auth", authRoutes);

// Image routes
router.use("/images", imageRoutes);

// Example routes demonstrating authentication middleware usage
router.use("/examples", exampleRoutes);

// Dummy API routes
router.get("/dummy", DummyController.getDummyData);
router.post("/dummy", DummyController.createDummyData);
router.put("/dummy/:id", DummyController.updateDummyData);
router.delete("/dummy/:id", DummyController.deleteDummyData);

export default router;
