import express from 'express'
import profileRoutes from '../../routes/freelancer/profileRoutes'
import jobApplicationRoutes from '../freelancer/appliedRoutes'
import contractRoutes from './contractRoutes';
import walletRoutes from './walletRoutes';

const router = express.Router()

router.use('/profile', profileRoutes);
router.use('/jobs', jobApplicationRoutes);
router.use('/contract', contractRoutes);
router.use('/wallet', walletRoutes);

export default router