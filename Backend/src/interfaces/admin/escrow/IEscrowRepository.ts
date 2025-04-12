import { IEscrow } from "../../../models/admin/escrowModel";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface IEscrowRepository extends IBaseRepository<IEscrow> {
    getTotalAmountInEscrow(): Promise<number>
    getTotalRevenue(): Promise<number>;
    updateEscrow(id: string, updateData: Partial<IEscrow>): Promise<IEscrow | null>;
    getAdminTransactions(): Promise<IEscrow[]>;
    
};