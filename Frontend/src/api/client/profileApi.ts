import { IClient } from "@/types/Types";
import Axios from "../axios/axiosInstance"

export const fetchProfile = async (id: string) => {
    try {
        const response = await Axios.get(`/api/client/profile/get-profile/${id}`)
        return response.data
    } catch (error: any) {
        throw error.response?.data || "Failed to get profile"
    }
};

export const updateProfile = async (id: string, profileData: Partial<IClient>) => {
    try {
        const response = await Axios.put(`/api/client/profile/update-profile/${id}`, profileData)
        return response.data
    } catch (error: any) {
        throw error.response?.data || "Failed to update profile"
    }
};

export const uploadProfileImage = async (id: string, file: File) => {
    try {
        const formData = new FormData();
        formData.append("profilePic", file);

        const response = await Axios.post(
            `/api/client/profile/upload-image/${id}`,
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