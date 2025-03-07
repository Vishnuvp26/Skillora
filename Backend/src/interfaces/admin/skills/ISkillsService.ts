import { ISkills } from "../../../models/admin/skillsModel";

export interface ISkillsService {
    getSkills(): Promise<ISkills[]>
    addSkills(data: Partial<ISkills>): Promise<ISkills>
    editSkills(id: string, data: Partial<ISkills>): Promise<ISkills>
    listSkills(id: string): Promise<void>
    unlistSkills(id: string): Promise<void>
};