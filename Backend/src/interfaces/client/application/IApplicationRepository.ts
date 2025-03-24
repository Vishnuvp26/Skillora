import { IApplication } from "../../../models/client/applicationModel";

export interface IApplicationRepository {
    createApplication(applicationData: IApplication): Promise<IApplication>;
    getApplicationByJobAndFreelancer(jobId: string, freelancerId: string): Promise<IApplication | null>;
    deleteApplication(applicationId: string): Promise<boolean>;
    getApplicationsByFreelancer(freelancerId: string): Promise<IApplication[]>;
    findId(applicationId: string): Promise<IApplication | null>;

    //Applied Freelancers
    getApplicationsByJobId(jobId: string): Promise<IApplication[]>;

    // getApplicationById(applicationId: string): Promise<IApplication | null>;
};