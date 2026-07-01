import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createBudgetSchema,
  updateBudgetSchema,
  budgetIdSchema,
} from '../validators/budgets.schema';
import * as budgetController from '../controllers/budgets.controller';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(budgetController.list));
router.post('/', validate(createBudgetSchema), asyncHandler(budgetController.create));
router.get('/:id', validate(budgetIdSchema), asyncHandler(budgetController.getOne));
router.patch('/:id', validate(updateBudgetSchema), asyncHandler(budgetController.update));
router.delete('/:id', validate(budgetIdSchema), asyncHandler(budgetController.remove));

export default router;
