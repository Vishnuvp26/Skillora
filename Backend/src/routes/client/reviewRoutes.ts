import express from 'express';
import { ReviewRepository } from '../../repository/client/reviewRepository';
import { ContractRepository } from '../../repository/client/contractRepository';
import { ReviewService } from '../../services/client/reviewService';
import { ReviewController } from '../../controllers/client/reviewController';
import { authenticateToken, authorizeRoles } from '../../middlewares/authMiddleware';

const router = express.Router();

const reviewRepository = new ReviewRepository();
const contractRepository = new ContractRepository()
const reviewService = new ReviewService(reviewRepository, contractRepository);
const reviewController = new ReviewController(reviewService);

router.post(
    "/rate-freelancer/:clientId",
    authenticateToken,
    authorizeRoles('client'),
    reviewController.createReview.bind(reviewController)
);

router.get(
    "/show-reviews/:freelancerId",
    reviewController.getReviewsByFreelancer.bind(reviewController)
);

export default router;