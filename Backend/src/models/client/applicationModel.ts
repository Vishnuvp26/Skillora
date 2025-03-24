import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
    jobId: mongoose.Types.ObjectId;
    freelancerId: mongoose.Types.ObjectId;
    status: "Pending" | "Accepted" | "Rejected";
}

const ApplicationSchema: Schema = new Schema<IApplication>(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Freelancer",
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected"],
            default: "Pending"
        }
    },
    { timestamps: true }
);

const Application = mongoose.model<IApplication>("Application", ApplicationSchema);
export default Application;