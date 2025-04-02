import { IContract } from "../../../models/client/contractModel";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface IContractRepository extends IBaseRepository<IContract> {
    createContract(contractData: IContract): Promise<IContract>;
    getContractsByFreelancer(freelancerId: string): Promise<IContract[]>;
    getContractsByClient(clientId: string): Promise<IContract[]>;
    getContractByJobId(jobId: string): Promise<IContract | null>;
    deleteContract(contractId: string): Promise<void>;
    getContractById(contractId: string): Promise<IContract | null>;
    findAllContracts(): Promise<IContract[]>
};