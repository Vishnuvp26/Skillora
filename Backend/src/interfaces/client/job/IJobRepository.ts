import { IJob } from "../../../models/client/jobModel";

export interface IJobRepository {
    createJob(jobData: Partial<IJob>): Promise<IJob>;
    updateJob(jobId: string, jobData: Partial<IJob>): Promise<IJob>;
    getJobs(): Promise<IJob[]>;
    getJobById(jobId: string): Promise<IJob | null>;
    getJobsByClientId(userId: string): Promise<IJob[]>;
}