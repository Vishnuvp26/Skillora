import { application } from "express";
import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants";
import { IApplicationRepository } from "../../interfaces/client/application/IApplicationRepository";
import { IApplicationService } from "../../interfaces/client/application/IApplicationService";
import { IJobRepository } from "../../interfaces/client/job/IJobRepository";
import { IApplication } from "../../models/client/applicationModel";
import { createHttpError } from "../../utils/httpError";
import mongoose from "mongoose";

export class ApplicationService implements IApplicationService {
    constructor(
        private _applicationRepository: IApplicationRepository,
        private _jobRepository: IJobRepository
    ) { }
    
    async applyForJob(jobId: string, freelancerId: string ): Promise<IApplication> {
        const job = await this._jobRepository.getJobById(jobId);
        if (!job) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        };
        
        if (job.status !== "Open") {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.JOB_CLOSED)
        }

        const existingApplication = await this._applicationRepository.getApplicationByJobAndFreelancer(jobId, freelancerId);
        if (existingApplication) {
            throw createHttpError(HttpStatus.CONFLICT, Messages.ALREADY_APPLIED);
        }

        const application: IApplication = {
            jobId: new mongoose.Types.ObjectId(jobId),
            freelancerId: new mongoose.Types.ObjectId(freelancerId),
            isApplied: true,
            status: "Pending"
        } as IApplication;

        const newApplication = await this._applicationRepository.createApplication(application)

        await this._jobRepository.incrementApplicants(jobId);

        return newApplication;
    };

    async cancelApplication(applicationId: string, freelancerId: string): Promise<boolean> {
        const application = await this._applicationRepository.findId(applicationId);
        if (!application) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.JOB_APPLICATION_REQUIRED)
        }

        if (application.freelancerId.toString() !== freelancerId) {
            throw createHttpError(HttpStatus.FORBIDDEN, Messages.ACCESS_DENIED)
        }

        const result = await this._applicationRepository.deleteApplication(applicationId);

        if (result) {
            await this._jobRepository.decrementApplicants(application.jobId.toString())
        }

        return result;
    };

    async getJobApplicants(jobId: string, clientId: string): Promise<IApplication[]> {
        const job = await this._jobRepository.getJobById(jobId);
        if (!job) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND);
        }

        if (job.clientId._id.toString() !== clientId) {
            throw createHttpError(HttpStatus.FORBIDDEN, Messages.ACCESS_DENIED);
        }

        return await this._applicationRepository.getApplicationsByJobId(jobId);
    };

    async getFreelancerApplications(freelancerId: string): Promise<IApplication[]> {
        return await this._applicationRepository.getApplicationsByFreelancer(freelancerId);
    };

    async getApplicationDetail(jobId: string, freelancerId: string): Promise<IApplication | null> {
        return await this._applicationRepository.findOne({jobId, freelancerId})
    }
};