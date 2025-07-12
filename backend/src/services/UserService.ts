import { AppDataSource } from "../datasource";
import { Repository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entities/User";
import logger from "../helpers/logger";

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async getUser(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["answers", "questions"]
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      logger.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getUserNotification(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!user.notifications) {
        user.notifications = {"unread":[], 'read':[]};
      }
      const notifs = JSON.parse(JSON.stringify(user.notifications));
      user.notifications.read = [...user.notifications.unread, ...user.notifications.read];
      user.notifications.unread = [];
      await this.userRepository.save(user);
      return res.status(200).json(notifs);
    } catch (error) {
      logger.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  
}
