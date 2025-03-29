import prisma from '../../../core/utils/prisma';
import { Otp, User } from '@prisma/client';
import {
  InvalidOtpError,
  OtpExpiredError,
  UserNotFoundError,
} from '../../../shared/errors/auth.error';

export class AuthRepository {
  private readonly OTP_EXPIRY_MINUTES = 20;

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: { Otp: true },
    });
  }

  async createUser(email: string, password: string) {
    return await prisma.user.create({
      data: { email, password, is_verified: false },
    });
  }

  async markUserAsVerified(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        is_verified: true,
        verified_at: new Date(),
      },
    });
  }

  // OTP Operations

  async createOrUpdateOtp(userId: string, code: string, email: string) {
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.otp.deleteMany({
      where: { user_id: userId },
    });

    return prisma.otp.create({
      data: {
        user_id: userId,
        email,
        code,
        expires_at: expiresAt,
      },
    });
  }

  async getOtpByUserId(userId: string) {
    return await prisma.otp.findUnique({
      where: { user_id: userId },
    });
  }

  async getOtpByEmail(email: string) {
    const otp = await prisma.otp.findFirst({
      where: { email },
      select: { user_id: true, expires_at: true, code: true },
    });

    if (!otp) throw new Error('OTP not found for this email');

    return await prisma.otp.findUnique({
      where: { user_id: otp.user_id },
    });
  }

  async deleteOtp(userId: string) {
    await this.deleteExpiredOtps();

    return await prisma.otp.deleteMany({
      where: { user_id: userId },
    });
  }

  async getValidateOtpByEmail(email: string): Promise<Otp> {
    const otp = await prisma.otp.findFirst({
      where: {
        email,
        expires_at: { gt: new Date() },
      },
      orderBy: { created_at: 'desc' },
    });

    if (!otp) {
      await this.deleteExpiredOtps();
      throw new UserNotFoundError('OTP expired or invalid. Please request a new one.');
    }

    return otp;
  }

  async deleteExpiredOtps(): Promise<void> {
    await prisma.otp.deleteMany({
      where: { expires_at: { lt: new Date() } },
    });
  }

  async validateOtp(email: string, code: string) {
    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
        code,
        expires_at: { gt: new Date() },
      },
    });

    console.log('Fetched OTP Record:', otpRecord);
    console.log(`Current Time: ${new Date()}, OTP Expiry: ${otpRecord?.expires_at}`);

    if (!otpRecord) {
      throw new OtpExpiredError('OTP expired or invalid');
    }

    if (otpRecord.code !== code) {
      throw new InvalidOtpError('Invalid OTP code');
    }

    return { userId: otpRecord.user_id, email: otpRecord.email };
  }
}
