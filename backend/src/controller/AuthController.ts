import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { UserRole } from "../entities/User";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // User signup with base64 image upload
  signup = async (req: Request, res: Response) => {
    try {
      const { name, userName, email, password, role, imageBuffer } = req.body;

      // Validate required fields
      if (!name || !userName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, username, email, and password are required"
        });
      }

      // Check password strength
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long"
        });
      }

      // Validate role if provided
      let userRole: UserRole = UserRole.USER;
      if (role) {
        if (role === "ADMIN" || role === UserRole.ADMIN) {
          userRole = UserRole.ADMIN;
        } else if (role === "USER" || role === UserRole.USER) {
          userRole = UserRole.USER;
        } else {
          return res.status(400).json({
            success: false,
            message: "Role must be either ADMIN or USER"
          });
        }
      }

      // Create user object for validation
      const userData = {
        name,
        userName,
        email,
        password,
        role: userRole,
        imageBuffer: imageBuffer // Base64 encoded image string
      };

      // Call auth service to create user
      const result = await this.authService.signup(userData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      console.error("Signup controller error:", error);
      
      return res.status(500).json({
        success: false,
        message: "Internal server error during signup"
      });
    }
  };

  // User login
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required"
        });
      }

      // Call auth service to authenticate user
      const result = await this.authService.login({ email, password });

      if (!result.success) {
        return res.status(401).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Login controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during login"
      });
    }
  };

  // Get current user profile
  getProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      const user = await this.authService.getUserById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: {
          user: {
            id: user.id,
            name: user.name,
            userName: user.userName,
            email: user.email,
            role: user.role,
            imageId: user.image?.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        }
      });
    } catch (error) {
      console.error("Get profile controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error while fetching profile"
      });
    }
  };

  // Verify token endpoint
  verifyToken = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Invalid token"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Token is valid",
        data: {
          user: req.user
        }
      });
    } catch (error) {
      console.error("Verify token controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error while verifying token"
      });
    }
  };

  // Logout (client-side token removal, but can be used for logging)
  logout = async (req: AuthenticatedRequest, res: Response) => {
    try {
      // In JWT, logout is typically handled client-side by removing the token
      // This endpoint can be used for logging purposes or future token blacklisting
      
      return res.status(200).json({
        success: true,
        message: "Logout successful"
      });
    } catch (error) {
      console.error("Logout controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during logout"
      });
    }
  };
}
