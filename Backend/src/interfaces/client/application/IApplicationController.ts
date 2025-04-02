import { Request, Response, NextFunction } from "express";

export interface IApplicationController {
    applyForJob(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelApplication(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFreelancerApplication(req: Request, res: Response, next: NextFunction): Promise<void>;
    getJobApplicants(req: Request, res: Response, next: NextFunction): Promise<void>;
    getJobApplicationDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
};