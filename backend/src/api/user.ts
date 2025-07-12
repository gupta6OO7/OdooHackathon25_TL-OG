import { Router } from "express";
import { UserController } from "../controller/UserController";
import { authMiddleware } from "../middlewares/authorization";

const router = Router();
const userController = new UserController();

//  TODO: add authorization
router.get("/:userId", userController.getUserController);
router.get("/:userId/notification", userController.getUserNotificationController);

export default router;
