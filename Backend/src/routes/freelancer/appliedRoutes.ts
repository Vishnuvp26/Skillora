import express from 'express';
import { ApplicationRepository } from '../../repository/client/applicationRepository';
import { JobRepository } from '../../repository/client/jobRepository';
import { ApplicationService } from '../../services/client/applicationService';
import { ApplicationController } from '../../controllers/client/applicationController';
import { authenticateToken, authorizeRoles } from '../../middlewares/authMiddleware';

const router = express.Router();

const applicationRepsitory = new ApplicationRepository();
const jobRepository = new JobRepository();
const applicationService = new ApplicationService(applicationRepsitory, jobRepository);
const applicationController = new ApplicationController(applicationService);

router.post(
    "/apply-job/:jobId/:freelancerId",
    authenticateToken,
    authorizeRoles('freelancer'),
    applicationController.applyForJob.bind(applicationController)
);

router.delete(
    "/cancel-application/:applicationId/:freelancerId",
    authenticateToken,
    authorizeRoles('freelancer'),
    applicationController.cancelApplication.bind(applicationController)
);

router.get(
    "/applied-jobs/:freelancerId",
    applicationController.getFreelancerApplication.bind(applicationController)
);

router.get(
    "/applied-status/:jobId/:freelancerId",
    applicationController.getJobApplicationDetails.bind(applicationController)
);

export default router;