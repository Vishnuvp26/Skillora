import express from 'express';
import { ContractRepository } from '../../repository/client/contractRepository';
import { JobRepository } from '../../repository/client/jobRepository';
import { ApplicationRepository } from '../../repository/client/applicationRepository';
import { ContractService } from '../../services/client/contractService';
import { ContractController } from '../../controllers/client/contractController';
import { authenticateToken, authorizeRoles } from '../../middlewares/authMiddleware';

const router = express.Router();

const contractRepository = new ContractRepository();
const jobRepository = new JobRepository();
const applicationRepository = new ApplicationRepository()
const contractService = new ContractService(contractRepository, jobRepository, applicationRepository);
const contractController = new ContractController(contractService);

router.post(
    "/create-contract/:jobId/:clientId",
    authenticateToken,
    authorizeRoles('client'),
    contractController.createContract.bind(contractController)
);

router.delete(
    "/cancel-contract/:contractId",
    authenticateToken,
    authorizeRoles('client', 'freelancer'),
    contractController.cancelContract.bind(contractController)
);

router.get(
    "/is-created/:jobId/:clientId",
    contractController.isContractExist.bind(contractController)
);

router.get(
    "/get-contracts/:clientId",
    contractController.getClientContracts.bind(contractController)
);

router.get(
    "/all-contracts",
    contractController.getAllContractsForAdmin.bind(contractController)
);

router.patch(
    "/release-fund/:contractId",
    authenticateToken,
    authorizeRoles('client'),
    contractController.requestFundRelease.bind(contractController)
);

export default router;