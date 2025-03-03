import { IUserRepository } from "../interfaces/user/IUserRepository";
import { Iuser, User } from "../models/user/userModel";
import { BaseRepository } from "./baseRepository";

export class UserRepository extends BaseRepository<Iuser> implements IUserRepository {
    constructor() {
        super(User)
    }

    async findByEmail(email: string): Promise<Iuser | null> {
        return await this.findOne({email})
    }
}