import mongoose from "mongoose";
import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants";
import { IJobRepository } from "../../interfaces/client/job/IJobRepository";
import { IJobService } from "../../interfaces/client/job/IJobService";
import { IJob } from "../../models/client/jobModel";
import { createHttpError } from "../../utils/httpError";

export class JobService implements IJobService {
    constructor(private _jobRepository: IJobRepository) { }
    
    async addJob(userId: string, jobData: Partial<IJob>): Promise<IJob> {
        if (!jobData.title || !jobData.description || !jobData.rate || 
            !jobData.experienceLevel || !jobData.location || !jobData.category || 
            !jobData.skills || jobData.skills.length === 0) {
            throw createHttpError(HttpStatus.CONFLICT, Messages.REQUIRED_ALL)
        }

        jobData.clientId = new mongoose.Types.ObjectId(userId);
        jobData.applicants = 0;
        jobData.status = "Open";

        const newJob = await this._jobRepository.createJob(jobData as IJob);
        return newJob
    };

    async getJobs(): Promise<IJob[]> {
        return this._jobRepository.getJobs()
    };

    async getJobById(jobId: string): Promise<IJob | null> {
        if (!mongoose.isValidObjectId(jobId)) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID)
        }
        return this._jobRepository.getJobById(jobId)
    };

    async updateJob(jobId: string, jobData: Partial<IJob>): Promise<IJob> {
        if (!mongoose.isValidObjectId(jobId)) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID)
        }

        const existingJob = await this._jobRepository.getJobById(jobId);
        if (!existingJob) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.JOB_NOT_FOUND)
        }

        if (jobData.title === "") {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.JOB_TITLE_REQUIRED)
        }

        if (jobData.description === "") {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.JOB_DESCRIPTION_REQUIRED)
        }

        if (jobData.rate !== undefined && jobData.rate < 0) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.JOB_RATE_LIMIT)
        }

        if (existingJob.applicants > 0) {
            const allowedUpdates = ['title', 'description', 'status'];
            
            const safeUpdates: Partial<IJob> = {};
            for (const field of allowedUpdates) {
                if (field in jobData) {
                    safeUpdates[field as keyof IJob] = jobData[field as keyof IJob];
                }
            }
            return this._jobRepository.updateJob(jobId, safeUpdates);
        }
        return this._jobRepository.updateJob(jobId, jobData);
    };

    getJobsByClientId(userId: string): Promise<IJob[]> {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID)
        }
        return this._jobRepository.getJobsByClientId(userId)
    }

};