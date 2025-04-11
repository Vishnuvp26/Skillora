import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants";
import { IEscrowRepository } from "../../interfaces/admin/escrow/IEscrowRepository";
import Escrow, { IEscrow } from "../../models/admin/escrowModel";
import { createHttpError } from "../../utils/httpError";
import { BaseRepository } from "../base/baseRepository";

export class EscrowRepository extends BaseRepository<IEscrow> implements IEscrowRepository {
    constructor() {
        super(Escrow);
    }

    async updateEscrow(id: string, updateData: Partial<IEscrow>): Promise<IEscrow | null> {
        return await Escrow.findByIdAndUpdate(id, updateData, { new: true }) || null;
    }
    

    async getTotalAmountInEscrow(): Promise<number> {
        const result = await this.model.aggregate([
            { $match: { status: "funded" } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);
        return result.length > 0 ? result[0].totalAmount : 0;
    };    

    async getTotalRevenue(): Promise<number> {
        const result = await this.model.aggregate([
            { $match: { status: { $in: ["released", "refunded"] } } },
            { $group: { _id: null, totalRevenue: { $sum: "$platformFee" } } }
        ]);
    
        const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    
        return totalRevenue;
    };
}