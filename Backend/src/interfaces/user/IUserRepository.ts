import { Iuser } from "../../models/user/userModel";

export interface IUserRepository {
    create(user: Iuser): Promise<Iuser>;
    findByEmail(email: string): Promise<Iuser | null>;
}