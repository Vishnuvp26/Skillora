import express from 'express'
import profileRoutes from './profileRoute'
import jobRoutes from './jobRoutes'

const router = express.Router()

router.use('/profile', profileRoutes)
router.use('/job', jobRoutes)

export default router;