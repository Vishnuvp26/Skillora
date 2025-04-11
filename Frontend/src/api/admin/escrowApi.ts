import Axios from "../axios/axiosInstance"

export const escrowBalance = async () => {
    try {
        const response = await Axios.get('/api/admin/escrow/balance');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Faieled to get escrow balance"
    }
};

export const totalRevenue = async () => {
    try {
        const response = await Axios.get('/api/admin/escrow/total-revenue');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to get revenue"
    }
};

export const releaseFundToFreelancer = async (contractId: string) => {
    try {
        const response = await Axios.put(`/api/admin/escrow/release-fund/${contractId}`)
        return response;
    } catch (error: any) {
        throw error.response?.data || "Failed to "
    }
};

export const refundToClient = async (
    contractId: string, 
    clientId: string, 
    cancelReason: string, 
    cancelReasonDescription: string
) => {
    try {
        const response = await Axios.put(`/api/admin/escrow/refund-client/${contractId}/${clientId}`, {
            cancelReason,
            cancelReasonDescription
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to process refund";
    }
};