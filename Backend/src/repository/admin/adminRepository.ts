import { IAdminRepository } from "../../interfaces/admin/handleUsers/IAdminRepository";
import User, { Iuser } from "../../models/user/userModel";
import { BaseRepository } from "../../repository/base/baseRepository";

export class AdminRepository extends BaseRepository<Iuser> implements IAdminRepository {
    constructor() {
        super(User);
    }

    async getAllClients(): Promise<Iuser[]> {
        return await this.find({ role: "client" });
    };

    async getAllFreelancers(): Promise<Iuser[]> {
        return await this.find({ role: "freelancer" });
    };

    async blockFreelancer(freelancerId: string): Promise<Iuser | null> {
        return await this.findByIdAndUpdate(freelancerId, { status: "blocked" } as Partial<Iuser>);
    };
    
    async blockClient(clientId: string): Promise<Iuser | null> {
        return await this.findByIdAndUpdate(clientId, { status: "blocked" } as Partial<Iuser>);
    };

    async unblockFreelancer(freelancerId: string): Promise<Iuser | null> {
        return await this.findByIdAndUpdate(freelancerId, { status: "active" }, { new: true });
    }
    
    async unblockClient(clientId: string): Promise<Iuser | null> {
        return await this.findByIdAndUpdate(clientId, { status: "active" }, { new: true });
    }
}