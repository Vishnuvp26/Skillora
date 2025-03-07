import { ICategoryRepository } from "../interfaces/admin/category/ICategoryRepository";
import Skills, { ISkills } from "../models/admin/skillsModel";
import { BaseRepository } from "./baseRepository";

export class SkillsRepository extends BaseRepository<ISkills> implements ICategoryRepository {
    constructor() {
        super(Skills);
    }

    async findByName(name: string): Promise<ISkills | null> {
        return await this.findOne({ name })
    }
};