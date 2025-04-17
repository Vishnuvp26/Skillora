import express from 'express';
import { JobRepository } from '../../repository/client/jobRepository';
import { JobService } from '../../services/client/jobService';
import { JobController } from '../../controllers/client/jobController';
import { authenticateToken, authorizeRoles } from '../../middlewares/authMiddleware';

const router = express.Router()

const jobRepository = new JobRepository();
const jobService = new JobService(jobRepository);
const jobController = new JobController(jobService);

router.get(
    "/get-jobs",
    jobController.getJobs.bind(jobController)
);

router.post(
    "/create-job/:id",
    authenticateToken,
    authorizeRoles('client'),
    jobController.createJob.bind(jobController)
);

router.get(
    "/job-details/:id",
    authenticateToken,
    authorizeRoles('client', 'freelancer'),
    jobController.getJobById.bind(jobController)
);

router.get(
    "/my-jobs/:id",
    jobController.getClientJobs.bind(jobController)
);

router.put(
    "/update-job/:id",
    authenticateToken,
    authorizeRoles('client'),
    jobController.updateJob.bind(jobController)
);

router.post(
    "/payment/:jobId",
    authenticateToken,
    authorizeRoles('client'),
    jobController.stripePayment.bind(jobController)
);

export default router;