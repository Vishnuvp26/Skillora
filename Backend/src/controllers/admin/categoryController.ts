import { NextFunction, Request, response, Response } from "express";
import { ICategoryController } from "../../interfaces/admin/category/ICategoryController";
import { ICategoryService } from "../../interfaces/admin/category/ICategoryService";
import { HttpStatus } from "../../constants/statusContstants";
import { Messages } from "../../constants/messageConstants";

export class CategoryController implements ICategoryController {
    constructor(private _categoryService: ICategoryService) { }
    
    async getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this._categoryService.getCategory();
            res.status(HttpStatus.OK).json({ success: true, data: response });
        } catch (error) {
            next(error)
        }
    };

    async addCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this._categoryService.addCategory(req.body)
            res.status(HttpStatus.CREATED).json({success: true, data: response})
        } catch (error) {
            next(error)
        }
    };

    async editCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this._categoryService.editCategory(req.params.id, req.body)
            res.status(HttpStatus.OK).json({success: true, data: response})
        } catch (error) {
            next(error)
        }
    };

    async listCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this._categoryService.listCategory(req.params.id);
            res.status(HttpStatus.OK).json({ success: true, message: Messages.CATEGORY_LISTED });
        } catch (error) {
            next(error);
        }
    };

    async unlistCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this._categoryService.unlistCategory(req.params.id);
            res.status(HttpStatus.OK).json({ success: true, message: Messages.CATEGORY_UNLISTED });
        } catch (error) {
            next(error);
        }
    };
};