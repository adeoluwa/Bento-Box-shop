import prisma from '../../../core/utils/prisma';
import { generateExpiry } from '../../../core/utils/authUtils';

export class SessionRepository {
  async createSession(email: string, token: string, userId: string) {
    return await prisma.session.upsert({
      where: { user_id: userId },
      update: { token, expires_at: generateExpiry() },
      create: { user_id: userId, email, token, expires_at: generateExpiry() },
    });
  }

  async findSessionByUserId(userId: string) {
    return await prisma.session.findUnique({ where: { user_id: userId } });
  }

  async updateSession(userId: string, token: string, expires_at: Date) {
    return await prisma.session.update({
      where: { user_id: userId },
      data: {
        token,
        expires_at,
      },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await prisma.session.delete({
      where: { user_id: userId },
    });
  }
}
