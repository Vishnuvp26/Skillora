import mongoose from "mongoose";
import { IContractRepository } from "../../interfaces/client/contract/IContractRepository";
import Contract, { IContract } from "../../models/client/contractModel";
import { BaseRepository } from "../base/baseRepository";

export class ContractRepository extends BaseRepository<IContract> implements IContractRepository {
    constructor() {
        super(Contract)
    }

    async createContract(contractData: IContract): Promise<IContract> {
        const contract = new Contract(contractData);
        return await this.create(contract)
    }

    async getContractsByClient(clientId: string): Promise<IContract[]> {
        return await this.model.find({
            clientId: new mongoose.Types.ObjectId(clientId),
            isDeleted: false
        })
            .populate('jobId')
            .populate('freelancerId', 'name email, profilePic')
            .sort({ createdAt: -1 });
    };

    async getContractByJobId(jobId: string): Promise<IContract | null> {
        return await Contract.findOne({ 
            jobId: new mongoose.Types.ObjectId(jobId),
            isDeleted: false 
        });
    };

    async getContractsByFreelancer(freelancerId: string): Promise<IContract[]> {
        return await this.model.find({
            freelancerId: new mongoose.Types.ObjectId(freelancerId)
        })
        .populate('jobId')
        .populate('clientId', 'name email profilePic')
        .sort({ createdAt: -1 })
        .lean();
    };

    async deleteContract(contractId: string): Promise<void> {
        await this.model.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(contractId) },
            { isDeleted: true, status: "Cancelled" },
            { new: true }
        );
    };    

    async getContractById(contractId: string): Promise<IContract | null> {
        return await Contract.findOne({ _id: new mongoose.Types.ObjectId(contractId) });
    };
    
    async findAllContracts(): Promise<IContract[]> {
        return await this.model.find({ isDeleted: false }) 
            .populate("clientId", "name email profilePic")
            .populate("freelancerId", "name email profilePic");
    }    
}