import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants";
import { IFreelancerContractService } from "../../interfaces/freelancer/contract/IFContractService";
import { IContract } from "../../models/client/contractModel";
import { createHttpError } from "../../utils/httpError";
import { IFreelancerContractRepository } from "../../interfaces/freelancer/contract/IFContractRepository";

export class FreelancerContractService implements IFreelancerContractService {
    constructor(
        private _contractRepository: IFreelancerContractRepository
    ) {}

    async approveContract(contractId: string, freelancerId: string): Promise<IContract> {
        const contract = await this._contractRepository.getContractById(contractId);
        if (!contract) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.CONTRACT_NOT_FOUND);
        }
    
        if (contract.freelancerId.toString() !== freelancerId) {
            throw createHttpError(HttpStatus.FORBIDDEN, Messages.ACCESS_DENIED);
        }
    
        const updatedContract = await this._contractRepository.updateContract(contractId, {
            isApproved: true,
        });
    
        if (!updatedContract) {
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, Messages.CONTRACT_STATUS_UPDATE_FAILED);
        }
        return updatedContract;
    };

    async updateContractStatus(
        contractId: string, 
        status: "Pending"| "Started" | "Ongoing" | "Complete" | "Canceled"
    ): Promise<IContract> {

        const contract = await this._contractRepository.getContractById(contractId);
        if (!contract) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.CONTRACT_NOT_FOUND);
        }
    
        const updatedContract = await this._contractRepository.updateContract(contractId, { status });

        if (!updatedContract) {
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, Messages.CONTRACT_STATUS_UPDATE_FAILED);
        }

        return updatedContract;
    };

    async getFreelancerContracts(freelancerId: string): Promise<IContract[]> {
        return await this._contractRepository.getContractsByFreelancer(freelancerId);
    };

    async getContractById(contractId: string): Promise<IContract | null> {
        const contract = await this._contractRepository.findOne({ 
            _id: contractId, 
            isDeleted: false 
        });
    
        if (!contract) return null;
    
        return await contract.populate([
            { path: "jobId", select: "title description rate" },
            { path: "clientId", select: "name email profilePic" },
            { path: "freelancerId", select: "name email profilePic" }
        ]);
    };     
}