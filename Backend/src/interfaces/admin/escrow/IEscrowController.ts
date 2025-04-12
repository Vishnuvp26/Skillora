import { Request, Response, NextFunction } from "express";

export interface IEscrowController {
    getTotalEscrowBalance(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTotalRevenue(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAdminTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
    releaseFundsToFreelancer(req: Request, res: Response, next: NextFunction): Promise<void>;
    refundToClient(req: Request, res: Response, next: NextFunction): Promise<void>;
    processFreelancerPaymentRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    // getSalesReport(req: Request, res: Response, next: NextFunction): Promise<void>;
}