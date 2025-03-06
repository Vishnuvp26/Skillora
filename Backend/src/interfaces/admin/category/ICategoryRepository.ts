import { ICategory } from "../../../models/admin/categoryModel";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface ICategoryRepository extends IBaseRepository<ICategory> {
    findByName(name: string): Promise<ICategory | null>;
}