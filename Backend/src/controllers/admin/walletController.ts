import { Request, Response, NextFunction } from "express";
import { IWalletController } from "../../interfaces/admin/wallet/IWalletController";
import { IWalletService } from "../../interfaces/admin/wallet/IWalletService";
import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants";

export class WalletController implements IWalletController {
    constructor(private _walletService: IWalletService) { }
    
    async getWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log('heyy wallet');
        try {
            const { userId } = req.params;

            if (!userId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.USER_NOT_FOUND });
                return;
            }
            
            const wallet = await this._walletService.getWallet(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: wallet
            });
        } catch (error) {
            next(error)
        }
    };

    async addFunds(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, amount, description } = req.body;
            
            if (!userId || !amount || !description) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_REQUEST });
                return;
            }
            
            const wallet = await this._walletService.addFunds(
                userId, 
                amount, 
                description, 
                "credit", 
            );
            
            res.status(HttpStatus.OK).json({
                success: true,
                message: Messages.FUNDS_ADDED,
                data: wallet
            });
        } catch (error) {
            next(error);
        }
    };

    async getUserTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { walletId } = req.params;
            
            if (!walletId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.USER_NOT_FOUND });
                return;
            }
            
            const transactions = await this._walletService.getUserTransactions(walletId);
            
            res.status(HttpStatus.OK).json({
                success: true,
                count: transactions.length,
                data: transactions
            });
        } catch (error) {
            next(error);
        }
    };

    async userSalesReport(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { userId } = req.params;
          const report = await this._walletService.getUserSalesReport(userId);
          res.status(HttpStatus.OK).json({ data: report });
        } catch (error) {
          next(error);
        }
    };
}