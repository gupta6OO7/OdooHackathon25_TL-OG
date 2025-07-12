import { AppDataSource } from "../datasource";
import { Repository } from "typeorm";
import { Request, Response } from "express";
import { Answer } from "../entities/Answer";
import { User } from "../entities/User";
import { Question } from "../entities/Question";
import logger from "../helpers/logger";

export class AnswerService {
  private answerRepository: Repository<Answer>;
  private userRepository: Repository<User>;
  private questionRepository: Repository<Question>;

  constructor() {
    this.answerRepository = AppDataSource.getRepository(Answer);
    this.userRepository = AppDataSource.getRepository(User);
    this.questionRepository = AppDataSource.getRepository(Question);
  }

  async createAnswer(req: Request, res: Response) {
    try {
      const { title, description, userId, questionId } = req.body;

      const user = await this.userRepository.findOneBy({ id: userId });
      const question = await this.questionRepository.findOneBy({
        id: questionId,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      const answer = this.answerRepository.create({
        title,
        description,
        question,
        user,
      });

      const savedAnswer = await this.answerRepository.save(answer);

      return res.status(200).json(savedAnswer);
    } catch (error) {
      logger.error("Error creating answer:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAnswer(req: Request, res: Response) {
    try {
      const allAnswers = await this.answerRepository.find();
      if (!allAnswers) {
        return res.status(404).json({ message: "Answers not found" });
      }
      return res.status(200).json(allAnswers);
    } catch (error) {
      logger.error("Error creating answers:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
