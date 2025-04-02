import Axios, { axiosInstance } from "../axios/axiosInstance"

export const applyJob = async (jobId: string, freelancerId: string) => {
    try {
        const response = await Axios.post(`/api/freelancer/jobs/apply-job/${jobId}/${freelancerId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to apply for job";
    }
};

export const cancelApplication = async (applicationId: string, freelancerId: string) => {
    try {
        const response = await Axios.delete(`/api/freelancer/jobs/cancel-application/${applicationId}/${freelancerId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to cancel job application";
    }
};

export const viewAppliedJobs = async (freelancerId: string) => {
    try {
        const response = await axiosInstance.get(`/api/freelancer/jobs/applied-jobs/${freelancerId}`);
        return response.data
    } catch (error: any) {
        throw error.response?.data || "Failed to get applied jobs"
    }
};

export const getApplicantStatus = async (jobId: string, freelancerId: string) => {
    
    try {
        const response = await axiosInstance.get(`api/freelancer/jobs/applied-status/${jobId}/${freelancerId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to get applicant status"
    }
};