import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validate } from '../middleware/validate.middleware';
import { authRateLimit } from '../middleware/rateLimit.middleware';
import { signupSchema, loginSchema } from '../validators/auth.schema';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/signup', authRateLimit, validate(signupSchema), asyncHandler(authController.signup));
router.post('/login', authRateLimit, validate(loginSchema), asyncHandler(authController.login));
router.post('/refresh', asyncHandler(authController.refresh));
router.post('/logout', authController.logout);

export default router;
