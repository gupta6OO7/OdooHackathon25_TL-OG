import { Request, Response } from "express";
import { QuestionService } from "../services/QuestionService";
import logger from "../helpers/logger";
export class QuestionController {
  private questionService: QuestionService;

  constructor() {
    this.questionService = new QuestionService();
  }

  createQuestionController = async (req: Request, res: Response) => {
    try {
      await this.questionService.createQuestion(req, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };


  getAllQuestionController = async (req: Request, res: Response) => {
    try {
      await this.questionService.getAllQuestion(req, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  getQuestionController = async (req: Request, res: Response) => {
    try {
      await this.questionService.getQuestion(req, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  deleteQuestionController = async (req: Request, res: Response) => {
    try {
      await this.questionService.deleteQuestion(req, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  getQuestionAnswersController = async (req: Request, res: Response) => {
    try {
      await this.questionService.getQuestionAnswers(req, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
