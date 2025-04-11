import express from 'express';
import { WalletRepository } from '../../repository/admin/walletRepository';
import { WalletService } from '../../services/admin/walletService';
import { WalletController } from '../../controllers/admin/walletController';

const router = express.Router();

const walletRepository = new WalletRepository();
const walletService = new WalletService(walletRepository);
const walletController = new WalletController(walletService);

router.get(
    "/earnings/:userId",
    walletController.getWallet.bind(walletController)
);

router.get(
    "/transactions/:walletId",
    walletController.getUserTransactions.bind(walletController)
);

export default router;