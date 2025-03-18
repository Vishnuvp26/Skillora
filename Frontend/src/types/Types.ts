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

export interface ISkill {
    _id?: string;
    name: string;
}

export interface IJobCategory {
    _id: string;
    name: string;
}

export interface IPortfolio {
    name: string;
    imageUrl: string;
}

export interface IEducation {
    college: string;
    course: string;
}

export interface ILinkedAccounts {
    github: string;
    linkedIn: string;
    website: string;
}

export interface IEmploymentHistory {
    _id?: string;
    company: string;
    position: string;
    duration: string;
}

export interface IFreelancer {
    _id: string;
    userId: string;
    firstName: string;
    title: string;
    bio: string;
    skills: ISkill[];
    jobCategory: IJobCategory;
    city: string;
    state: string;
    country: string;
    zip: string;
    language: string[];
    socialLinks?: string[];
    profileCompleted: boolean;
    profilePic: string;
    portfolio: IPortfolio[];
    education: IEducation;
    experienceLevel: "Beginner" | "Intermediate" | "Expert";
    linkedAccounts: ILinkedAccounts;
    employmentHistory: IEmploymentHistory[];
    createdAt: string;
    updatedAt: string;
};

export interface FreelancerProfileFormProps {
    profile?: IFreelancer | null;
    onUpdate?: (updatedProfile: IFreelancer) => void;
}