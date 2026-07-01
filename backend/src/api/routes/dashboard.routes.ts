import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../middleware/auth.middleware';
import * as dashboardController from '../controllers/dashboard.controller';

const router = Router();

router.use(requireAuth);

router.get('/summary', asyncHandler(dashboardController.summary));
router.get('/spending-by-category', asyncHandler(dashboardController.spendingByCategory));

export default router;
