import { Iuser } from "../../../models/user/userModel";

export interface IAdminService {
    getClients(): Promise<Iuser[]>;
    getFreelancers(): Promise<Iuser[]>;
    blockFreelancer(freelancerId: string): Promise<Iuser | null>;
    blockClient(clientId: string): Promise<Iuser | null>;
    unblockFreelancer(freelancerId: string): Promise<Iuser | null>;
    unblockClient(clientId: string): Promise<Iuser | null>;
};