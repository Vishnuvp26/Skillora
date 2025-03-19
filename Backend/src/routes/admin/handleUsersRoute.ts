import express from 'express';
import { authenticateToken, authorizeRoles } from '../../middlewares/authMiddleware';
import { AdminController } from '../../controllers/admin/adminControllers';
import { AdminRepository } from '../../repository/admin/adminRepository';
import { AdminService } from '../../services/admin/adminService';

const router = express.Router();

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

router.get(
    '/get-clients',
    authenticateToken,
    authorizeRoles('admin'),
    adminController.getClients.bind(adminController)
);

router.get(
    '/get-freelancers',
    authenticateToken,
    authorizeRoles('admin'),
    adminController.getFreelancers.bind(adminController)
);

router.put(
    '/block-freelancer/:freelancerId',
    authenticateToken,
    authorizeRoles('admin'),
    adminController.blockFreelancer.bind(adminController)
);

router.put(
    '/unblock-freelancer/:freelancerId',
    authenticateToken,
    authorizeRoles('admin'),
    adminController.unblockFreelancer.bind(adminController)
);

router.put(
    '/block-client/:clientId',
    authenticateToken,
    authorizeRoles('admin'),
    adminController.blockClient.bind(adminController)
);

router.put(
    '/unblock-client/:clientId',
    authenticateToken,
    authorizeRoles('admin'),
    adminController.unblockClient.bind(adminController)
);

export default router;