import bcrypt from "bcrypt";
import { Messages } from "../constants/messageConstants";
import { HttpStatus } from "../constants/statusContstants"; 
import { createHttpError } from "../utils/httpError"; 
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { Iuser } from "../models/user/userModel";
import { UserRepository } from "../repository/userRepository";
import { deleteOtp, generateOtp, sendOtp, storeOtp, verifyOtp } from "../utils/otp";
import { hashPassword, comparePassword } from "../utils/password";

export class UserService {
    private userRepository: IUserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(userData: Partial<Iuser>): Promise<{ status: number; message: string }> {
        const existingUser = await this.userRepository.findByEmail(userData.email!);
        if (existingUser) {
            throw createHttpError(HttpStatus.CONFLICT, Messages.USER_EXIST);
        }

        const otp = generateOtp();
        await sendOtp(userData.email!, otp);
        await storeOtp(userData.email!, otp);

        return { status: HttpStatus.OK, message: Messages.OTP_SENT };
    }

    async verifyOtpAndCreateUser(email: string, otp: string, userData: Partial<Iuser>): Promise<{ status: number; message: string }> {
        console.log("Received Data:", { email, otp, userData });
    
        const isValidOtp = await verifyOtp(email, otp);
        console.log("OTP Verification Result:", isValidOtp);
    
        if (!isValidOtp) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.INCORRECT_OTP);
        }
    
        console.log("Deleting OTP for:", email);
        await deleteOtp(email);
    
        if (!userData.password) {
            console.log("Error: Password is undefined");
            throw createHttpError(HttpStatus.BAD_REQUEST, "Password is required");
        }
    
        console.log("Hashing password for:", email);
        userData.password = await hashPassword(userData.password);
        
        console.log("Creating user:", userData);
        await this.userRepository.create(userData as Iuser);
    
        return { status: HttpStatus.CREATED, message: Messages.SIGNUP_SUCCESS };
    }
    
    
};