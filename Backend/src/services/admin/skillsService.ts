import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants";
import { ISKillsRepository } from "../../interfaces/admin/skills/ISkillsRepository";
import { ISkillsService } from "../../interfaces/admin/skills/ISkillsService";
import { ISkills } from "../../models/admin/skillsModel";
import { createHttpError } from "../../utils/httpError";

export class SkillsService implements ISkillsService {
    constructor(private skillsRepository: ISKillsRepository) { }
    
    async getSkills(): Promise<ISkills[]> {
        return await this.skillsRepository.findAll()
    };

    // async addSkills(data: Partial<ISkills>): Promise<ISkills> {
    //     const skillsName = data.name!.trim()

    //     const existingSkills = await this.skillsRepository.findByName(skillsName.toLocaleLowerCase())
    //     if (existingSkills) {
    //         throw createHttpError(HttpStatus.CONFLICT, Messages.SKILLS_EXIST)
    //     }
    //     return await this.skillsRepository.create({...data, name: skillsName})
    // };

    async addSkills(data: Partial<ISkills>): Promise<ISkills> {
        const skillsName = data.name!.trim();
    
        const existingSkills = await this.skillsRepository.findByName(skillsName.toLowerCase());
        if (existingSkills) {
            throw createHttpError(HttpStatus.CONFLICT, Messages.SKILLS_EXIST);
        }
        return await this.skillsRepository.create({ ...data, name: skillsName });
    };

    async editSkills(id: string, data: Partial<ISkills>): Promise<ISkills> {
        if (data.name) {
            const skillsName = data.name.trim()
            
            const existingSkills = await this.skillsRepository.findByName(skillsName.toLowerCase())
            if (existingSkills && existingSkills.id !== id) {
                throw createHttpError(HttpStatus.CONFLICT, Messages.SKILLS_EXIST)
            }
            data.name = skillsName
        }
        const updatedSkils = await this.skillsRepository.findByIdAndUpdate(id, data)
        if (!updatedSkils) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.SKILLS_NOT_FOUND)
        }
        return updatedSkils
    };

    async listSkills(id: string): Promise<void> {
        const skills = await this.skillsRepository.findByIdAndUpdate(id, { isListed: true })
        if (!skills) {
            createHttpError(HttpStatus.NOT_FOUND, Messages.SKILLS_NOT_FOUND)
        }
    };

    async unlistSkills(id: string): Promise<void>{
        const skills = await this.skillsRepository.findByIdAndUpdate(id, { isListed: false })
        if (!skills) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.SKILLS_NOT_FOUND)
        }
    };
};