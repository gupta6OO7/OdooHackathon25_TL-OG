import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { validate } from "class-validator";
import { User } from "../entities/User";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import multer from "multer";
import path from "path";
import fs from "fs";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Configure multer for profile photo uploads
  private storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../../uploads/profiles");
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = path.extname(file.originalname);
      cb(null, `profile-${uniqueSuffix}${fileExtension}`);
    }
  });

  private fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  };

  // Multer middleware for profile photo upload
  public upload = multer({
    storage: this.storage,
    fileFilter: this.fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    }
  });

  // User signup with profile photo upload
  signup = async (req: Request, res: Response) => {
    try {
      const { name, userName, email, password, role } = req.body;

      // Validate required fields
      if (!name || !userName || !email || !password) {
        // Clean up uploaded file if validation fails
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        
        return res.status(400).json({
          success: false,
          message: "Name, username, email, and password are required"
        });
      }

      // Check password strength
      if (password.length < 6) {
        // Clean up uploaded file if validation fails
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long"
        });
      }

      // Get profile photo path if uploaded
      let profilePhotoPath = undefined;
      if (req.file) {
        profilePhotoPath = `/uploads/profiles/${req.file.filename}`;
      }

      // Create user object for validation
      const userData = {
        name,
        userName,
        email,
        password,
        role: role || "user",
        profilePhoto: profilePhotoPath
      };

      // Call auth service to create user
      const result = await this.authService.signup(userData);

      if (!result.success) {
        // Clean up uploaded file if signup fails
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        
        return res.status(400).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      console.error("Signup controller error:", error);
      
      // Clean up uploaded file on error
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error("Error cleaning up file:", cleanupError);
        }
      }
      
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
            profilePhoto: user.profilePhoto,
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
