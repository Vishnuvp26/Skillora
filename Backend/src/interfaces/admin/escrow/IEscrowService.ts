import { IEscrow } from "../../../models/admin/escrowModel";

export interface IEscrowService {
    // createEscrow(escrowData: Partial<IEscrow>): Promise<IEscrow>;
    // getAllTransactions(filter?: object): Promise<IEscrow[]>;
    getTotalAmountInEscrow(): Promise<number>
    getTotalPlatformRevenue(): Promise<number>;
    releaseToFreelancer(contractId: string): Promise<IEscrow>;
    refundToClient(contractId: string, clientId: string, cancelReason?: string, cancelReasonDescription?: string): Promise<IEscrow>
    processFreelancerPaymentRequest(contractId: string, freelancerId: string): Promise<IEscrow>;
};