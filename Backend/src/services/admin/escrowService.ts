import mongoose from "mongoose";
import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/statusContstants";
import { IEscrowRepository } from "../../interfaces/admin/escrow/IEscrowRepository";
import { IEscrowService } from "../../interfaces/admin/escrow/IEscrowService";
import { IWalletRepository } from "../../interfaces/admin/wallet/IWalletRepository";
import { IContractRepository } from "../../interfaces/client/contract/IContractRepository";
import { IEscrow } from "../../models/admin/escrowModel";
import { createHttpError } from "../../utils/httpError";

export class EscrowService implements IEscrowService {
    constructor(
        private _escrowRepository: IEscrowRepository,
        private _contractRepository: IContractRepository,
        private _walletRepository: IWalletRepository
    ) { }

    async getTotalAmountInEscrow(): Promise<number> {
        return await this._escrowRepository.getTotalAmountInEscrow();
    }    
    
    async getTotalPlatformRevenue(): Promise<number> {
        return await this._escrowRepository.getTotalRevenue();
    };

    async releaseToFreelancer(contractId: string): Promise<IEscrow> {
        const contract = await this._contractRepository.findById(contractId);
    
        if (!contract) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.CONTRACT_NOT_FOUND);
        }
    
        const escrow = await this._escrowRepository.findOne({
            contractId: new mongoose.Types.ObjectId(contractId),
            status: "funded"
        });
    
        if (!escrow) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.ESCROW_NOT_FOUND);
        }
    
        if (contract.releaseFundStatus === "Approved") {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.ALREADY_FUNDED);
        }
    
        if (escrow.amount <= 0) {
            throw createHttpError(HttpStatus.BAD_REQUEST, "Escrow already released");
        }
    
        await this._walletRepository.addFunds(
            contract.freelancerId.toString(),
            escrow.freelancerEarning,
            "Contract payment",
            "credit"
        );
    
        await this._contractRepository.updateOne(
            { _id: contractId },
            { releaseFundStatus: "Approved" }
        );
    
        await this._escrowRepository.updateOne(
            { _id: escrow._id },
            { amount: 0,  status: "released" }
        );
    
        const updatedEscrow = await this._escrowRepository.findById(escrow._id as string);
        return updatedEscrow as IEscrow;
    };

    async refundToClient(contractId: string, clientId: string, cancelReason?: string, cancelReasonDescription?: string): Promise<IEscrow> {
        const contract = await this._contractRepository.getContractById(contractId);
        if (!contract) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.CONTRACT_NOT_FOUND);
        }

        if (contract.clientId.toString() !== clientId) {
            throw createHttpError(HttpStatus.FORBIDDEN, Messages.ACCESS_DENIED);
        }

        const escrow = await this._escrowRepository.findOne({
            contractId: new mongoose.Types.ObjectId(contractId),
            clientId: new mongoose.Types.ObjectId(clientId),
            status: "funded"
        });

        if (!escrow) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.ESCROW_NOT_FOUND);
        }

        if (escrow.status === "refunded") {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.ALREADY_REFUNDED);
        }

        let refundAmount = escrow.amount;
        let platformFeeDeduction = 0;
        let freelancerAmount = 0;

        if (contract.status === "Pending") {
            platformFeeDeduction = escrow.platformFee;
            refundAmount = escrow.amount - platformFeeDeduction;
        } else if (contract.status === "Started") {
            platformFeeDeduction = escrow.platformFee;
            freelancerAmount = escrow.freelancerEarning * 0.15; // 15% of freelancer's earnings
            refundAmount = escrow.amount - platformFeeDeduction - freelancerAmount;
        } else if (contract.status === "Ongoing") {
            platformFeeDeduction = escrow.platformFee;
            freelancerAmount = escrow.freelancerEarning * 0.4; // 40% of freelancer's earnings
            refundAmount = escrow.amount - platformFeeDeduction - freelancerAmount;
        } else if (contract.status === "Completed") {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.REFUND_NOT_ALLOWED);
        } else if (contract.status === "Canceled") {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.CONTRACT_CANCELLED);
        }

        // Process refund to client's wallet
        await this._walletRepository.addFunds(
            clientId,
            refundAmount,
            "Contract refund",
            "credit"
        );

        // If freelancer should get partial payment
        if (freelancerAmount > 0) {
            await this._walletRepository.addFunds(
                contract.freelancerId.toString(),
                freelancerAmount,
                "Partial payment for canceled contract",
                "credit"
            );
        }

        // Update escrow status
        const updatedEscrow = await this._escrowRepository.updateEscrow(
            escrow._id.toString(),
            {
                status: "refunded",
                amount: 0,
                updatedAt: new Date()
            }
        );

        await this._contractRepository.findByIdAndUpdate(contractId, {
            status: "Canceled", 
            canceledBy: "Client",
            cancelReason: cancelReason || "Requested by client",
            cancelReasonDescription: cancelReasonDescription || "",
            releaseFundStatus: "Approved"
        });

        return updatedEscrow as IEscrow
    };

    async processFreelancerPaymentRequest(contractId: string, freelancerId: string): Promise<IEscrow> {
        // Find contract and verify freelancer
        const contract = await this._contractRepository.getContractById(contractId);
        if (!contract) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.CONTRACT_NOT_FOUND);
        }

        if (contract.freelancerId.toString() !== freelancerId) {
            throw createHttpError(HttpStatus.FORBIDDEN, Messages.ACCESS_DENIED);
        }

        if (contract.status !== "Canceled") {
            throw createHttpError(HttpStatus.BAD_REQUEST, Messages.PAYMENT_REQUEST_NOT_VALID);
        }

        const escrow = await this._escrowRepository.findOne({
            contractId: new mongoose.Types.ObjectId(contractId),
            status: "funded"
        });

        if (!escrow) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.ESCROW_NOT_FOUND);
        }

        const paymentAmount = escrow.freelancerEarning * 0.5;

        // Add payment to freelancer wallet
        // await this._walletRepository.addFunds(
        //     freelancerId,
        //     paymentAmount,
        //     "Partial contract payment for canceled contract",
        //     "credit"
        // );

        const updatedEscrow = await this._escrowRepository.findByIdAndUpdate(escrow._id!.toString(), {
            status: "released",
            freelancerEarning: paymentAmount,
            updatedAt: new Date()
        });

        return updatedEscrow as IEscrow;
    };
};