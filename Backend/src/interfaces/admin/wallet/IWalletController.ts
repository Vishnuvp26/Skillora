import { Request, Response, NextFunction } from "express";

export interface IWalletController {
    getWallet(req: Request, res: Response, next: NextFunction): Promise<void>;
    addFunds(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
    userSalesReport(req: Request, res: Response, next: NextFunction): Promise<void>
};