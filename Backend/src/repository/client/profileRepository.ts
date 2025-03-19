import mongoose from "mongoose";
import { IProfileRepositoryClient } from "../../interfaces/client/profile/IProfileRepository";
import Client, { IClient } from "../../models/client/clientModel";
import { BaseRepository } from "../base/baseRepository";
import { Messages } from "../../constants/messageConstants";

export class CProfileRepository extends BaseRepository<IClient> implements IProfileRepositoryClient {
    constructor() {
        super(Client)
    }

    async create(data: Partial<IClient>): Promise<IClient> {
        return await this.model.create(data)
    };

    async findByUserId(userId: string): Promise<IClient | null> {
        try {
            return await this.model.findOne({userId: new mongoose.Types.ObjectId(userId)})
        } catch (error) {
            throw new Error(Messages.ERROR_FETCHING_PROFILE)
        }
    };

    async updateProfile(userId: string, profileData: Partial<IClient>): Promise<IClient | null> {
        try {
            const existingProfile = await this.model.findOne({ userId });

            const updatedFeilds = {
                firstName: profileData.firstName,
                city: profileData.city,
                state: profileData.state,
                profilePic: profileData.profilePic || existingProfile?.profilePic,
                profileCompleted: true
            }

            return await this.model.findOneAndUpdate({ userId }, { $set: updatedFeilds }, { new: true, upsert: true })
        } catch (error) {
            throw new Error(Messages.ERROR_UPDATING_PROFILE)
        }
    };
};