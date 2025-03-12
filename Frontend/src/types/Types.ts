export interface FormData {
    name: string
    email: string
    password: string
    confirmPassword: string
    role: string
}

export interface UserType {
    _id: string
    email: string
    name: string
    status: "active" | "blocked";
    joinedAt?: Date
}

export interface Category {
    _id: string;
    name: string;
    isListed: boolean;
}

interface FreelancerData {
    profilePicture: File | null;
    title: string;
    bio: string;
    skills: string[];
    jobCategory: string;
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
};