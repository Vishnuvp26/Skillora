import express from "express";
import { UserRepository } from "../../repository/userRepository";
import { UserService } from "../../services/user/userService";
import { UserController } from "../../controllers/user/userController";
// import { validRegistration } from '../middlewares/validationMiddleware';

const router = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post("/register", userController.register.bind(userController));
router.post("/verify-otp", userController.verifyOtp.bind(userController));
router.post("/resend-otp", userController.resendOtp.bind(userController));
router.post("/login", userController.login.bind(userController));
router.post("/logout", userController.logout.bind(userController));
router.post('/refresh-token', userController.refreshAccessToken.bind(userController))

export default router;