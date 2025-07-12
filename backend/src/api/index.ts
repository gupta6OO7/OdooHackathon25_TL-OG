import { Router } from "express";
import { DummyController } from "../controller/DummyController";

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
      dummy: "/api/dummy"
    }
  });
});

// Dummy API routes
router.get("/dummy", DummyController.getDummyData);
router.post("/dummy", DummyController.createDummyData);
router.put("/dummy/:id", DummyController.updateDummyData);
router.delete("/dummy/:id", DummyController.deleteDummyData);

export default router;
