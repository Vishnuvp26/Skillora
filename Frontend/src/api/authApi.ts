import axiosInstance from "./axiosInstance";

export const registerUser = async (userData: { name: string; email: string; password: string; role: string }) => {
    try {
        const response = await axiosInstance.post("/auth/register", userData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Registration failed";
    }
};

export const verifyOtp = async (email: string, otp: string, userData = {}) => {
    console.log("Sending to backend:", { email, otp, userData }); // Debug log
    try {
        const response = await axiosInstance.post("/auth/verify-otp", { email, otp, userData });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "OTP verification failed";
    }
};