import { NextFunction, Request, Response } from "express";

export interface IAdminController {
    getClients(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFreelancers(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockFreelancer(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockClient(req: Request, res: Response, next: NextFunction): Promise<void>;
    unblockFreelancer(req: Request, res: Response, next: NextFunction): Promise<void>;
    unblockClient(req: Request, res: Response, next: NextFunction): Promise<void>;
}