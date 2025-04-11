import { Request, Response, NextFunction } from 'express';
import { IReviewController } from '../../interfaces/client/review/IReviewController';
import { HttpStatus } from '../../constants/statusContstants';
import { Messages } from '../../constants/messageConstants';
import { IReviewService } from '../../interfaces/client/review/IReviewService';

export class ReviewController implements IReviewController {
    constructor(private _reviewService: IReviewService) { }
    
    async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contractId, freelancerId, rating, description } = req.body;
            const { clientId } = req.params;

            if (!contractId || !freelancerId || !rating || !description) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.MISSING_PARAMETERS })
                return;
            }

            const review = await this._reviewService.createReview({
                contractId,
                clientId,
                freelancerId,
                rating,
                description
            });

            res.status(HttpStatus.CREATED).json({
                message: Messages.REVIEW_CREATED,
                data: review
            })
        } catch (error) {
            next(error)
        }
    };

    async getReviewsByFreelancer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { freelancerId } = req.params;

            if (!freelancerId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.ID_REQUIRED });
                return;
            }

            const reviews = await this._reviewService.getReviewsByFreelancer(freelancerId);

            res.status(HttpStatus.OK).json({
                count: reviews.length,
                data: reviews
            })
        } catch (error) {
            next(error)
        }
    };
}