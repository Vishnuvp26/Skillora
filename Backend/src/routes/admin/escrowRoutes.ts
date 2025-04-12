import express from 'express';
import { EscrowRepository } from '../../repository/admin/escrowRepository';
import { ContractRepository } from '../../repository/client/contractRepository';
import { WalletRepository } from '../../repository/admin/walletRepository';
import { EscrowController } from '../../controllers/admin/escrowController';
import { EscrowService } from '../../services/admin/escrowService';
import { authenticateToken, authorizeRoles } from '../../middlewares/authMiddleware';

const router = express.Router();

const escrowRepository = new EscrowRepository()
const contractRepository = new ContractRepository()
const walletRepository = new WalletRepository()
const escrowService = new EscrowService(escrowRepository, contractRepository, walletRepository);
const escrowController = new EscrowController(escrowService)

router.get(
    "/total-revenue",
    authenticateToken,
    authorizeRoles('admin'),
    escrowController.getTotalRevenue.bind(escrowController)
);

router.get(
    "/balance",
    authenticateToken, 
    authorizeRoles('admin'), 
    escrowController.getTotalEscrowBalance.bind(escrowController)
);

router.put(
    "/release-fund/:contractId",
    authenticateToken, 
    authorizeRoles('admin'), 
    escrowController.releaseFundsToFreelancer.bind(escrowController)
);

router.put(
    "/refund-client/:contractId/:clientId",
    authenticateToken,
    authorizeRoles('admin'),
    escrowController.refundToClient.bind(escrowController)
);

router.get(
    "/transactions",
    escrowController.getAdminTransactions.bind(escrowController)
);

export default router;