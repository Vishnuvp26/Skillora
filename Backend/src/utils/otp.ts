import redisClient from "../config/redis";
import crypto from "crypto";
import { sendEmail } from "../utils/email";

export const generateOtp = (): string => {
    return crypto.randomInt(100000, 999999).toString();
};

export const sendOtp = async (email: string, otp: string): Promise<void> => {
    await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);
};

export const storeOtp = async (email: string, otp: string): Promise<void> => {
    await redisClient.setEx(email, 300, otp);
    console.log(`Stored OTP for ${email}:`, otp);
};

export const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    const storedOtp = await redisClient.get(email);
    console.log(`Stored OTP: ${storedOtp}, Entered OTP: ${otp}`);
    return storedOtp === otp;
};

export const deleteOtp = async (email: string): Promise<void> => {
    await redisClient.del(email);
};