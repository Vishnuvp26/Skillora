import { IClient } from "../../../models/client/clientModel";

export interface IProfileService {
    getProfile(userId: string): Promise<IClient | null>;
    updateProfile(userId: string, profileData: Partial<IClient>): Promise<IClient | null>
}