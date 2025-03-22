import { Request, Response, NextFunction } from "express";
import { IJobController } from "../../interfaces/client/job/IJobController";
import { IJobService } from "../../interfaces/client/job/IJobService";
import { HttpStatus } from "../../constants/statusContstants";
import { Messages } from "../../constants/messageConstants";

export class JobController implements IJobController {
    constructor(private _jobService: IJobService) { }
    
    async createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const jobData = req.body

            if (!userId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.USER_NOT_FOUND })
                return;
            }

            const addedJob = await this._jobService.addJob(userId, jobData);
            res.status(HttpStatus.OK).json({ message: Messages.JOB_UPDATED, job: addedJob });
        } catch (error) {
            next(error)
        }
    };

    async getJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const jobs = await this._jobService.getJobs()
            res.status(HttpStatus.OK).json({ jobs });
        } catch (error) {
            next(error)
        }
    };

    async getJobById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const jobId = req.params.id;

            if (!jobId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.JOB_NOT_FOUND })
                return;
            }

            const job = await this._jobService.getJobById(jobId);

            if (!job) {
                res.status(HttpStatus.NOT_FOUND).json({ message: Messages.JOB_NOT_FOUND });
                return;
            }
            
            res.status(HttpStatus.OK).json({ job });
        } catch (error) {
            next(error)
        }
    };

    async updateJob(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const jobId = req.params.id;
            const userId = req.body.userId;
            const jobData = req.body

            if (!jobId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.JOB_NOT_FOUND });
                return
            }

            const existingJob = await this._jobService.getJobById(jobId)

            if (!existingJob) {
                res.status(HttpStatus.FORBIDDEN).json({ message: Messages.ACCESS_DENIED })
                return
            }

            if (existingJob.clientId._id.toString() !== userId) {
                res.status(HttpStatus.FORBIDDEN).json({ message: Messages.ACCESS_DENIED });
                return;
            }

            const updatedJob = await this._jobService.updateJob(jobId, jobData);
            res.status(HttpStatus.OK).json({ message: Messages.JOB_UPDATED, job: updatedJob});
        } catch (error) {
            next(error)
        }
    };

    async getClientJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;

            if(!userId){
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.USER_NOT_FOUND });
                return
            }

            const jobs = await this._jobService.getJobsByClientId(userId);
            res.status(HttpStatus.OK).json({ jobs })
        } catch (error) {
            next(error)
        }
    };
}