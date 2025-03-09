import { IAdminRepository } from "../../interfaces/admin/handleUsers/IAdminRepository";
import { IAdminService } from "../../interfaces/admin/handleUsers/IAdminService";
import { Iuser } from "../../models/user/userModel";

export class AdminService implements IAdminService {
    constructor(private _adminRepository: IAdminRepository){}

    async getClients(): Promise<Iuser[]> {
        return await this._adminRepository.getAllClients();
    };

    async getFreelancers(): Promise<Iuser[]> {
        return await this._adminRepository.getAllFreelancers()
    };

    async blockFreelancer(freelancerId: string): Promise<Iuser | null> {
        return await this._adminRepository.blockFreelancer(freelancerId);
    };
    
    async blockClient(clientId: string): Promise<Iuser | null> {
        return await this._adminRepository.blockClient(clientId);
    };

    async unblockFreelancer(freelancerId: string): Promise<Iuser | null> {
        return await this._adminRepository.unblockFreelancer(freelancerId)
    };

    async unblockClient(clientId: string): Promise<Iuser | null> {
        return await this._adminRepository.unblockClient(clientId)
    };
}