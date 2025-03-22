import Axios from "../axios/axiosInstance"

export const createJob = async (id: string, formData: any) => {
    try {
        const response = await Axios.post(`/api/client/job/create-job/${id}`, formData)
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to add job"
    }
};