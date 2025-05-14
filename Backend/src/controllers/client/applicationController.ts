import { Request, Response, NextFunction } from "express";
import { IApplicationController } from "../../interfaces/client/application/IApplicationController";
import { IApplicationService } from "../../interfaces/client/application/IApplicationService";
import { HttpStatus } from "../../constants/statusContstants";
import { Messages } from "../../constants/messageConstants";
import { AuthRequest } from "../../middlewares/authMiddleware";

export class ApplicationController implements IApplicationController {
    constructor(private _applicationService: IApplicationService) { }
    
    async applyForJob(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const jobId = req.params.jobId;
            const freelancerId = req.user?.id

            if (!jobId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.JOB_ID_REQUIRED });
                return;
            }

            if (!freelancerId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.FREELANCER_ID_REQUIRED });
                return;
            }

            const application = await this._applicationService.applyForJob(jobId, freelancerId);
            res.status(HttpStatus.CREATED).json({ message: Messages.JOB_APPLICATION_SUCCESS, application });
        } catch (error) {
            next(error)
        }
    };

    async cancelApplication(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const applicationId = req.params.applicationId;
            const freelancerId = req.user?.id;

            if (!applicationId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.JOB_APPLICATION_REQUIRED });
                return;
            }

            if (!freelancerId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.FREELANCER_ID_REQUIRED });
                return;
            }

            const result = await this._applicationService.cancelApplication(applicationId, freelancerId);
            if (result) {
                res.status(HttpStatus.OK).json({ message: Messages.JOB_APPLICATION_CANCELLED });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ messages: Messages.FAILED });
            }
        } catch (error) {
            next(error)
        }
    };

    async getJobApplicants(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const jobId = req.params.jobId;
            const clientId = req.params.clientId;

            if (!jobId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.JOB_ID_REQUIRED });
                return;
            }

            if (!clientId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.ID_REQUIRED });
                return;
            }

            const applicants = await this._applicationService.getJobApplicants(jobId, clientId);
            res.status(HttpStatus.OK).json({
                message: `Found ${applicants.length} applicants for this job`,
                applicants
            });
        } catch (error) {
            next(error)
        }
    };

    async getFreelancerApplication(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const freelancerId = req.user?.id;

            if (!freelancerId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.USER_NOT_FOUND });
                return;
            }

            const applications = await this._applicationService.getFreelancerApplications(freelancerId);
            res.status(HttpStatus.OK).json({ applications });
        } catch (error) {
            next(error)
        }
    };

    async getJobApplicationDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const jobId = req.params.jobId;
            const freelancerId = req.user?.id;

            if (!jobId || !freelancerId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.MISSING_PARAMETERS });
                return;
            }
            const application = await this._applicationService.getApplicationDetail(jobId, freelancerId);
            res.status(HttpStatus.OK).json({ application });
        } catch (error) {
            next(error)
        }
    };
};