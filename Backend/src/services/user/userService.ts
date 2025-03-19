import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants"; 
import { createHttpError } from "../../utils/httpError"; 
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { Iuser } from "../../models/user/userModel";
import { deleteOtp, generateOtp, sendOtp, storeOtp, verifyOtp } from "../../utils/otp";
import { hashPassword, comparePassword } from "../../utils/password";
import { IUserService } from "../../interfaces/user/IUserService";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { verifyGoogleToken } from "../../utils/googleAuth";
import { IProfileRepository } from "../../interfaces/freelancer/profile/IProfileRepository";
import { IProfileRepositoryClient } from "../../interfaces/client/profile/IProfileRepository";

export class UserService implements IUserService {
    private userRepository: IUserRepository;
    private freelancerRepository: IProfileRepository;
    private clientRepository: IProfileRepositoryClient

    constructor(userRepository: IUserRepository, freelancerRepository: IProfileRepository, clientRepository: IProfileRepositoryClient) {
        this.userRepository = userRepository;
        this.freelancerRepository = freelancerRepository;
        this.clientRepository = clientRepository
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
    
        if (!isValidOtp.success) {
            console.log(`[DEBUG] Invalid OTP. Aborting user creation.`);
            throw createHttpError(HttpStatus.BAD_REQUEST, isValidOtp.message || 'Otp validation fail in service');
        }
    
        if (!userData.password) {
            console.log("Error: Password is undefined");
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.PASSWORD_REQUIRED);
        }
    
        console.log("Hashing password for:", email);
        userData.password = await hashPassword(userData.password);
    
        console.log("Creating user:", userData);
        const user = await this.userRepository.create(userData as Iuser);
    
        console.log("Deleting OTP for:", email);
        await deleteOtp(email);
    
        if (userData.role === "freelancer") {
            console.log("Creating Freelancer Profile for:", email);
            await this.freelancerRepository.create({
                userId: user.id,
                firstName: user.name,
                title: "",
                bio: "",
                profilePic: "",
                skills: [],
                jobCategory: null,
                city: "",
                state: "",
                country: "",
                zip: "",
                language: [],
                portfolio: [],
                education: { college: "", course: "" },
                experienceLevel: "Beginner",
                employmentHistory: []
            });
        }

        if (userData.role === "client") {
            console.log("Creating Client Profile for:", email);
            await this.clientRepository.create({
                userId: user.id,
                firstName: user.name,
                city: "",
                state: "",
                profilePic: "",
            })
        }
        return { status: HttpStatus.CREATED, message: Messages.SIGNUP_SUCCESS };
    }

    async resendOtp(email: string): Promise<{ status: number; message: string }> {
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

        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.INVALID_CREDENTIALS)
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

    //Google Auth
    async googleLogin(token: string, role: "client" | "freelancer") {
        const googleUser = await verifyGoogleToken(token);
        if (!googleUser || !googleUser.email || !googleUser.name) {
            throw createHttpError(HttpStatus.UNAUTHORIZED, Messages.INVALID_GOOGLE_TOKEN);
        }
    
        let user = await this.userRepository.findByEmail(googleUser.email);

        console.log("Google Login User Data:", user);
        
        if (!user) {
            user = await this.userRepository.create({
                name: googleUser.name,
                email: googleUser.email,
                profilePic: googleUser.profilePic || "",
                role,
                status: "active",
                password: "",
                isGoogleAuth: true
            } as Iuser);                        
        }
        
        console.log("User status before returning:", user.status);
    
        if (user.status === "blocked") {
            throw createHttpError(HttpStatus.FORBIDDEN, Messages.USER_BLOCKED);
        }
    
        const accessToken = generateAccessToken(user.id.toString(), user.role);
        const refreshToken = generateRefreshToken(user.id.toString(), user.role);
    
        if (user.role === "freelancer") {
            const existingFreelancer = await this.freelancerRepository.findByUserId(user.id.toString())
            if (!existingFreelancer) {
                await this.freelancerRepository.create({
                    userId: user.id,
                    firstName: user.name,
                    title: "",
                    bio: "",
                    profilePic: googleUser.profilePic,
                    skills: [],
                    jobCategory: null,
                    city: "",
                    state: "",
                    country: "",
                    zip: "",
                    language: [],
                    profileCompleted: false,
                    portfolio: [],
                    education: { college: "", course: "" },
                    experienceLevel: "Beginner",
                    employmentHistory: []
                });
            }
        }

        if (user.role === "client") {
            const existingClient = await this.clientRepository.findByUserId(user.id.toString());
            if (!existingClient) {
                await this.clientRepository.create({
                    userId: user.id,
                    firstName: user.name,
                    city: "",
                    state: "",
                    profilePic: "",
                })
            }
        };

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
                profilePic: user.profilePic,
                status: user.status || "active",
            },
        };
    };    
};