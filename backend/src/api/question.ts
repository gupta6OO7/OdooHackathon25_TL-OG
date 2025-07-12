import { Router } from "express";
import { QuestionController } from "../controller/QuestionController";
import { authMiddleware } from "../middlewares/authorization";

const router = Router();
const questionController = new QuestionController();

//  TODO: add authorization
router.post("/", questionController.createQuestionController);
router.get("/", questionController.getAllQuestionController);
router.get("/:questionId", questionController.getQuestionController);
router.delete("/:questionId", questionController.deleteQuestionController);
router.get("/answers", questionController.getQuestionAnswersController);

export default router;
