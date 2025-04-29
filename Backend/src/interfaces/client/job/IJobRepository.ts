import { IJob } from "../../../models/client/jobModel";

export interface IJobRepository {
    createJob(jobData: Partial<IJob>): Promise<IJob>;
    updateJob(jobId: string, jobData: Partial<IJob>): Promise<IJob>;
    getJobs(page?: number, limit?: number, search?: string, filter?: string, sort?: string): Promise<{ jobs: IJob[], total: number }>;
    getJobById(jobId: string): Promise<IJob | null>;
    getJobsByClientId(
        userId: string,
        page?: number,
        limit?: number,
        search?: string,
        filter?: string,
        sort?: string
    ): Promise<{ jobs: IJob[], total: number }>;
    incrementApplicants(jobId: string): Promise<void>;
    decrementApplicants(jobId: string): Promise<void>;
}