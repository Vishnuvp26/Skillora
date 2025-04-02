import { axiosInstance } from "../axios/axiosInstance"

export const fetchAllContracts = async () => {
    try {
        const response = await axiosInstance.get('/api/client/contract/all-contracts');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to get all contracts"
    }
};