import { IWallet } from "../../../models/user/walletModel";
import { BaseRepository } from "../../../repository/base/baseRepository";

export interface IWalletRepository extends BaseRepository<IWallet> {
    addFunds(userId: string, amount: number, description: string, type: "credit" | "debit", reference?: string): Promise<IWallet>;
    getUserTransactions(userId: string): Promise<Array<any>>;
}