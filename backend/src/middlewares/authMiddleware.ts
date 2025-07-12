import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    userName: string;
    role: string;
    name: string;
  };
}

export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Middleware to verify JWT token
  verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Access token is missing or invalid format. Please provide a valid Bearer token."
        });
      }

      const token = authHeader.substring(7); // Remove "Bearer " prefix

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Access token is required"
        });
      }

      // Verify the token
      const decoded = await this.authService.verifyToken(token);
      
      // Attach user information to request object
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        userName: decoded.userName,
        role: decoded.role,
        name: decoded.name
      };

      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please login again."
      });
    }
  };

  // Middleware to check user roles
  requireRole = (allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions. Required roles: " + allowedRoles.join(", ")
        });
      }

      next();
    };
  };

  // Middleware to check if user is admin
  requireAdmin = this.requireRole(["admin"]);

  // Middleware to check if user is admin or moderator
  requireAdminOrModerator = this.requireRole(["admin", "moderator"]);

  // Optional authentication - doesn't fail if no token provided
  optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(); // Continue without authentication
      }

      const token = authHeader.substring(7);

      if (!token) {
        return next(); // Continue without authentication
      }

      try {
        const decoded = await this.authService.verifyToken(token);
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          userName: decoded.userName,
          role: decoded.role,
          name: decoded.name
        };
      } catch (error) {
        // Token is invalid, but continue without authentication
        console.log("Optional auth failed:", error);
      }

      next();
    } catch (error) {
      console.error("Optional auth error:", error);
      next(); // Continue even if there's an error
    }
  };
}

// Create and export middleware instance
export const authMiddleware = new AuthMiddleware();
