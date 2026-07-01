import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionIdSchema,
  listTransactionsSchema,
} from '../validators/transactions.schema';
import * as txController from '../controllers/transactions.controller';

const router = Router();

router.use(requireAuth);

router.get('/', validate(listTransactionsSchema), asyncHandler(txController.list));
router.post('/', validate(createTransactionSchema), asyncHandler(txController.create));
router.get('/:id', validate(transactionIdSchema), asyncHandler(txController.getOne));
router.patch('/:id', validate(updateTransactionSchema), asyncHandler(txController.update));
router.delete('/:id', validate(transactionIdSchema), asyncHandler(txController.remove));

export default router;
