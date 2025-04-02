import { IContract } from "../../../models/client/contractModel";

export interface IFreelancerContractService {
    // createContract(jobId: string, clientId: string, freelancerId: string, amount: number): Promise<IContract>;
    approveContract(contractId: string, freelancerId: string): Promise<IContract>;
    updateContractStatus(contractId: string, status: "Pending"| "Started" | "Ongoing" | "Complete" | "Canceled"): Promise<IContract>;
    getFreelancerContracts(freelancerId: string): Promise<IContract[]>;
    getContractById(contractId: string): Promise<IContract | null>;
};