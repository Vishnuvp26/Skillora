import Axios, { axiosInstance } from "../axios/axiosInstance"

export const approveContract = async (contractId: string, freelancerId: string) => {
    console.log('CONTRACT ID: ', contractId);
    console.log('FREELANCER ID: ', freelancerId);
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