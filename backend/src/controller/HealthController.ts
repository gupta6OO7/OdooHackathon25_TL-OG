// Example controller
import { Request, Response } from "express";

export class HealthController {
  static getHealth = (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  };

  static getVersion = (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development"
    });
  };
}
