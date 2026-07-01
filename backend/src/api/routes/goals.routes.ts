import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createGoalSchema,
  updateGoalSchema,
  goalIdSchema,
} from '../validators/goals.schema';
import * as goalController from '../controllers/goals.controller';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(goalController.list));
router.post('/', validate(createGoalSchema), asyncHandler(goalController.create));
router.get('/:id', validate(goalIdSchema), asyncHandler(goalController.getOne));
router.patch('/:id', validate(updateGoalSchema), asyncHandler(goalController.update));
router.delete('/:id', validate(goalIdSchema), asyncHandler(goalController.remove));

export default router;
