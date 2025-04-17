import express from 'express';
import { WalletRepository } from '../../repository/admin/walletRepository';
import { WalletService } from '../../services/admin/walletService';
import { WalletController } from '../../controllers/admin/walletController';
import { authenticateToken, authorizeRoles } from '../../middlewares/authMiddleware';

const router = express.Router();

const walletRepository = new WalletRepository();
const walletService = new WalletService(walletRepository);
const walletController = new WalletController(walletService);

router.get(
    "/earnings/:userId",
    authenticateToken,
    authorizeRoles('freelancer', 'client'),
    walletController.getWallet.bind(walletController)
);

router.get(
    "/transactions/:walletId",
    authenticateToken,
    authorizeRoles('freelancer', 'client'),
    walletController.getUserTransactions.bind(walletController)
);

router.get(
    "/user-sales-report/:userId",
    walletController.userSalesReport.bind(walletController)
)

export default router;