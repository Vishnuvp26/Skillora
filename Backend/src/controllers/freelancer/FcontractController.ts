import { Request, Response, NextFunction } from "express";
import { IFreelancerContractController } from "../../interfaces/freelancer/contract/IFContractController";
import { IFreelancerContractService } from "../../interfaces/freelancer/contract/IFContractService";
import { HttpStatus } from "../../constants/statusContstants";
import { Messages } from "../../constants/messageConstants";

export class FreelancerContractController implements IFreelancerContractController {
    constructor(private _freelancerContractService: IFreelancerContractService) { }

    async approveContract(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const contractId = req.params.contractId;
            const freelancerId = req.params.freelancerId;

            if (!contractId || !freelancerId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.MISSING_PARAMETERS });
                return;
            }

            const contract = await this._freelancerContractService.approveContract(contractId, freelancerId);
            res.status(HttpStatus.OK).json({ message: Messages.CONTRACT_APPROVE, contract });
        } catch (error) {
            next(error)
        }
    };

    async updateContractStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const contractId = req.params.contractId;
            const status = req.body.status;

            if (!contractId || !status) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.MISSING_PARAMETERS });
                return;
            }

            const contract = await this._freelancerContractService.updateContractStatus(contractId, status);
            res.status(HttpStatus.OK).json({
                message: Messages.CONTRACT_STATUS_UPDATED,
                contract
            });
        } catch (error) {
            next(error)
        }
    };

    async getFreelancerContracts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const freelancerId = req.params.freelancerId;

            if (!freelancerId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.USER_NOT_FOUND });
                return;
            }

            const contracts = await this._freelancerContractService.getFreelancerContracts(freelancerId);
            res.status(HttpStatus.OK).json({
                count: contracts.length,
                contracts
            });
        } catch (error) {
            next(error)
        }
    };

    async viewContractDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const contractId = req.params.contractId;
            
            if (!contractId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.MISSING_PARAMETERS });
                return;
            }

            const contract = await this._freelancerContractService.getContractById(contractId);
            
            if (!contract) {
                res.status(HttpStatus.NOT_FOUND).json({ message: Messages.CONTRACT_NOT_FOUND });
                return;
            }

            res.status(HttpStatus.OK).json({ contract });
        } catch (error) {
            next(error);
        }
    };
}