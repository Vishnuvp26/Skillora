import { Request, Response, NextFunction } from "express";

export interface ICategoryController {
    getCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    addCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    editCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    listCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    unlistCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
}