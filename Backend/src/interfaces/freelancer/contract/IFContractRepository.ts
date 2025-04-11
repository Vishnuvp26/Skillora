import { IContract } from "../../../models/client/contractModel";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface IFreelancerContractRepository extends IBaseRepository<IContract> {
    getContractsByFreelancer(freelancerId: string): Promise<IContract[]>;
    getContractByJobId(jobId: string): Promise<IContract | null>;
    getContractById(contractId: string): Promise<IContract | null>;
    updateContract(contractId: string, updateData: Partial<IContract>): Promise<IContract | null>;
    getCompletedContractsByFreelancer(freelancerId: string): Promise<IContract[]>;
};