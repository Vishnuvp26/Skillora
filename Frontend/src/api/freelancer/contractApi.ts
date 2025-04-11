import Axios, { axiosInstance } from "../axios/axiosInstance"

export const approveContract = async (contractId: string, freelancerId: string) => {
    try {
        const response = await Axios.post(`/api/freelancer/contract/approve-contract/${contractId}/${freelancerId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to approve contract"
    }
};

export const getContracts = async (freelancerId: string) => {
    try {
        const response = await Axios.get(`/api/freelancer/contract/get-contracts/${freelancerId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to get contract"
    }
};

export const contractDetails = async (contractId: string) => {
    try {
        const response = await axiosInstance.get(`/api/freelancer/contract/view-contract/${contractId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to get contract details"
    }
};

export const updateWorkStatus = async (contractId: string, status: string) => {
    try {
        const response = await Axios.put(`/api/freelancer/contract/update-status/${contractId}`, { status });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to update work status";
    }
};

export const getCompletedWorks = async (freelancerId: string) => {
    try {
        const response = await Axios.get(`api/freelancer/contract/completed-works/${freelancerId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to get completed works"
    }
};