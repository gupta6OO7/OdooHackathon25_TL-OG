import { Router } from "express";
import { AnswerController } from "../controller/AnswerController";

const router = Router();
const answerController = new AnswerController();

//  TODO: add authorization
router.post("/", answerController.createAnswerController);
router.get("/", answerController.getAnswerController)

export default router;
