import { IProfileRepository } from "../../interfaces/freelancer/profile/IProfileRepository";
import { IProfileService } from "../../interfaces/freelancer/profile/IProfileService";
import { IFreelancer } from "../../models/freelancer/freelancerModel";

export class ProfileService implements IProfileService {
    constructor(private _profileRepository: IProfileRepository) { }
    
    async getProfile(userId: string): Promise<IFreelancer | null> {
        return await this._profileRepository.findByUserId(userId);
    }    

    // async addProfile(userId: string, profileData: Partial<IFreelancer>): Promise<IFreelancer | null> {
    //     if (!userId) {
    //         throw new Error("User ID is required");
    //     }
    
    //     if (!profileData || Object.keys(profileData).length === 0) {
    //         throw new Error("Profile data cannot be empty");
    //     }
    
    //     const profile = await this._profileRepository.addProfile(userId, profileData);
    //     if (!profile) {
    //         throw new Error("Failed to create profile");
    //     }
    
    //     return profile;
    // }

    async updateProfile(userId: string, profileData: Partial<IFreelancer>): Promise<IFreelancer | null> {
        if (!userId) throw new Error("User ID is required");
        // if (!profileData || Object.keys(profileData).length === 0) throw new Error("Profile data cannot be empty");
        return await this._profileRepository.updateProfile(userId, profileData);
    }
}