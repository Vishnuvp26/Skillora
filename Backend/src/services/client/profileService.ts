import { Messages } from "../../constants/messageConstants";
import { IProfileRepositoryClient } from "../../interfaces/client/profile/IProfileRepository";
import { IProfileService } from "../../interfaces/client/profile/IProfileService";
import { IClient } from "../../models/client/clientModel";

export class ProfileService implements IProfileService {
    constructor(private _profileRepository: IProfileRepositoryClient) { }
    
    async getProfile(userId: string): Promise<IClient | null> {
        return await this._profileRepository.findByUserId(userId)
    }

    async updateProfile(userId: string, profileData: Partial<IClient>): Promise<IClient | null> {
        if (!userId) {
            throw new Error(Messages.ID_REQUIRED);
        }
        return await this._profileRepository.updateProfile(userId, profileData)
    }
};