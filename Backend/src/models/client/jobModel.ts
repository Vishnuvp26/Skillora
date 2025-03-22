import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
    title: string
    description: string
    rate: number
    experienceLevel: string
    location: string
    clientId: mongoose.Types.ObjectId
    category: mongoose.Types.ObjectId
    skills: mongoose.Types.ObjectId[]
    applicants: number
    hiredFreelancer?: mongoose.Types.ObjectId
    status: "Open" | "Closed" | "Completed";
}

const JobSchema: Schema = new Schema<IJob>(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        rate: {
            type: Number,
            required: true
        },
        experienceLevel: {
            type: String,
            required: true,
            enum: ["Beginner", "Intermediate", "Expert"]
        },
        location: {
            type: String,
            required: true
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        skills: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skills",
            required: true
        }],
        hiredFreelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Freelancer",
            default: null
        },
        applicants: {
            type: Number,
            default: 0
        },
        status: { 
            type: String, 
            required: true, 
            enum: ["Open", "Closed", "Completed"], 
            default: "Open" 
        }
    },
    { timestamps: true }
);

const Job = mongoose.model<IJob>("Job", JobSchema);
export default Job;