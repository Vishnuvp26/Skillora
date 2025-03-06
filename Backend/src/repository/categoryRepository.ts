import { ICategoryRepository } from "../interfaces/admin/category/ICategoryRepository";
import Category, { ICategory } from "../models/admin/categoryModel";
import { BaseRepository } from "./baseRepository";

export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {
    constructor() {
        super(Category);
    }

    async findByName(name: string): Promise<ICategory | null> {
        return await this.findOne({ name });
    }    
}