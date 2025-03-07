import { Request, Response, NextFunction } from "express";

export interface ISkillsController {
    getSkills(req: Request, res: Response, next: NextFunction): Promise<void>;
    addSkills(req: Request, res: Response, next: NextFunction): Promise<void>;
    editSkills(req: Request, res: Response, next: NextFunction): Promise<void>;
    listSkills(req: Request, res: Response, next: NextFunction): Promise<void>;
    unlistSkills(req: Request, res: Response, next: NextFunction): Promise<void>;
};