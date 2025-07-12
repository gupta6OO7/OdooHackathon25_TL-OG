import { Router } from "express";
import { QuestionController } from "../controller/QuestionController";

const router = Router();
const questionController = new QuestionController();

//  TODO: add authorization
router.post("/", questionController.createQuestionController);
router.get("/", questionController.getQuestionController);
router.get("/answers", questionController.getQuestionAnswersController);

export default router;
