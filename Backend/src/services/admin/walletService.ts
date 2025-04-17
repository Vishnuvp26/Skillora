import mongoose from "mongoose";
import { IWalletRepository } from "../../interfaces/admin/wallet/IWalletRepository";
import { IWalletService } from "../../interfaces/admin/wallet/IWalletService";
import { IWallet } from "../../models/user/walletModel";
import { createHttpError } from "../../utils/httpError";
import { HttpStatus } from "../../constants/statusContstants";
import { Messages } from "../../constants/messageConstants";

export class WalletService implements IWalletService {
    constructor(private _walletRepository: IWalletRepository) { }
    
    async getWallet(userId: string): Promise<IWallet | null> {
        return await this._walletRepository.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    }    

    async addFunds(userId: string, amount: number, description: string, type: "credit" | "debit"): Promise<IWallet> {
        if (amount <= 0) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.INVALID_AMOUNT)
        }
        return await this._walletRepository.addFunds(userId, amount, description, type);
    };

    async getUserTransactions(walletId: string): Promise<Array<any>> {
        return await this._walletRepository.getUserTransactions(walletId);
    };

    async getUserSalesReport(userId: string) {
        return this._walletRepository.userSalesReport(userId);
    };
}