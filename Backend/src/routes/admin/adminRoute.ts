import express from 'express'
import categoryRoutes from '../../routes/admin/categoryRoutes'
import skillsRoutes from '../../routes/admin/skillsRoutes'
import adminUsersRoutes from '../../routes/admin/handleUsersRoute'
import escrowRoutes from '../../routes/admin/escrowRoutes';

const router = express.Router()

router.use('/categories', categoryRoutes);
router.use('/skills', skillsRoutes);
router.use('/users', adminUsersRoutes);
router.use('/escrow', escrowRoutes);

export default router