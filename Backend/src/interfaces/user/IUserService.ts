import { Iuser } from "../../models/user/userModel";

export interface IUserService {
    register(userData: Partial<Iuser>): Promise<{ status: number; message: string }>;
    verifyOtpAndCreateUser(email: string, otp: string, userData: Partial<Iuser>): Promise<{ status: number; message: string }>;
}