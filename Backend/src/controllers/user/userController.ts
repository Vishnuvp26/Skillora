import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants";
import { IUserController } from "../../interfaces/user/IUserController";
import { IUserService } from "../../interfaces/user/IUserService";
import { Request, Response, NextFunction, response } from "express";

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
    };

    async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, otp, userData } = req.body;
            const response = await this._userService.verifyOtpAndCreateUser(email, otp, userData);
            res.status(HttpStatus.CREATED).json({ message: response.message });
        } catch (error) {
            next(error);
        }
    };

    async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;
            const response = await this._userService.resendOtp(email);
            res.status(HttpStatus.OK).json({ message: response.message });
        } catch (error) {
            next(error);
        }
    };

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const response = await this._userService.login(email, password);
    
            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
    
            res.status(HttpStatus.OK).json({
                message: response.message,
                accessToken: response.accessToken,
                role: response.role,
                user: response.user, 
            });
        } catch (error) {
            next(error);
        }
    };  
    
    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.clearCookie('refreshToken', {
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            })
            res.status(HttpStatus.OK).json({message: Messages.LOGOUT_SUCCESS})
        } catch (error) {
            
        }
    };
};