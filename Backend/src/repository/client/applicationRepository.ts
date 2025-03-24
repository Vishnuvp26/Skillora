import mongoose from "mongoose";
import { IApplicationRepository } from "../../interfaces/client/application/IApplicationRepository";
import Application, { IApplication } from "../../models/client/applicationModel";
import { BaseRepository } from "../base/baseRepository";

export class ApplicationRepository extends BaseRepository<IApplication> implements IApplicationRepository {
    constructor() {
        super(Application)
    }

    async createApplication(applicationData: IApplication): Promise<IApplication> {
        const application = new Application(applicationData);
        return await this.create(application)
    }

    async getApplicationByJobAndFreelancer(jobId: string, freelancerId: string): Promise<IApplication | null> {
        return await Application.findOne({
          jobId: new mongoose.Types.ObjectId(jobId),
          freelancerId: new mongoose.Types.ObjectId(freelancerId)
        });
    };

    async findId(applicationId: string): Promise<IApplication | null> {
        return this.model.findById(applicationId)
    };

    async deleteApplication(applicationId: string): Promise<boolean> {
        const result = await Application.deleteOne({ _id: new mongoose.Types.ObjectId(applicationId) });
        return result.deletedCount > 0;
    };

    async getApplicationsByJobId(jobId: string): Promise<IApplication[]> {
        return await this.model.find({ jobId: new mongoose.Types.ObjectId(jobId) })
            .populate({
                path: "freelancerId",
                model: "Freelancer",
                localField: "freelancerId",
                foreignField: "userId",
                justOne: true
            })
            .populate("jobId");
    };

    async getApplicationsByFreelancer(freelancerId: string): Promise<IApplication[]> {
        return await this.model.find({
            freelancerId: new mongoose.Types.ObjectId(freelancerId)
        })
        .populate({
            path: "jobId",
            populate: {
                path: "clientId",
                select: "name" // Only fetch client name
            }
        });
    }
    
}