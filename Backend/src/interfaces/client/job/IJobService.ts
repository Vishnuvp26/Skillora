import { IJob } from "../../../models/client/jobModel";

export interface IJobService {
    addJob(userId: string, jobData: Partial<IJob>): Promise<IJob>;
    updateJob(jobId: string, jobData: Partial<IJob>): Promise<IJob>;
    getJobs(): Promise<IJob[]>;
    getJobById(jobId: string): Promise<IJob | null>;
    getJobsByClientId(userId: string): Promise<IJob[]>;
}   