import express from 'express'
import profileRoutes from '../../routes/freelancer/profileRoutes'
import jobApplicationRoutes from '../freelancer/appliedRoutes'

const router = express.Router()

router.use('/profile', profileRoutes)
router.use('/jobs', jobApplicationRoutes)

export default router