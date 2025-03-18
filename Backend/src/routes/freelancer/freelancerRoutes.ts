import express from 'express'
import profileRoutes from '../../routes/freelancer/profileRoutes'

const router = express.Router()

router.use('/profile', profileRoutes)

export default router