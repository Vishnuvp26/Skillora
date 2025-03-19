import mongoose, { Schema, Document } from "mongoose";

export interface Iuser extends Document{
    name: string
    email: string
    mobile?: string
    password: string
    role: "freelancer" | "client" | "admin"
    profilePic: string
    isGoogleAuth: boolean
    status: "active" | "blocked"
    createdAt: Date
    updatedAt: Date
}

const UserSchema: Schema = new Schema<Iuser>(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        mobile: {
            type: String
        },
        password: {
            type: String
        },
        role: {
            type: String,
            enum: ['freelancer', 'client', 'admin'],
            required: true
        },
        profilePic: {
            type: String
        },
        isGoogleAuth: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['active', 'blocked'],
            default: 'active'
        },
    },
    { timestamps: true }
);

export const User = mongoose.model<Iuser>('User', UserSchema);
export default User