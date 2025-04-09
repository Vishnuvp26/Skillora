import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
    isRead: boolean;
    readAt?: Date;
    sentAt: Date;
};

const MessageSchema: Schema = new Schema<IMessage>({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;