import { IReview } from "../../../models/client/reviewMode";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface IReviewRepository extends IBaseRepository<IReview> {
    createReview(reviewData: IReview): Promise<IReview>;
    getReviewByContract(contractId: string): Promise<IReview | null>;
    getReviewsByFreelancer(freelancerId: string): Promise<IReview[]>;
}