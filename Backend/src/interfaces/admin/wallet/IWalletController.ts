import { Request, Response, NextFunction } from "express";

export interface IWalletController {
    getWallet(req: Request, res: Response, next: NextFunction): Promise<void>;
    addFunds(req: Request, res: Response, next: NextFunction): Promise<void>;
    // withdrawFunds(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
};