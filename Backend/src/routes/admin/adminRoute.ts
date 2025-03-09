import express from 'express'
import categoryRoutes from '../../routes/admin/categoryRoutes'
import skillsRoutes from '../../routes/admin/skillsRoutes'
import adminUsersRoutes from '../../routes/admin/handleUsersRoute'

const router = express.Router()

router.use('/categories', categoryRoutes);
router.use('/skills', skillsRoutes);
router.use('/users', adminUsersRoutes)

export default router