import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  register,
  registerValidation,
  login,
  loginValidation,
  googleAuth,
  forgotPassword,
  forgotPasswordValidation,
  getMe,
} from '../controllers/authController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/register', registerValidation, asyncHandler(register));
router.post('/login', loginValidation, asyncHandler(login));
router.post('/google', asyncHandler(googleAuth));
router.post('/forgot-password', forgotPasswordValidation, asyncHandler(forgotPassword));
router.get('/me', authenticate, asyncHandler(getMe));

export default router;
