import mongoose from "mongoose";
import { IFreelancerContractRepository } from "../../interfaces/freelancer/contract/IFContractRepository";
import Contract, { IContract } from "../../models/client/contractModel";
import { BaseRepository } from "../base/baseRepository";

export class FreelancerContractRepository extends BaseRepository<IContract> implements IFreelancerContractRepository {
    constructor() {
        super(Contract);
    }

    async getContractById(contractId: string): Promise<IContract | null> {
        return await this.model.findOne({ 
            _id: new mongoose.Types.ObjectId(contractId),
            isDeleted: false
            
        });
    };

    async getContractsByFreelancer(freelancerId: string): Promise<IContract[]> {
        return await this.model.find({
            freelancerId: new mongoose.Types.ObjectId(freelancerId),
            isDeleted: false
        })
        .populate('jobId')
        .populate('clientId', 'name email profilePic')
        .sort({ createdAt: -1 })
        .lean();
    };

    async getContractByJobId(jobId: string): Promise<IContract | null> {
        return await this.model.findOne({ 
            jobId: new mongoose.Types.ObjectId(jobId),
            isDeleted: false
        });
    };

    async updateContract(contractId: string, updateData: Partial<IContract>): Promise<IContract | null> {
        return await this.model.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(contractId), isDeleted: false },
            { $set: updateData },
            { new: true }
        );
    };
};