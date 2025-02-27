import { HttpStatus } from "../../constants/statusContstants";
import { IUserController } from "../../interfaces/user/IUserController";
import { IUserService } from "../../interfaces/user/IUserService";
import { Request, Response, NextFunction } from "express";

export class UserController implements IUserController {
    constructor(private _userService: IUserService) {}

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this._userService.register(req.body);
            console.log('Response', response)
            res.status(HttpStatus.OK).json({ message: response.message });
        } catch (error) {
            next(error);
        }
    }

    async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, otp, userData } = req.body;
            const response = await this._userService.verifyOtpAndCreateUser(email, otp, userData);
            res.status(HttpStatus.CREATED).json({ message: response.message });
        } catch (error) {
            next(error);
        }   
    }
}