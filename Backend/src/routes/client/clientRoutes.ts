import express from 'express'
import profileRoutes from './profileRoute'

const router = express.Router()

router.use('/profile', profileRoutes)

export default router;