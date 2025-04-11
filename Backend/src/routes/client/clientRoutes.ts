import express from 'express'
import profileRoutes from './profileRoute'
import jobRoutes from './jobRoutes'
import applicantsRoute from './applicantsRoutes'
import contractRoutes from './contractRoutes';
import reviewRoutes from './reviewRoutes';

const router = express.Router()

router.use('/profile', profileRoutes)
router.use('/job', jobRoutes)
router.use('/job/applicants', applicantsRoute)
router.use('/contract/', contractRoutes);
router.use('/review/', reviewRoutes);

export default router;