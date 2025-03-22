import Axios, { axiosInstance } from "../axios/axiosInstance"

export const createJob = async (id: string, formData: any) => {
    try {
        const response = await Axios.post(`/api/client/job/create-job/${id}`, formData)
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to add job"
    }
};

export const fetchMyJobs = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/api/client/job/my-jobs/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to get my jobs"
    }
};

export const fetchAllJobs = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/api/client/job/get-jobs/${id}`)
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to get all jobs"
    }
};

export const jobDetails = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/api/client/job/job-details/${id}`);
        return response.data
    } catch (error: any) {
        throw error.response?.data || "Failed to get job details"
    }
};

export const updateJob = async (id: string, formData: any) => {
    try {
        const response = await Axios.put(`/api/client/job/update-job/${id}`, formData)
        return response.data
    } catch (error: any) {
        throw error.response?.data || "Failed to edit job"
    }
};