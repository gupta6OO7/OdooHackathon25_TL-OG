import { Router } from "express";
import { authMiddleware, AuthenticatedRequest } from "../middlewares/authMiddleware";
import { Response } from "express";

const router = Router();

// Example: Public route (no authentication required)
router.get("/public", (req, res) => {
  res.json({
    success: true,
    message: "This is a public endpoint accessible to everyone",
    timestamp: new Date().toISOString()
  });
});

// Example: Protected route (requires authentication)
router.get("/protected", authMiddleware.verifyToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: "This is a protected endpoint",
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Example: Admin only route
router.get("/admin-only", authMiddleware.requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: "This endpoint is only accessible to admins",
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Example: Admin or Moderator route
router.get("/admin-or-moderator", authMiddleware.requireAdminOrModerator, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: "This endpoint is accessible to admins and moderators",
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Example: Custom role check
router.get("/custom-role", authMiddleware.requireRole(["admin", "moderator", "premium_user"]), (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: "This endpoint requires specific roles",
    allowedRoles: ["admin", "moderator", "premium_user"],
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Example: Optional authentication (works with or without token)
router.get("/optional-auth", authMiddleware.optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const isAuthenticated = !!req.user;
  
  res.json({
    success: true,
    message: "This endpoint works with or without authentication",
    isAuthenticated,
    user: req.user || null,
    timestamp: new Date().toISOString()
  });
});

// Example: User-specific data (must be authenticated)
router.get("/my-data", authMiddleware.verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Here you would typically fetch user-specific data from database
    // using req.user.userId
    
    res.json({
      success: true,
      message: "User-specific data retrieved successfully",
      userId: req.user?.userId,
      data: {
        // Mock user-specific data
        preferences: { theme: "dark", language: "en" },
        stats: { loginCount: 42, lastLogin: new Date().toISOString() }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving user data"
    });
  }
});

export default router;
