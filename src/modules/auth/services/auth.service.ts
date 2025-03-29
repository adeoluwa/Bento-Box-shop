import { AuthRepository } from '../repository/auth.repository';
import { SessionRepository } from '../repository/session';
import {
  hashPassword,
  verifyPassword,
  generateToken,
} from '../../../core/utils/authUtils';

import {
  AuthResponse,
  LoginOrCreateUserInput,
  OtpInput,
  verifyTokenInput,
} from '../dto';
import isEmail from 'validator/lib/isEmail';
import { logger } from '../../../core/utils/logger';
import {
  InvalidCredentialsError,
  UserNotFoundError,
  AuthorizationError,
} from '../../../shared/errors/auth.error';
import { User } from '@prisma/client';

enum AuthType {
  LOGIN = 'login',
  REGISTER = 'register',
}
export class AuthService {
  constructor(
    private authRepository: AuthRepository = new AuthRepository(),
    private sessionRepository: SessionRepository = new SessionRepository(),
  ) {}

  async loginOrRegister(data: LoginOrCreateUserInput): Promise<AuthResponse> {
    this.validateEmail(data.email);

    const existingUser = await this.authRepository.findUserByEmail(data.email);

    return existingUser
      ? this.handleExistingUser(existingUser, data.password)
      : this.handleNewUser(data.email, data.password);
  }

  // OTP Handling
  async requestOtp(data: OtpInput): Promise<{ success: boolean }> {
    this.validateEmail(data.email);

    const user = await this.authRepository.findUserByEmail(data.email);
    if (!user) throw new UserNotFoundError('User account does not exist');

    const otp = this.generateOtpCode();
    await this.authRepository.createOrUpdateOtp(user.id, otp, user.email);

    this.sendOtpToUser(user.email, otp);

    return { success: true };
  }

  async verifyOtp(data: verifyTokenInput): Promise<AuthResponse> {
    const { email, code } = data;

    try {
      const { userId } = await this.authRepository.validateOtp(email, code);

      const user = await this.authRepository.markUserAsVerified(userId);

      const token = generateToken({ userId });
      await this.sessionRepository.createSession(email, token, userId);

      await this.authRepository.deleteOtp(userId);

      return this.buildAuthResponse({
        token,
        user,
        authType: AuthType.LOGIN,
      });
    } catch (error) {
      throw error;
    }
  }

  private async handleExistingUser(user: User, password: string) {
    if (!user.is_verified) {
      await this.requestOtp({ email: user.email });
      throw new AuthorizationError('Please verify your email first. OTP resent');
    }

    const isvalid = await verifyPassword(password, user.password);
    if (!isvalid) throw new InvalidCredentialsError('Incorrect credentials');

    const token = generateToken({ userId: user.id });
    await this.sessionRepository.createSession(user.email, token, user.id);

    return this.buildAuthResponse({
      token,
      user,
      authType: AuthType.LOGIN,
    });
  }

  private async handleNewUser(email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const newUser = await this.authRepository.createUser(email, hashedPassword);

    await this.requestOtp({ email });

    return this.buildAuthResponse({
      token: null,
      user: newUser,
      authType: AuthType.REGISTER,
      requiresVerification: true,
    });
  }

  private validateEmail(email: string) {
    if (!isEmail(email)) throw new Error('Please use a valid email');
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private buildAuthResponse(params: {
    token: string | null;
    user: User;
    authType: AuthType;
    requiresVerification?: boolean;
  }): AuthResponse {
    return {
      token: params.token ?? undefined,
      user: {
        email: params.user.email,
        first_name: params.user.first_name ?? '',
        last_name: params.user.last_name ?? '',
      },
      authType: params.authType,
      ...(params.requiresVerification && { requiresVerification: true }),
    };
  }

  private sendOtpToUser(email: string, otp: string) {
    // TODO: Impliment email/sms service
    logger.info(`OTP for ${email}: ${otp}`);
  }
}
