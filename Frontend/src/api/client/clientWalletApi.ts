import Axios from "../axios/axiosInstance"

export const getWallet = async (userId: string) => {
    try {
        const response = await Axios.get(`/api/freelancer/wallet/earnings/${userId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to get wallet"
    }
};

export const transactions = async (walletId: string) => {
    try {
        const response = await Axios.get(`/api/freelancer/wallet/transactions/${walletId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to get transaction data"
    }
};