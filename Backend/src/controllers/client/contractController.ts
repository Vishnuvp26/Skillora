import { Request, Response, NextFunction } from "express";
import { IContractController } from "../../interfaces/client/contract/IContractController";
import { IContractService } from "../../interfaces/client/contract/IContractService";
import { HttpStatus } from "../../constants/statusContstants";
import { Messages } from "../../constants/messageConstants";
import { AuthRequest } from "../../middlewares/authMiddleware";

export class ContractController implements IContractController {
    constructor(private _contractService: IContractService) { };

    async createContract(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const clientId = req.user?.id;
            const jobId = req.params.jobId;
            const freelancerId = req.body.freelancerId;
            const amount = req.body.amount;

            if (!jobId || !clientId || !freelancerId || !amount) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.MISSING_PARAMETERS });
                return;
            }
            const contract = await this._contractService.createContract(jobId, clientId, freelancerId, amount);
            res.status(HttpStatus.CREATED).json({ message: Messages.CONTRACT_CREATE, contract });
        } catch (error) {
            next(error)
        }
    };

    async getClientContracts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clientId = req.params.clientId;

            if(!clientId){
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.USER_NOT_FOUND });
                return;
            }

            const contracts = await this._contractService.getClientContracts(clientId);
            res.status(HttpStatus.OK).json({ count: contracts.length, data: contracts });
        } catch (error) {
            next(error)
        }
    };

    async cancelContract(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contractId } = req.params;
    
            if (!contractId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.MISSING_PARAMETERS });
                return;
            }
    
            await this._contractService.cancelContract(contractId);
            res.status(HttpStatus.OK).json({ message: Messages.CONTRACT_CANCELLED });
        } catch (error) {
            next(error);
        }
    };

    async isContractExist(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const jobId = req.params.jobId;
            const clientId = req.params.clientId;
            
            if (!jobId || !clientId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.MISSING_PARAMETERS });
                return;
            }

            const contract = await this._contractService.isContractExist(jobId, clientId);
            res.status(HttpStatus.OK).json({ contract });
        } catch (error) {
            next(error)
        }
    };

    async getAllContractsForAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const contract = await this._contractService.getAllContracts();
            res.status(HttpStatus.OK).json({data: contract})
        } catch (error) {
            next(error)
        }
    };

    async requestFundRelease(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contractId } = req.params;
    
            if (!contractId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.MISSING_PARAMETERS });
                return;
            }
    
            await this._contractService.requestFundRelease(contractId);
    
            res.status(HttpStatus.OK).json({ message: Messages.FUND_RELEASE_REQUEST });
        } catch (error) {
            next(error);
        }
    };
}