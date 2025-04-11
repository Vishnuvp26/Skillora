import mongoose from "mongoose";
import { IReviewRepository } from "../../interfaces/client/review/IReviewRepository";
import Review, { IReview } from "../../models/client/reviewMode";
import { BaseRepository } from "../base/baseRepository";

export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor() {
        super(Review)
    }

    async createReview(reviewData: IReview): Promise<IReview> {
        const review = new Review(reviewData);
        return await this.create(review);
    };

    async getReviewsByFreelancer(freelancerId: string): Promise<IReview[]> {
        return await this.model.find({
            freelancerId: new mongoose.Types.ObjectId(freelancerId),
            isDeleted: false
        })
        .populate('clientId', 'name email profilePic')
        .populate('contractId')
        .sort({ createdAt: -1 });
    };

    async getReviewByContract(contractId: string): Promise<IReview | null> {
        return await this.model.findOne({
            contractId: new mongoose.Types.ObjectId(contractId),
            isDeleted: false
        });
    };
}