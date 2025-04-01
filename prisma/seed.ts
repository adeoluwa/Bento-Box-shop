import prisma from '../src/core/utils/prisma';
import { logger } from '../src/core/utils/logger';
import { hashPassword } from '../src/core/utils/authUtils';
import { serializePhoneNumber } from '../src/core/utils/serializer';
import isEmail from 'validator/lib/isEmail';

async function main() {
  try {
    logger.info('....seeding user....');

    const user = await prisma.user.findFirst({
      where: { email: 'testUser@dev.com' },
    });

    const hashedPassword = await hashPassword('TEST_PASSWORD123');
    const serializedPhoneNumber = serializePhoneNumber('08082989696');

    if (!user) {
      const testUserData = await prisma.user.create({
        data: {
          first_name: 'Black',
          last_name: 'Shinobi',
          email: 'testUser@dev.com',
          phone_number: serializedPhoneNumber,
          password: hashedPassword,
          address: 'Aare, Bodija, Ibadan',
          is_verified: true,
          verified_at: new Date(),
        },
      });

      logger.info(testUserData, 'User Seeded');
    } else {
      logger.warn('User account already exists!');
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        'Error occured during seeding',
      );
    }

    throw error;
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
