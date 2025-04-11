import { IReview } from "../../../models/client/reviewMode";

export interface IReviewService {
    createReview(reviewData: any): Promise<IReview>;
    getReviewsByFreelancer(freelancerId: string): Promise<IReview[]>;
    // updateReview(reviewId: string, reviewData: Partial<IReview>, clientId: string): Promise<IReview>;
    // deleteReview(reviewId: string, clientId: string): Promise<void>;
}