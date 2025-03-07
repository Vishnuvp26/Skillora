import { ISkills } from "../../../models/admin/skillsModel";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface ISKillsRepository extends IBaseRepository<ISkills> {
    findByName(name: string): Promise<ISkills | null>;
};