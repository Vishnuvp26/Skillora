import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants";
import { IContractRepository } from "../../interfaces/client/contract/IContractRepository";
import { IReviewRepository } from "../../interfaces/client/review/IReviewRepository";
import { IReviewService } from "../../interfaces/client/review/IReviewService";
import { IReview } from "../../models/client/reviewMode";
import { createHttpError } from "../../utils/httpError";

export class ReviewService implements IReviewService {
    constructor(
        private _reviewRepository: IReviewRepository,
        private _contractRepository: IContractRepository
    ) { };

    async createReview(reviewData: any): Promise<IReview> {
        const { contractId, clientId, freelancerId, rating, description } = reviewData;

        const contract = await this._contractRepository.getContractById(contractId);

        if (!contract) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.CONTRACT_NOT_FOUND);
        }

        if (contract.clientId.toString() !== clientId) {
            throw createHttpError(HttpStatus.FORBIDDEN, Messages.ACCESS_DENIED);
        }

        if (contract.status !== 'Completed') {
            throw createHttpError(HttpStatus.BAD_REQUEST, 'Cannot review until contract is completed');
        };

        const existingReview = await this._reviewRepository.getReviewByContract(contractId);
        if (existingReview) {
            throw createHttpError(HttpStatus.BAD_REQUEST, 'Review already exists for this contract');
        };

        return await this._reviewRepository.createReview({
            contractId,
            clientId,
            freelancerId,
            rating,
            description,
            isDeleted: false
        } as IReview);
    };

    async getReviewsByFreelancer(freelancerId: string): Promise<IReview[]> {
        return await this._reviewRepository.getReviewsByFreelancer(freelancerId);
    }
}