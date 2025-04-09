import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
    freelancerId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    lastMessage: string;
    lastMessageAt:Date
};

const ConversationSchema: Schema = new Schema<IConversation>({
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lastMessage: {
        type: String,
        default: ""
    },
    lastMessageAt:{
        type:Date,
        default:Date.now()
    }
}, { timestamps: true });

const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);
export default Conversation;