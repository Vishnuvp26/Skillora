import mongoose, { Schema, Document } from "mongoose";

export interface IWallet extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    balance: number;
    transactions: Array<{
        amount: number;
        description: string;
        type: "credit" | "debit";
        date: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

const WalletSchema: Schema = new Schema<IWallet>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        balance: {
            type: Number,
            default: 0
        },
        transactions: [
            {
                amount: {
                    type: Number,
                    required: true
                },
                description: {
                    type: String,
                    required: true
                },
                type: {
                    type: String,
                    enum: ["credit", "debit"],
                    required: true
                },
                date: {
                    type: Date,
                    default: Date.now
                },
            }
        ],
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Wallet = mongoose.model<IWallet>("Wallet", WalletSchema);
export default Wallet;