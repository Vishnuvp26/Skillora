import { Request, Response, NextFunction } from "express";

export interface IJobController {
    createJob(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateJob(req: Request, res: Response, next: NextFunction): Promise<void>;
    getJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
    getJobById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getClientJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
}