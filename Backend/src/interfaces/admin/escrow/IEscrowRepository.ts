import { IEscrow } from "../../../models/admin/escrowModel";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface IEscrowRepository extends IBaseRepository<IEscrow> {
    // create(escrowData: IEscrow): Promise<IEscrow>;
    // findAll(filter?: object): Promise<IEscrow[]>;
    // findOne(filter: object): Promise<IEscrow | null>;
    // findById(id: string): Promise<IEscrow | null>;
    // update(id: string, updateData: Partial<IEscrow>): Promise<IEscrow | null>;
    // getTransactionsByFilter(filter: object, sort?: object): Promise<IEscrow[]>;
    getTotalAmountInEscrow(): Promise<number>
    getTotalRevenue(): Promise<number>;
    updateEscrow(id: string, updateData: Partial<IEscrow>): Promise<IEscrow | null>
};