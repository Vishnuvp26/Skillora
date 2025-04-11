import { Request, Response, NextFunction } from "express";
import { IReview } from "../../../models/client/reviewMode";

export interface IReviewController {
    createReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    getReviewsByFreelancer(req: Request, res: Response, next: NextFunction): Promise<void>;
    // updateReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    // deleteReview(req: Request, res: Response, next: NextFunction): Promise<void>;
};