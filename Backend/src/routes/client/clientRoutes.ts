import express from 'express'
import profileRoutes from './profileRoute'
import jobRoutes from './jobRoutes'
import applicantsRoute from './applicantsRoutes'

const router = express.Router()

router.use('/profile', profileRoutes)
router.use('/job', jobRoutes)
router.use('/job/applicants', applicantsRoute)

export default router;