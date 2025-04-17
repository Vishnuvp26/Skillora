import { IClient } from "../../../models/client/clientModel";

export interface IProfileRepositoryClient {
    create(data: Partial<IClient>): Promise<IClient>;
    findByUserId(userId: string): Promise<IClient | null>;
    updateProfile(userId: string, profileData: Partial<IClient>): Promise<IClient | null>
    findByUserId(userId: string): Promise<IClient | null> 
}