import { IEscrowRepository } from "../../interfaces/admin/escrow/IEscrowRepository";
import Escrow, { IEscrow } from "../../models/admin/escrowModel";
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

    async getAdminTransactions(): Promise<IEscrow[]> {
        return await this.model.find({
            transactionType: "credit",
            status: { $in: ["funded", "released", "refunded", "released"] }
        })
            .populate('clientId', 'name email')
            .populate('freelancerId', 'name email')
            .populate('contractId')
            .sort({ createdAt: -1 });
    };

    async getMonthlySalesReport(): Promise<any[]> {
        return this.model.aggregate([
            {
                $match: {
                    status: "released"
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    totalRevenue: { $sum: "$amount" },
                    platformEarnings: { $sum: "$platformFee" },
                    freelancerEarnings: { $sum: "$freelancerEarning" },
                    totalTransactions: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: [
                                    { $lt: ["$_id.month", 10] },
                                    { $concat: ["0", { $toString: "$_id.month" }] },
                                    { $toString: "$_id.month" }
                                ]
                            }
                        ]
                    },
                    totalRevenue: 1,
                    platformEarnings: 1,
                    freelancerEarnings: 1,
                    totalTransactions: 1
                }
            }
        ]);
    };
}