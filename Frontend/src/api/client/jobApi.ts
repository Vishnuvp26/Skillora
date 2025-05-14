import Axios, { axiosInstance } from "../axios/axiosInstance"

export const createJob = async (formData: any) => {
    try {
        const response = await Axios.post(`/api/client/job/create-job`, formData)
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to add job"
    }
};

export const fetchMyJobs = async (
    id: string, 
    page?: number, 
    limit?: number, 
    search?: string, 
    filter?: string, 
    sort?: string
) => {
    try {
        const response = await axiosInstance.get(
            `/api/client/job/my-jobs/${id}?page=${page}&limit=${limit}&search=${search}&sort=${sort}&filter=${filter}`
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to get my jobs"
    }
};

export const fetchAllJobs = async (page:number, limit:number, search: string, filter: string, sort: string) => {
    try {
        const response = await axiosInstance.get(`/api/client/job/get-jobs?page=${page}&limit=${limit}&search=${search}&sort=${sort}&filter=${filter}`)
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to get all jobs"
    }
};

export const jobDetails = async (id: string) => {
    try {
        const response = await Axios.get(`/api/client/job/job-details/${id}`);
        console.log('API Response:', response.data);
        return response.data
    } catch (error: any) {
        console.error('API Error:', error.response || error);
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

export const showApplicants = async (jobId: string, clientId: string) => {
    try {
        const response = await axiosInstance.get(`api/client/job/applicants/${jobId}/${clientId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to view applicants"
    }
}