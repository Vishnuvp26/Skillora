import express from 'express'
import categoryRoutes from '../../routes/admin/categoryRoutes'
import skillsRoutes from '../../routes/admin/skillsRoutes'

const router = express.Router()

router.use('/categories', categoryRoutes);
router.use('/skills', skillsRoutes);

export default router