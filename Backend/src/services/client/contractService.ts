import mongoose from "mongoose";
import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants";
import { IApplicationRepository } from "../../interfaces/client/application/IApplicationRepository";
import { IContractRepository } from "../../interfaces/client/contract/IContractRepository";
import { IContractService } from "../../interfaces/client/contract/IContractService";
import { IJobRepository } from "../../interfaces/client/job/IJobRepository";
import { IContract } from "../../models/client/contractModel";
import { createHttpError } from "../../utils/httpError";

function generateContractId(): string {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    return `CON${randomDigits}`;
}

export class ContractService implements IContractService {
    constructor(
        private _contractRepository: IContractRepository,
        private _jobRepository: IJobRepository,
        private _applicationRepository: IApplicationRepository
    ) { }
    
    async createContract(jobId: string, clientId: string, freelancerId: string, amount: number): Promise<IContract> {
        const job = await this._jobRepository.getJobById(jobId);

        if (!job) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        };

        if (job.status !== "Open") {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.JOB_CLOSED);
        };

        const existingContract = await this._contractRepository.getContractByJobId(jobId);
        if (existingContract) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.CONTRACT_EXIST);
        };

        const application = await this._applicationRepository.getApplicationByJobAndFreelancer(jobId, freelancerId);
        if (!application) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.FREELANCER_NOT_APPLIED);
        };

        const contractData: IContract = {
            contractId: generateContractId(),
            jobId: new mongoose.Types.ObjectId(jobId),
            clientId: new mongoose.Types.ObjectId(clientId),
            freelancerId: new mongoose.Types.ObjectId(freelancerId),
            isApproved: false,
            amount,
            escrowPaid: false
        } as IContract;

        const newContract = await this._contractRepository.createContract(contractData);

        await this._jobRepository.updateJob(jobId, {
            hiredFreelancer: new mongoose.Types.ObjectId(freelancerId),
            status: "Closed"
        })

        return newContract;
    };

    async getClientContracts(clientId: string): Promise<IContract[]> {
        return await this._contractRepository.getContractsByClient(clientId);
    };

    async cancelContract(contractId: string): Promise<void> {
        const contract = await this._contractRepository.getContractById(contractId);
        if (!contract) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.CONTRACT_NOT_FOUND);
        }
    
        await this._contractRepository.deleteContract(contractId);
    
        await this._jobRepository.updateJob(contract.jobId.toString(), {
            hiredFreelancer: null!, 
            status: "Open"
        });
    };

    async isContractExist(jobId: string, clientId: string): Promise<IContract | null> {
        return await this._contractRepository.findOne({ jobId, clientId, isDeleted: false });
    };

    async getAllContracts(): Promise<IContract[]> {
        return await this._contractRepository.findAllContracts();
    };

    async requestFundRelease(contractId: string): Promise<boolean> {
        const contract = await this._contractRepository.findById(contractId);

        if (!contract) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.CONTRACT_NOT_FOUND);
        }

        if (contract.status !== "Completed") {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.WORK_NOT_COMPLETED)
        }

        contract.releaseFundStatus = "Requested";
        await contract.save();
        return true;
    };

    async getContractById(contractId: string): Promise<IContract | null> {
        return await this._contractRepository.findById(contractId);
    };      
}