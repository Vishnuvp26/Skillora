import { Request, Response, NextFunction } from "express";

export interface IProfileController {
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    // addProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    uploadProfileImage(req: Request, res: Response, next: NextFunction): Promise<void>
};