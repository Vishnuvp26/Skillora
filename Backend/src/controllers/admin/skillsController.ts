import { Request, Response, NextFunction } from "express";
import { ISkillsController } from "../../interfaces/admin/skills/ISkillsController";
import { ISkillsService } from "../../interfaces/admin/skills/ISkillsService";
import { HttpStatus } from "../../constants/statusContstants";
import { Messages } from "../../constants/messageConstants";

export class SKillsController implements ISkillsController {
    constructor(private _skillsService: ISkillsService) { }
    
    async getSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this._skillsService.getSkills();
            res.status(HttpStatus.OK).json({ success: true, data: response });
        } catch (error) {
            next(error)
        }
    };

    async addSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this._skillsService.addSkills(req.body);
            res.status(HttpStatus.CREATED).json({ success: true, data: response });
        } catch (error) {
            next(error)
        }
    };

    async editSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this._skillsService.editSkills(req.params.id, req.body);
            res.status(HttpStatus.OK).json({success: true, data: response})
        } catch (error) {
            next(error)
        }
    };

    async listSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this._skillsService.listSkills(req.params.id);
            res.status(HttpStatus.OK).json({success: true, message: Messages.SKILLS_LISTED})
        } catch (error) {
            next(error)
        }
    };

    async unlistSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this._skillsService.unlistSkills(req.params.id);
            res.status(HttpStatus.OK).json({success: true, message: Messages.SKILLS_UNLISTED})
        } catch (error) {
            next(error)
        }
    };
};