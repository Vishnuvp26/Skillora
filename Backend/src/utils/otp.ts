import redisClient from "../config/redis.config";
import crypto from "crypto";
import { sendEmail } from "../utils/email";

export const generateOtp = (): string => {
    return crypto.randomInt(100000, 999999).toString();
};

export const sendOtp = async (email: string, otp: string): Promise<void> => {
    await sendEmail(email, "Your OTP Code for skillora registration", `Your OTP is: ${otp}`);
};

export const storeOtp = async (email: string, otp: string): Promise<void> => {
    await redisClient.setEx(email, 60, otp);
    console.log(`Stored OTP for ${email}:`, otp);
};

export const verifyOtp = async (email: string, otp: string): Promise<{ success: boolean; message?: string }> => {
    const storedOtp = await redisClient.get(email);
    
    if (!storedOtp) {
        console.log(`OTP expired or not found for ${email}`);
        return { success: false, message: "OTP has expired. Please request a new one." };
    }

    console.log(`Stored OTP: ${storedOtp}, Entered OTP: ${otp}`);
    
    if (storedOtp !== otp) {
        return { success: false, message: "Incorrect OTP. Please try again." };
    }

    return { success: true };
};


export const deleteOtp = async (email: string): Promise<void> => {
    await redisClient.del(email);
};