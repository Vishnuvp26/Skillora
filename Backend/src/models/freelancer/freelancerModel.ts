import mongoose, { Schema, Document } from "mongoose";

export interface IFreelancer extends Document {
    userId: mongoose.Types.ObjectId
    title: string
    bio: string
    skills: string[]
    jobCategory: mongoose.Types.ObjectId
    city: string
    state: string
    country: string
    zip: string
    language: string[]
    isBlocked: boolean
    portfolio: { name: string; imageUrl: string }[]
    education: { college: string; cource: string }
    experienceLevel: 'Beginner' | 'Intermediate' | 'Expert'
    linkedAccounts: {github: string, linkedIn: string, website: string}
}

const FreelancerSchema: Schema = new Schema<IFreelancer>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        bio: {
            type: String
        },
        skills: [
            {
                type: String
            }
        ],
        jobCategory: {
            type: Schema.Types.ObjectId,
            ref: "JobCategory",
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        zip: {
            type: String,
            required: true
        },
        language: [
            {
                type: String
            }
        ],
        isBlocked: {
            type: Boolean,
            default: false
        },
        portfolio: [
            {
                name: String,
                imageUrl: String
            }
        ],
        education: {
            college: String,
            course: String
        },
        experienceLevel: {
            type: String,
            enum: ["Beginner", "Intermediate", "Expert"],
            required: true
        },
        linkedAccounts: {
            github: String,
            linkedIn: String,
            website: String
        }
    },
    { timestamps: true }
)

export default mongoose.model<IFreelancer>("Freelancer", FreelancerSchema);