import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../datasource";
import { User, UserRole } from "../entities/User";
import { Image } from "../entities/Image";
import { Repository } from "typeorm";
import logger from "../helpers/logger";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  userName: string;
  email: string;
  password: string;
  role?: UserRole;
  imageBuffer?: string; // Base64 encoded image
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      name: string;
      userName: string;
      email: string;
      role: UserRole;
      imageId?: string;
    };
  };
}

export class AuthService {
  private userRepository: Repository<User>;
  private imageRepository: Repository<Image>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.imageRepository = AppDataSource.getRepository(Image);
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUserByEmail = await this.userRepository.findOne({
        where: { email: userData.email }
      });

      if (existingUserByEmail) {
        return {
          success: false,
          message: "User with this email already exists"
        };
      }

      const existingUserByUsername = await this.userRepository.findOne({
        where: { userName: userData.userName }
      });

      if (existingUserByUsername) {
        return {
          success: false,
          message: "Username is already taken"
        };
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create image if provided
      let savedImage: Image | undefined;
      if (userData.imageBuffer) {
        const image = this.imageRepository.create({
          bufferString: userData.imageBuffer
        });
        savedImage = await this.imageRepository.save(image);
      }

      // Create new user
      const user = this.userRepository.create({
        name: userData.name,
        userName: userData.userName,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || UserRole.USER,
        image: savedImage
      });

      const savedUser = await this.userRepository.save(user);

      // Generate JWT token
      const token = this.generateToken(savedUser);

      return {
        success: true,
        message: "User registered successfully",
        data: {
          token,
          user: {
            id: savedUser.id,
            name: savedUser.name,
            userName: savedUser.userName,
            email: savedUser.email,
            role: savedUser.role,
            imageId: savedUser.image?.id
          }
        }
      };
    } catch (error) {
      logger.error("Signup error:", error);
      return {
        success: false,
        message: "Internal server error during signup"
      };
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Find user by email with image relation
      const user = await this.userRepository.findOne({
        where: { email: credentials.email },
        relations: ["image"]
      });

      if (!user) {
        return {
          success: false,
          message: "Invalid email or password"
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          message: "Account is deactivated. Please contact support."
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid email or password"
        };
      }

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            userName: user.userName,
            email: user.email,
            role: user.role,
            imageId: user.image?.id
          }
        }
      };
    } catch (error) {
      logger.error("Login error:", error);
      return {
        success: false,
        message: "Internal server error during login"
      };
    }
  }

  private generateToken(user: User): string {
    const payload: object = {
      userId: user.id,
      email: user.email,
      userName: user.userName,
      role: user.role,
      name: user.name
    };

    const secret: string = process.env.JWT_SECRET || "your-super-secret-jwt-key";
    const expiresIn: string = process.env.JWT_EXPIRES_IN || "7d";

    return jwt.sign(payload, secret, { expiresIn: expiresIn } as jwt.SignOptions);
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const secret: string = process.env.JWT_SECRET || "your-super-secret-jwt-key";
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["image"]
      });
      return user;
    } catch (error) {
      logger.error("Get user by ID error:", error);
      return null;
    }
  }
}
