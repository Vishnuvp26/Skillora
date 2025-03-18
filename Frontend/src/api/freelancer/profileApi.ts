import { IFreelancer } from "@/types/Types";
import { axiosInstance } from "../axios/axiosInstance"

export const getProfile = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/api/freelancer/profile/get-profile/${id}`)
        return response.data
    } catch (error: any) {
        throw error.response?.data || 'Failed to get profile'
    }
};

export const updateProfile = async (id: string, profileData: Partial<IFreelancer>) => {
    try {
        console.log('SENTING PROFILE DATA FROM AXIOS :', profileData)
        const response = await axiosInstance.put(`/api/freelancer/profile/update-profile/${id}`, profileData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to update profile";
    }
};

export const uploadProfileImage = async (id: string, file: File) => {
    try {
        const formData = new FormData();
        formData.append("profilePic", file);

        const response = await axiosInstance.post(
            `/api/freelancer/profile/upload-image/${id}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to upload profile image";
    }
};