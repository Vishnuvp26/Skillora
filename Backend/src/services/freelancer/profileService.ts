import { IProfileRepository } from "../../interfaces/freelancer/profile/IProfileRepository";
import { IProfileService } from "../../interfaces/freelancer/profile/IProfileService";
import { IFreelancer } from "../../models/freelancer/freelancerModel";

export class ProfileService implements IProfileService {
    constructor(private _profileRepository: IProfileRepository) { }
    
    async getProfile(userId: string): Promise<IFreelancer | null> {
        return await this._profileRepository.findByUserId(userId);
    };

    async updateProfile(userId: string, profileData: Partial<IFreelancer>): Promise<IFreelancer | null> {
        if (!userId) throw new Error("User ID is required");
        return await this._profileRepository.updateProfile(userId, profileData);
    };
}