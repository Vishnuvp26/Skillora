import { ICategory } from "../../../models/admin/categoryModel";

export interface ICategoryService {
    getCategory(): Promise<ICategory[]>
    addCategory(data: Partial<ICategory>): Promise<ICategory>;
    editCategory(id: string, data: Partial<ICategory>): Promise<ICategory>;
    listCategory(id: string): Promise<void>;
    unlistCategory(id: string): Promise<void>;
};