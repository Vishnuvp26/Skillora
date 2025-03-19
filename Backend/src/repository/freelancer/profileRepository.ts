import mongoose from "mongoose";
import { IProfileRepository } from "../../interfaces/freelancer/profile/IProfileRepository";
import Freelancer, { IFreelancer } from "../../models/freelancer/freelancerModel";
import { BaseRepository } from "../../repository/base/baseRepository";
import { Messages } from "../../constants/messageConstants";

export class ProfileRepository extends BaseRepository<IFreelancer> implements IProfileRepository {
    constructor() {
        super(Freelancer)
    }

    async create(data: Partial<IFreelancer>): Promise<IFreelancer> {
        return await this.model.create(data);
    };
    
    async findByUserId(userId: string): Promise<IFreelancer | null> {
        try {
            return await this.model.findOne({ userId: new mongoose.Types.ObjectId(userId) })
                .populate("skills", "name")
                .populate("jobCategory", "name");
        } catch (error) {
            throw new Error(Messages.ERROR_FETCHING_PROFILE);
        }
    };

    async updateProfile(userId: string, profileData: Partial<IFreelancer>): Promise<IFreelancer | null> {
        try {
            console.log('INSIDE REPOOO :', profileData)
            const existingProfile = await this.model.findOne({ userId });
    
            const updatedSkills = profileData.skills
                ? profileData.skills.map((skill) => skill._id.toString())
                : existingProfile?.skills.map((skill) => skill.toString()) || [];
    
            const updatedLanguages = profileData.language || [];
    
            const updateFields = {
                title: profileData.title,
                firstName: profileData.firstName,
                bio: profileData.bio,
                city: profileData.city,
                experienceLevel: profileData.experienceLevel,
                jobCategory: profileData.jobCategory,
                skills: updatedSkills,
                language: updatedLanguages,
                education: profileData.education,
                employmentHistory: profileData.employmentHistory,
                linkedAccounts: profileData.linkedAccounts,
                profilePic: profileData.profilePic || existingProfile?.profilePic,
                profileCompleted: true,
            };
    
            return await this.model
                .findOneAndUpdate({ userId }, { $set: updateFields }, { new: true, upsert: true })
                .populate("skills", "name")
                .populate("jobCategory", "name");
        } catch (error) {
            throw new Error(Messages.ERROR_UPDATING_PROFILE);
        }
    };
}