import { IFreelancer } from "../../../models/freelancer/freelancerModel";

export interface IProfileService {
    getProfile(userId: string): Promise<IFreelancer | null>
    // addProfile(userId: string, profileData: Partial<IFreelancer>): Promise<IFreelancer | null>;
    updateProfile(userId: string, profileData: Partial<IFreelancer>): Promise<IFreelancer | null>;
};