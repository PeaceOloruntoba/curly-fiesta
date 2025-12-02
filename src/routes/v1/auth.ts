import { Router } from 'express';
import { authLimiter, otpLimiter } from '../../middlewares/rateLimit.js';
import { requireAuth } from '../../middlewares/auth.js';
import * as ctrl from '../../controllers/authController.js';

const router = Router();

router.post('/register', authLimiter, ctrl.register);

router.post('/verify-otp', otpLimiter, ctrl.verifyOtp);

router.post('/resend-otp', otpLimiter, ctrl.resendOtp);

router.post('/login', authLimiter, ctrl.login);

router.post('/refresh', authLimiter, ctrl.refresh);

router.post('/logout', ctrl.logout);

router.post('/logout-all', requireAuth, ctrl.logoutAll);

router.post('/forgot-password', ctrl.forgotPassword);

router.post('/reset-password', ctrl.resetPassword);

export default router;
