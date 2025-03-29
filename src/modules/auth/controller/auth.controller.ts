import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginOrCreateUserInput, OtpInput, VerifyTokenInput } from '../dto';
import { logger } from '../../../core/utils/logger';
import { errorHandler } from '../../../core/middlewares/error.middleware';

export class AuthController {
  constructor(private authService: AuthService) {}

  async loginOrRegister(req: Request, res: Response) {
    try {
      const data = LoginOrCreateUserInput.parse(req.body);
      const result = await this.authService.loginOrRegister(data);

      const message =
        result.authType === 'register'
          ? 'User Registered Successfully'
          : 'User Authenticated Successfuly';

      res.status(200).json({ message, data: result });

      return;
    } catch (error) {
      logger.error(error, 'Error Authenticating user');

      res.status(500).json({ message: 'Error Authenticating user' });

      return;
    }
  }

  async requestOtp(req: Request, res: Response) {
    try {
      const data = OtpInput.parse(req.body);
      const response = await this.authService.requestOtp(data);

      res.status(200).json({ message: 'OTP sent', data: response });

      return;
    } catch (error) {
      logger.error(error, 'Error sending OTP to user');
      res.status(500).json({ message: 'Error sending OTP' });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const data = VerifyTokenInput.parse(req.body);

      const response = await this.authService.verifyOtp(data);

      res.status(200).json(response);
    } catch (error) {
      logger.error(error, 'Error verifying OTP');

      res.status(500).json({ message: 'Error verifying OTP', details: error });

      return;
    }
  }

  // TODO: complete this feature
  async passwordRest(req: Request, res: Response) {}
}
