import { Router } from 'express';
import authRoutes from './auth.routes';
import transactionRoutes from './transactions.routes';
import budgetRoutes from './budgets.routes';
import goalRoutes from './goals.routes';
import dashboardRoutes from './dashboard.routes';
import notificationRoutes from './notifications.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/goals', goalRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notifications', notificationRoutes);

export default router;
