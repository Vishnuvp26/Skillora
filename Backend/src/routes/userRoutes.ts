import express from "express";
import { UserController } from "../controllers/user/userController";
import { UserService } from "../services/userService";
// import {validRegistration} from '../middlewares/validationMiddleware'

const router = express.Router();
const userService = new UserService();
const userController = new UserController(userService);

router.post("/register", userController.register.bind(userController));
router.post("/verify-otp", userController.verifyOtp.bind(userController));

export default router;