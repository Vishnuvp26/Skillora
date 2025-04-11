import Axios, { axiosInstance } from "../axios/axiosInstance";

interface ReviewPayload {
  clientId: string;
  contractId: string;
  freelancerId: string;
  rating: number;
  description: string;
}

export const reviewFreelancer = async ({
    clientId,
    contractId,
    freelancerId,
    rating,
    description
}: ReviewPayload) => {
    try {
        const response = await Axios.post(
            `/api/client/review/rate-freelancer/${clientId}`,
            { contractId, freelancerId, rating, description }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to submit review";
    }
};

export const getFreelancerReviews = async (freelancerId: string) => {
    try {
        const response = await axiosInstance.get(
            `/api/client/review/show-reviews/${freelancerId}`
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Failed to fetch reviews";
    }
};