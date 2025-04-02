import mongoose, { Schema, Document } from "mongoose";

export interface IContract extends Document {
    contractId: string;
    jobId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    freelancerId: mongoose.Types.ObjectId;
    isApproved: boolean;
    status: "Pending"| "Started" | "Ongoing" | "Complete" | "Canceled";
    amount: number;
    escrowPaid: boolean;
    isDeleted: boolean;
}
const ContractSchema: Schema = new Schema<IContract>({
    contractId: {
        type: String,
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    status: { 
        type: String, 
        enum: ["Pending", "Started", "Ongoing", "Complete", "Canceled"], 
        default: "Pending" 
    },
    amount: {
        type: Number,
        required: true
    },
    escrowPaid: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Contract = mongoose.model<IContract>("Contract", ContractSchema);
export default Contract;