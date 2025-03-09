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