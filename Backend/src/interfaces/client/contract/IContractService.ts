import { IContract } from "../../../models/client/contractModel";

export interface IContractService {
    createContract(jobId: string, clientId: string, freelancerId: string, amount: number): Promise<IContract>;
    getClientContracts(clientId: string): Promise<IContract[]>;
    cancelContract(contractId: string): Promise<void>;
    isContractExist(jobId: string, freelancerId: string): Promise<IContract | null>;
    getAllContracts(): Promise<IContract[]>;
    requestFundRelease(contractId: string): Promise<boolean>;
    getContractById(contractId: string): Promise<IContract | null>;
};