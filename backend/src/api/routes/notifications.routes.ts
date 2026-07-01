import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../middleware/auth.middleware';
import * as notifController from '../controllers/notifications.controller';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(notifController.list));
router.patch('/:id/read', asyncHandler(notifController.markRead));
router.patch('/read-all', asyncHandler(notifController.markAllRead));

export default router;
