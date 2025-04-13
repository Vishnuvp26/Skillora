import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants";
import { ICategoryRepository } from "../../interfaces/admin/category/ICategoryRepository";
import { ICategoryService } from "../../interfaces/admin/category/ICategoryService";
import { ICategory } from "../../models/admin/categoryModel";
import { createHttpError } from "../../utils/httpError";

export class CategoryService implements ICategoryService {
    constructor(private categoryRepository: ICategoryRepository) {}

    async getCategory(): Promise<ICategory[]> {
        return await this.categoryRepository.findAll();
    };

    async addCategory(data: Partial<ICategory>): Promise<ICategory> {
        const normalizedCategoryName = data.name!.trim();
    
        const existingCategory = await this.categoryRepository.findByName(normalizedCategoryName.toLowerCase());
        if (existingCategory) {
            throw createHttpError(HttpStatus.CONFLICT, Messages.CATEGORY_EXIST);
        }
        return await this.categoryRepository.create({ ...data, name: normalizedCategoryName });
    };

    async editCategory(id: string, data: Partial<ICategory>): Promise<ICategory> {
        if (data.name) {
            const normalizedCategoryName = data.name.trim();
    
            const existingCategory = await this.categoryRepository.findByName(normalizedCategoryName.toLowerCase());
            if (existingCategory && existingCategory.id !== id) {
                throw createHttpError(HttpStatus.CONFLICT, Messages.CATEGORY_EXIST);
            }
            data.name = normalizedCategoryName;
        }
    
        const updatedCategory = await this.categoryRepository.findByIdAndUpdate(id, data);
        if (!updatedCategory) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.CATEGORY_NOT_FOUND);
        }
        return updatedCategory;
    };
    
    async listCategory(id: string): Promise<void> {
        const category = await this.categoryRepository.findByIdAndUpdate(id, { isListed: true });
        if (!category) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.CATEGORY_NOT_FOUND);
        }
    };

    async unlistCategory(id: string): Promise<void> {
        const category = await this.categoryRepository.findByIdAndUpdate(id, { isListed: false });
        if (!category) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.CATEGORY_NOT_FOUND);
        }
    };
}