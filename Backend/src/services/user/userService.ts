import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants"; 
import { createHttpError } from "../../utils/httpError"; 
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { Iuser } from "../../models/user/userModel";
import { deleteOtp, generateOtp, sendOtp, storeOtp, verifyOtp } from "../../utils/otp";
import { hashPassword, comparePassword } from "../../utils/password";
import { IUserService } from "../../interfaces/user/IUserService";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt";

export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
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
    };

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
    };

    async resendOtp(email: string): Promise<{ status: number; message: string }> {
        const existingUser = await this.userRepository.findByEmail(email)
        if (!existingUser) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND)
        }

        await deleteOtp(email)
        const newOtp = generateOtp()
        sendOtp(email, newOtp)
        await storeOtp(email, newOtp)
        return {status: HttpStatus.OK, message: Messages.OTP_SENT}
    };

    async login(email: string, password: string): Promise<{
        status: number;
        message: string;
        accessToken?: string;
        refreshToken?: string;
        role?: string,
        user?: { 
            id: string;
            name: string;
            email: string;
            status: string;
            profilePic?: string;
        };
    }> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND)
        }
        
        const isPasswordValid = await comparePassword(password, user.password)
        if (!isPasswordValid) {
            throw createHttpError(HttpStatus.UNAUTHORIZED, Messages.INVALID_CREDENTIALS)
        }
        
        if (user.status === 'blocked') {
            throw createHttpError(HttpStatus.FORBIDDEN, Messages.USER_BLOCKED)
        }
        const accessToken = generateAccessToken(user.id.toString(), user.role);
        const refreshToken = generateRefreshToken(user.id.toString(), user.role)

        return {
            status: HttpStatus.OK,
            message: Messages.LOGIN_SUCCESS,
            accessToken,
            refreshToken,
            role: user.role,
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                status: user.status,
                profilePic: user.profilePic || "",
            },
        }
    };

    async refreshAccessToken(token: string): Promise<string> {
        const decoded = verifyRefreshToken(token);
        if (!decoded){
            throw createHttpError(HttpStatus.UNAUTHORIZED, Messages.INVALID_TOKEN)
        }
        const accessToken = generateAccessToken(decoded.id, decoded.role)
        return accessToken
    };
};