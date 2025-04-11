import mongoose, { UpdateQuery } from "mongoose";
import { IWalletRepository } from "../../interfaces/admin/wallet/IWalletRepository";
import Wallet, { IWallet } from "../../models/user/walletModel";
import { BaseRepository } from "../base/baseRepository";

export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
    constructor() {
        super(Wallet);
    }

    async addFunds(userId: string, amount: number, description: string, type: "credit" | "debit"): Promise<IWallet> {
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

    async getUserTransactions(walletId: string): Promise<Array<any>> {
        const wallet = await this.findById(walletId);

        if (!wallet) return [];

        return [...wallet.transactions].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    };
}