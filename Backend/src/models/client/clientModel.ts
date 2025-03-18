import mongoose, { Schema, Document } from "mongoose";

interface IClient extends Document {
    userId: mongoose.Types.ObjectId
    firstName: string
    city: string
    state: string
    profilePic: string
    totalSpent: number
    jobsPosted: number
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
            type: Number
        },
        totalSpent: {
            type: Number
        }
    },
    { timestamps: true }
);

export const Client = mongoose.model<IClient>('Client', ClientSchema);
export default Client;