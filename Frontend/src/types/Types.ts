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

export interface IClient {
    _id: string
    userId: string
    firstName: string
    city: string
    state: string
    profilePic: string
    totalSpent: number
    jobsPosted: number
}

export interface FreelancerProfileFormProps {
    profile?: IFreelancer | null;
    onUpdate?: (updatedProfile: IFreelancer) => void;
}

export interface ClientProfileFormTypes {
    profile?: IClient | null;
    onUpdate?: (updateProfile: IClient) => void
}

export interface Job {
    _id: string;
    title: string;
    description: string;
    rate: number;
    experienceLevel: string;
    category: {
        _id: string;
        name: string;
    };
    skills: { _id: string; name: string }[];
    createdAt: Date;
    applicants: number
}

export interface JobsListProps {
    jobs: Job[];
    visibleJobs: number;
    setVisibleJobs: React.Dispatch<React.SetStateAction<number>>;
}

export type JobType = {
    _id: string;
    clientId: {
        _id: string;
        name: string
    }
    title: string;
    description: string;
    rate: number;
    experienceLevel: string;
    category: {
        _id: string;
        name: string;
    };
    location: string;
    status: string;
    skills: { _id: string; name: string }[];
    createdAt: string;
    applicants: number
};

export interface Job {
    _id: string;
    title: string;
    description: string;
    rate: number;
    experienceLevel: string;
};

export interface Application {
    _id: string;
    jobId: Job;
    status: string;
    createdAt: string;
    updatedAt: string;
};

export interface IContract {
    _id: string;
    contractId: string;
    jobId: {
        _id: string;
        title: string;
        description: string;
        rate: number;
        experienceLevel: string;
        location: string;
        status: string;
    };
    clientId: {
        _id: string;
        name: string;
        email: string;
        profilePic?: string;
    };
    freelancerId: {
        _id: string;
        name: string;
        email: string;
        profilePic?: string;
    };
    isApproved: boolean;
    status: "Pending" | "Started" | "Ongoing" | "Complete" | "Canceled";
    amount: number;
    escrowPaid: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};