import { IFreelancer } from "../../../models/freelancer/freelancerModel";

export interface IProfileRepository {
    create(data: Partial<IFreelancer>): Promise<IFreelancer>;
    findByUserId(userId: string): Promise<IFreelancer | null>;
    // addProfile(userId: string, profileData: Partial<IFreelancer> & { jobCategoryId?: string }): Promise<IFreelancer | null>;
    updateProfile(userId: string, profileData: Partial<IFreelancer> & { jobCategoryId?: string }): Promise<IFreelancer | null>;
}