import mongoose, { Schema, Document } from "mongoose";

interface IClient extends Document {
    userId: mongoose.Types.ObjectId
    city: string
    state: string
    country: string
    profilePic: string
    zip:number
}

const ClientSchema: Schema = new Schema<IClient>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        profilePic: {
            type: String,
        },
        zip: {
            type: Number,
            required: true
        }
    },
    {timestamps: true}
)

export const Client = mongoose.model<IClient>('Client', ClientSchema);
