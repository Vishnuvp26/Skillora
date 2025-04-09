import Axios, { axiosInstance } from "../axios/axiosInstance";

export const createContract = async (jobId: string, clientId: string, data: { freelancerId: string; amount: number }) => {
    try {
        const response = await Axios.post(`/api/client/contract/create-contract/${jobId}/${clientId}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to create contract";
    }
};

export const deleteContract = async (contractId: string) => {
    try {
        const response = await axiosInstance.delete(`/api/client/contract/cancel-contract/${contractId}`);
        return response.data
    } catch (error: any) {
        throw error.response?.data || "Failed to delete contract"
    }
};

export const isContractCreated = async (jobId: string, clientId: string) => {
    try {
        const response = await Axios.get(`/api/client/contract/is-created/${jobId}/${clientId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to check"
    }
};

export const getClientContracts = async (clientId: string) => {
    try {
        const response = await Axios.get(`api/client/contract/get-contracts/${clientId}`);
        console.log('CLIENT CONTRACT FETCHED IN AXIOS', response.data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to get clients contracts"
    }
};