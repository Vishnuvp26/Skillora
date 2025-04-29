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

    async getJobs(page: number = 1, limit: number = 4, search: string = '', filter: string = '', sort: string = ''): Promise<{ jobs: IJob[], total: number }> {
        const query: any = { status: "Open" };
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
    
        if (filter) {
            query.experienceLevel = filter;
        }
    
        const skip = (page - 1) * limit;
    
        let sortObj: any = { createdAt: -1 };
        if (sort) {
            switch (sort) {
                case 'budgetHigh':
                    sortObj = { rate: -1 };
                    break;
                case 'budgetLow':
                    sortObj = { rate: 1 };
                    break;
                case 'dateNew':
                    sortObj = { createdAt: -1 };
                    break;
                case 'dateOld':
                    sortObj = { createdAt: 1 };
                    break;
            }
        }
    
        const total = await this.model.countDocuments(query);
    
        const jobs = await this.model.find(query)
            .populate("category", "name")
            .populate("skills", "name")
            .populate("clientId", "name email")
            .populate("hiredFreelancer", "name email")
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .exec();
    
        return { jobs, total };
    }

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

    async getJobsByClientId(
        userId: string,
        page: number = 1,
        limit: number = 4,
        search: string = '',
        filter: string = '',
        sort: string = ''
    ): Promise<{ jobs: IJob[], total: number }> {
        const query: any = { 
            clientId: new mongoose.Types.ObjectId(userId)
        };
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
    
        if (filter) {
            query.experienceLevel = filter;
        }
    
        const skip = (page - 1) * limit;
    
        let sortObj: any = { createdAt: -1 };
        if (sort) {
            switch (sort) {
                case 'budgetHigh':
                    sortObj = { rate: -1 };
                    break;
                case 'budgetLow':
                    sortObj = { rate: 1 };
                    break;
                case 'dateNew':
                    sortObj = { createdAt: -1 };
                    break;
                case 'dateOld':
                    sortObj = { createdAt: 1 };
                    break;
            }
        }
    
        const total = await this.model.countDocuments(query);
    
        const jobs = await this.model.find(query)
            .populate("category", "name")
            .populate("skills", "name")
            .populate("hiredFreelancer", "name email")
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .exec();
    
        return { jobs, total };
    }

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