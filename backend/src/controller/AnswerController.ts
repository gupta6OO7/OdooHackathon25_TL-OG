import { Request, Response } from "express";
import { AnswerService } from "../services/AnswerService";
import logger from "../helpers/logger";
export class AnswerController {
  private answerService: AnswerService;

  constructor() {
    this.answerService = new AnswerService();
  }

  createAnswerController = async (req: Request, res: Response) => {
    try {
      await this.answerService.createAnswer(req, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };


  getAnswerController = async (req: Request, res: Response) => {
    try {
      await this.answerService.getAnswer(req, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
