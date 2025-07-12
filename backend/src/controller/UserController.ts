import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import logger from "../helpers/logger";
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUserController = async (req: Request, res: Response) => {
    try {
      await this.userService.getUser(req, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  getUserNotificationController = async (req: Request, res: Response) => {
    try {
      await this.userService.getUserNotification(req, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
