import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants";
import { IEscrowController } from "../../interfaces/admin/escrow/IEscrowController";
import { IEscrowService } from "../../interfaces/admin/escrow/IEscrowService";
import { Request, Response, NextFunction } from "express";

export class EscrowController implements IEscrowController {
    constructor(private _escrowService: IEscrowService) { }
    
    async getTotalEscrowBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const totalInEscrow = await this._escrowService.getTotalAmountInEscrow();
            res.status(HttpStatus.OK).json({ data: totalInEscrow });
        } catch (error) {
            next(error);
        }
    };

    async getTotalRevenue(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const totalRevenue = await this._escrowService.getTotalPlatformRevenue();
          res.status(HttpStatus.OK).json({ data: totalRevenue });
        } catch (error) {
          next(error);
        }
    };

    async releaseFundsToFreelancer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contractId } = req.params;
            
            if (!contractId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.CONTRACT_NOT_FOUND });
                return;
            }

            const result = await this._escrowService.releaseToFreelancer(contractId);

            res.status(HttpStatus.OK).json({ message: Messages.FUND_RELEASED, data: result });
        } catch (error) {
            next(error)
        }
    };

    async refundToClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contractId, clientId } = req.params;
            const { cancelReason, cancelReasonDescription } = req.body;
            
            if (!contractId || !clientId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_REQUEST });
                return;
            }

            const result = await this._escrowService.refundToClient(
                contractId, 
                clientId,
                cancelReason,
                cancelReasonDescription
            );

            res.status(HttpStatus.OK).json({ message: Messages.REFUND_PROCESSED, data: result });
        } catch (error) {
            next(error);
        }
    };

    async processFreelancerPaymentRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contractId } = req.params;
            const { freelancerId } = req.body;
            
            if (!contractId || !freelancerId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_REQUEST });
                return;
            }
            
            const result = await this._escrowService.processFreelancerPaymentRequest(contractId, freelancerId);
            
            res.status(HttpStatus.OK).json({ message: Messages.PAYMENT_REQUEST_PROCESSED, data: result });
        } catch (error) {
            next(error);
        }
    };

    async getAdminTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const transactions = await this._escrowService.getAdminTransactions();
            res.status(HttpStatus.OK).json({ 
                count: transactions.length, 
                data: transactions 
            });
        } catch (error) {
            next(error);
        }
    };

    async getSalesReport(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const report = await this._escrowService.getMonthlySalesReport();
          res.status(HttpStatus.OK).json({ data: report });
        } catch (error) {
          next(error);
        }
    };
}