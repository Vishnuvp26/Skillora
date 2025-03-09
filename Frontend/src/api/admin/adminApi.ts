import Axios from "../axios/axiosInstance";

export const fetchClients = async () => {
    try {
        const response = await Axios.get('/api/admin/users/get-clients');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to get clients';
    }
};

export const fetchFreelancers = async () => {
    try {
        const response = await Axios.get('/api/admin/users/get-freelancers');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to get freelancers';
    }
};

export const blockFreelancer = async (freelancerId: string) => {
    try {
        const response = await Axios.put(`/api/admin/users/block-freelancer/${freelancerId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to block freelancer';
    }
};

export const unblockFreelancer = async (freelancerId: string) => {
    try {
        const response = await Axios.put(`/api/admin/users/unblock-freelancer/${freelancerId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to unblock freelancer';
    }
};

export const blockClient = async (clientId: string) => {
    try {
        const response = await Axios.put(`/api/admin/users/block-client/${clientId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to block client';
    }
};

export const unblockClient = async (clientId: string) => {
    try {
        const response = await Axios.put(`/api/admin/users/unblock-client/${clientId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || 'Failed to unblock client';
    }
};