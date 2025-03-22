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
        console.log('CREATING JOBBB..', job)
        return await this.create(job)
    };

    async getJobs(): Promise<IJob[]> {
        const jobs = await this.model.find()
            .populate("category", "name")
            .populate("skills", "name")
            .populate("clientId", "name email")
            .populate("hiredFreelancer", "name email")
            .exec();

        console.log("POPULATED JOBS:", jobs);
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
        console.log("Fetching jobs for client ID:", userId); // Debug log
    
        const jobs = await this.model.find({ clientId: new mongoose.Types.ObjectId(userId) }) // Fix: Change userId to clientId
            .populate("category", "name")
            .populate("skills", "name")
            .populate("hiredFreelancer", "name email")
            .exec();
    
        console.log("Jobs found:", jobs.length); // Debug: Check if jobs are retrieved
        return jobs;
    };
    
};