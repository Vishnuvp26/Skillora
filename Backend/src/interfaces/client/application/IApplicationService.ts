import { IApplication } from "../../../models/client/applicationModel";

export interface IApplicationService {
    applyForJob(jobId: string, freelancerId: string): Promise<IApplication>;
    cancelApplication(applicationId: string, freelancerId: string): Promise<boolean>;
    getFreelancerApplications(freelancerId: string): Promise<IApplication[]>;
    getJobApplicants(jobId: string, clientId: string): Promise<IApplication[]>;
    // getApplicantDetails(applicationId: string, clientId: string): Promise<IApplication>;
    getApplicationDetail(jobId: string, freelancerId: string): Promise<IApplication | null>;
};