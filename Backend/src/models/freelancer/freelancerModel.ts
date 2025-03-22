import mongoose, { Schema, Document } from "mongoose";

export interface IFreelancer extends Document {
    userId: mongoose.Types.ObjectId;
    firstName: string;
    title: string;
    bio: string;
    profilePic: string;
    skills: mongoose.Types.ObjectId[];
    jobCategory: mongoose.Types.ObjectId | null;
    city: string;
    state: string;
    country: string;
    zip: string;
    language: string[];
    profileCompleted: boolean;  
    portfolio: { name: string; imageUrl: string }[];
    education: { college: string; course: string };
    experienceLevel: "Beginner" | "Intermediate" | "Expert";
    linkedAccounts: { github: string; linkedIn: string; website: string };
    employmentHistory: { company: string; position: string; duration: string }[];
}

const FreelancerSchema: Schema = new Schema<IFreelancer>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },  
        firstName: {
            type: String
        },
        title: {
            type: String,
        },
        profilePic: {
            type: String,
            default: ""
        },
        bio: {
            type: String
        },
        skills: [
            {
                type: Schema.Types.ObjectId,
                ref: "Skills",
                required: true
            }
        ],
        jobCategory: {
            type: Schema.Types.ObjectId,
            ref: "Category"
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
        zip: {
            type: String,
        },
        language: [
            {
                type: String
            }
        ],
        profileCompleted: {
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
        },
        linkedAccounts: {
            github: String,
            linkedIn: String,
            website: String
        },
        employmentHistory: [
            {
                company: String,
                position: String,
                duration: String
            }
        ]
    },
    { timestamps: true }
);

const Freelancer = mongoose.model<IFreelancer>("Freelancer", FreelancerSchema);
export default Freelancer