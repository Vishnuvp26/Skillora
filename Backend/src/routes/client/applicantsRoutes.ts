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

router.get(
    "/:jobId/:clientId",
    applicationController.getJobApplicants.bind(applicationController)
)

export default router