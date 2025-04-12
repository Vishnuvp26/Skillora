import { IEscrow } from "../../../models/admin/escrowModel";

export interface IEscrowService {
    getTotalAmountInEscrow(): Promise<number>
    getTotalPlatformRevenue(): Promise<number>;
    releaseToFreelancer(contractId: string): Promise<IEscrow>;
    refundToClient(contractId: string, clientId: string, cancelReason?: string, cancelReasonDescription?: string): Promise<IEscrow>
    processFreelancerPaymentRequest(contractId: string, freelancerId: string): Promise<IEscrow>;
    getAdminTransactions(): Promise<IEscrow[]>;
    getMonthlySalesReport(): Promise<any[]>;
};