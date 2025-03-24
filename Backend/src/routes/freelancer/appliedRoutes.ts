import express from 'express';
import { ApplicationRepository } from '../../repository/client/applicationRepository';
import { JobRepository } from '../../repository/client/jobRepository';
import { ApplicationService } from '../../services/client/applicationService';
import { ApplicationController } from '../../controllers/client/applicationController';

const router = express.Router();

const applicationRepsitory = new ApplicationRepository();
const jobRepository = new JobRepository();
const applicationService = new ApplicationService(applicationRepsitory, jobRepository);
const applicationController = new ApplicationController(applicationService);

router.post(
    "/apply-job/:jobId/:freelancerId",
    applicationController.applyForJob.bind(applicationController)
)

router.delete(
    "/cancel-application/:applicationId/:freelancerId",
    applicationController.cancelApplication.bind(applicationController)
);

router.get(
    "/applied-jobs/:freelancerId",
    applicationController.getFreelancerApplication.bind(applicationController)
);

export default router;