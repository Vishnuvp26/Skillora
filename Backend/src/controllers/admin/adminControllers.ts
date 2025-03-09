import { Request, Response, NextFunction, response } from "express";
import { IAdminController } from "../../interfaces/admin/handleUsers/IAdminController";
import { IAdminService } from "../../interfaces/admin/handleUsers/IAdminService";
import { HttpStatus } from "../../constants/statusContstants";

export class AdminController implements IAdminController {
    constructor(private _adminService: IAdminService) { }
    
    async getClients(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clients = await this._adminService.getClients()
            res.status(HttpStatus.OK).json({success: true, data: clients})
        } catch (error) {
            next(error)
        }
    };

    async getFreelancers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const freelancers = await this._adminService.getFreelancers()
            res.status(HttpStatus.OK).json({success: true, data: freelancers})
        } catch (error) {
            next(error)
        }
    };

    async blockFreelancer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { freelancerId } = req.params;
            const blockedFreelancer = await this._adminService.blockFreelancer(freelancerId);
            res.status(HttpStatus.OK).json({ success: true, data: blockedFreelancer });
        } catch (error) {
            next(error);
        }
    }

    async blockClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { clientId } = req.params;
            const blockedClient = await this._adminService.blockClient(clientId);
            res.status(HttpStatus.OK).json({ success: true, data: blockedClient });
        } catch (error) {
            next(error);
        }
    }

    async unblockFreelancer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { freelancerId } = req.params;
            const unblockedFreelancer = await this._adminService.unblockFreelancer(freelancerId);
            res.status(HttpStatus.OK).json({ success: true, data: unblockedFreelancer });
        } catch (error) {
            next(error);
        }
    }

    async unblockClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { clientId } = req.params;
            const unblockedClient = await this._adminService.unblockClient(clientId);
            res.status(HttpStatus.OK).json({ success: true, data: unblockedClient });
        } catch (error) {
            next(error);
        }
    }    
}