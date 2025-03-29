import { Router } from 'express';
import { AuthController } from '../../modules/auth/controller/auth.controller';
import { AuthService } from '../../modules/auth/services/auth.service';

const authService = new AuthService();
const authController = new AuthController(authService);

const router = Router();

router.post('/register', authController.loginOrRegister.bind(authController));

router.post('/request-otp', authController.requestOtp.bind(authController));

router.post('/verify-otp', authController.verifyOtp.bind(authController));

export default router;
