import mongoose, { UpdateQuery } from "mongoose";
import { IWalletRepository } from "../../interfaces/admin/wallet/IWalletRepository";
import Wallet, { IWallet } from "../../models/user/walletModel";
import { BaseRepository } from "../base/baseRepository";

export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
    constructor() {
        super(Wallet);
    }

    async addFunds(userId: string, amount: number, description: string, type: "credit" | "debit", contractId?: string): Promise<IWallet> {
        let wallet = await this.findOne({ userId: new mongoose.Types.ObjectId(userId), isDeleted: false }) as IWallet | null;
    
        if (!wallet) {
            wallet = await this.create({
                userId: new mongoose.Types.ObjectId(userId),
                balance: 0,
                transactions: []
            }) as IWallet;
        }
    
        const newBalance = type === "credit"
            ? wallet.balance + amount
            : wallet.balance - amount;
    
        const transaction = {
            amount,
            description,
            type,
            date: new Date(),
            ...(contractId && { contractId: new mongoose.Types.ObjectId(contractId) })
        };
    
        return await this.findByIdAndUpdate(
            wallet._id.toString(),
            {
                $set: { balance: newBalance },
                $push: { transactions: transaction }
            } as UpdateQuery<IWallet>,
            { new: true }
        ) as IWallet;
    }

    async getUserTransactions(walletId: string): Promise<any[]> {
        const objectId = new mongoose.Types.ObjectId(walletId);
      
        const transactions = await this.model.aggregate([
            { $match: { _id: objectId } },
            { $unwind: "$transactions" },
            {
                $lookup: {
                    from: "contracts",
                    localField: "transactions.contractId",
                    foreignField: "_id",
                    as: "contract"
                }
            },
            { $unwind: "$contract" },
            {
                $lookup: {
                    from: "users",
                    localField: "contract.clientId",
                    foreignField: "_id",
                    as: "client"
                }
            },
            { $unwind: "$client" },
            {
                $project: {
                    _id: 0,
                    amount: "$transactions.amount",
                    type: "$transactions.type",
                    description: "$transactions.description",
                    date: "$transactions.date",
                    contractId: "$contract.contractId",
                    clientName: "$client.name"
                }
            },
            { $sort: { date: -1 } }
        ]);

        console.log('TRANSACTION RESULT OF AGGREGATION', transactions);
      
        return transactions;
    };
}