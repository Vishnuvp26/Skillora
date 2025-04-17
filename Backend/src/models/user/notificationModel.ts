import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    message: string;
    role: "client" | "freelancer";
    type: "contract" | "applied" | "approved";
    read: boolean;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true, ref: "Client"
        },
        message: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['freelancer', 'client'],
            required: true
        },
        type: {
            type: String,
            enum: ["contract", "applied", "approved"],
        },
        read: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;