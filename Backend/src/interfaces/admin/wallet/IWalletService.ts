import { IWallet } from "../../../models/user/walletModel";

export interface IWalletService {
    getWallet(userId: string): Promise<IWallet | null>;
    addFunds(userId: string, amount: number, description: string, type: "credit" | "debit", reference?: string): Promise<IWallet>;
    // withdrawFunds(userId: string, amount: number, description: string, reference?: string): Promise<IWallet>;
    getUserTransactions(userId: string): Promise<Array<any>>;
}