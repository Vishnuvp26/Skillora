import redisClient from "../config/redis.config";
import crypto from "crypto";
import { sendEmail } from "../utils/email";

export const generateOtp = (): string => {
    return crypto.randomInt(100000, 999999).toString();
};

export const sendOtp = async (email: string, otp: string): Promise<void> => {
    const htmlContent = `
        <div style="max-width: 500px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #007bff; text-align: center;">Welcome to Skillora!</h2>
            <p style="font-size: 16px; color: #555; text-align: center;">Use the OTP below to verify your email and complete your registration.</p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; color: #333;">
                    ${otp}
                </span>
            </div>
            <p style="color: #888; text-align: center;">This OTP is valid for only <strong>5 minutes</strong>. Do not share it with anyone.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
            <p style="font-size: 14px; color: #777; text-align: center;">If you didn’t request this, please ignore this email.</p>
        </div>
    `;

    await sendEmail(email, "Skillora OTP Verification", "", htmlContent);
};

export const storeOtp = async (email: string, otp: string): Promise<void> => {
    await redisClient.setEx(email, 60, otp);
    console.log(`[DEBUG] Stored OTP for ${email}: ${otp}`);
    const ttl = await redisClient.ttl(email);
    console.log(`[DEBUG] OTP for ${email} will expire in ${ttl} seconds.`);
};

export const verifyOtp = async (email: string, otp: string): Promise<{ success: boolean; message?: string }> => {
    const storedOtp = await redisClient.get(email);
    
    if (!storedOtp) {
        console.log(`[DEBUG] OTP expired or not found for ${email}`);
        return { success: false, message: "OTP has expired. Please request a new one." };
    }

    if (storedOtp !== otp) {
        return { success: false, message: "Incorrect OTP. Please try again." };
    }
    return { success: true };
};

export const deleteOtp = async (email: string): Promise<void> => {
    await redisClient.del(email);
};