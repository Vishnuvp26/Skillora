import mongoose, { Schema, Document } from "mongoose";

export interface IEscrow extends Document {
    clientId: mongoose.Types.ObjectId;
    freelancerId: mongoose.Types.ObjectId;
    contractId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    amount: number;
    platformFee: number;
    freelancerEarning: number;
    status: "funded" | "released" | "refunded" | "canceled";
    createdAt: Date;
    updatedAt: Date;
}

const EscrowSchema: Schema = new Schema<IEscrow>(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Freelancer",
        },
        contractId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contract",
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        platformFee: {
            type: Number,
            required: true
        },
        freelancerEarning: {
            type: Number,
        },
        status: {
            type: String,
            enum: ["funded", "released", "refunded", "canceled"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Escrow = mongoose.model<IEscrow>("EscrowWallet", EscrowSchema);
export default Escrow