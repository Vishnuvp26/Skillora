import { IContract } from "../../../models/client/contractModel";

export interface IFreelancerContractService {
    approveContract(contractId: string, freelancerId: string): Promise<IContract>;
    updateContractStatus(contractId: string, status: "Pending"| "Started" | "Ongoing" | "Completed" | "Canceled"): Promise<IContract>;
    getFreelancerContracts(freelancerId: string): Promise<IContract[]>;
    getContractById(contractId: string): Promise<IContract | null>;
    getCompletedContracts(freelancerId: string): Promise<IContract[]>;
};