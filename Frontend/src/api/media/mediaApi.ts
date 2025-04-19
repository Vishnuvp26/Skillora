import { axiosInstance } from "../axios/axiosInstance";

export const uploadChatMedia = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("media", file);

        console.log('FORMDATA in axios', formData);
        

        const response = await axiosInstance.post(
            `/api/media/upload`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to upload media";
    }
};