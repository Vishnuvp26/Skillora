import mongoose, { Schema, Document } from "mongoose";

export interface IContract extends Document {
    contractId: string;
    jobId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    freelancerId: mongoose.Types.ObjectId;
    isApproved: boolean;
    status: "Pending"| "Started" | "Ongoing" | "Completed" | "Canceled";
    amount: number;
    escrowPaid: boolean;
    isDeleted: boolean;
    cancelReason?: string;
    canceledBy?: "Client" | "Freelancer";
    cancelReasonDescription?: string;
    releaseFundStatus: "NotRequested" | "Requested" | "Approved";
};

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
        enum: ["Pending", "Started", "Ongoing", "Completed", "Canceled"], 
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
    canceledBy: {
        type: String,
        enum: ["Client", "Freelancer"],
        default: null
    },
    cancelReason: {
        type: String,
        default: ""
    },
    cancelReasonDescription: {
        type: String,
        default: ""
    },
    releaseFundStatus: {
        type: String,
        enum: ["NotRequested", "Requested", "Approved"],
        default: "NotRequested"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Contract = mongoose.model<IContract>("Contract", ContractSchema);
export default Contract;