import { Request, Response, NextFunction } from 'express';

export interface IFreelancerContractController {
    approveContract(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateContractStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFreelancerContracts(req: Request, res: Response, next: NextFunction): Promise<void>;
};