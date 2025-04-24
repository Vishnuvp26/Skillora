import mongoose from "mongoose";
import { IJobRepository } from "../../interfaces/client/job/IJobRepository";
import Job, { IJob } from "../../models/client/jobModel";
import { BaseRepository } from "../base/baseRepository";

export class JobRepository extends BaseRepository<IJob> implements IJobRepository {
    constructor() {
        super(Job)
    }

    async createJob(jobData: IJob): Promise<IJob> {
        const job = new Job(jobData);
        return await this.create(job)
    };

    async getJobs(): Promise<IJob[]> {
        const jobs = await this.model.find({ status: "Open" })
            .populate("category", "name")
            .populate("skills", "name")
            .populate("clientId", "name email")
            .populate("hiredFreelancer", "name email")
            .sort({ createdAt: -1 })
            .exec();
        return jobs;
    };

    async getJobById(jobId: string): Promise<IJob | null> {
        const job = await this.model.findById(jobId)
            .populate("category", "name")
            .populate("skills", "name")
            .populate("clientId", "name")
            .populate({
                path: "hiredFreelancer",
                populate: { path: "userId", select: "name email" }
            })
            .exec()
        return job;
    };

    async updateJob(jobId: string, jobData: Partial<IJob>): Promise<IJob> {
        const updatedJob = await this.model.findByIdAndUpdate(
            jobId,
            { $set: jobData },
            {new: true, runValidators: true}
        )
        .populate("category", "name")
        .populate("skills", "name")
        .populate("clientId", "name email")
            .populate("hiredFreelancer", "name email")
        
        if (!updatedJob) {
            throw new Error("Job not found")
        }
        return updatedJob;
    };

    async getJobsByClientId(userId: string): Promise<IJob[]> {
        const jobs = await this.model.find({ clientId: new mongoose.Types.ObjectId(userId) })
            .populate("category", "name")
            .populate("skills", "name")
            .populate("hiredFreelancer", "name email")
            .exec();
        return jobs;
    };

    async incrementApplicants(jobId: string): Promise<void> {
        await this.model.updateOne(
            { _id: new mongoose.Types.ObjectId(jobId) },
            { $inc: { applicants: 1 } }
        );
    } 
    
    async decrementApplicants(jobId: string): Promise<void> {
        await this.model.updateOne(
            { _id: new mongoose.Types.ObjectId(jobId) },
            { $inc: { applicants: -1 } }
        );
    }
};