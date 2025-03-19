import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
    userId: mongoose.Types.ObjectId
    firstName: string
    city: string
    state: string
    profilePic: string
    totalSpent: number
    jobsPosted: number
    profileCompleted: boolean
};

const ClientSchema: Schema = new Schema<IClient>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        firstName: {
            type: String
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        profilePic: {
            type: String,
        },
        jobsPosted: {
            type: Number,
            default: 0
        },
        totalSpent: {
            type: Number,
            default: 0
        },
        profileCompleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export const Client = mongoose.model<IClient>('Client', ClientSchema);
export default Client;