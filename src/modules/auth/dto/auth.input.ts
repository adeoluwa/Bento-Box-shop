import { z } from 'zod';

const PasswordSchema = z.string().min(8, 'Password must be at least 8 characters long');

export const LoginOrCreateUserInput = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
  password: PasswordSchema,
});

export type LoginOrCreateUserInput = z.infer<typeof LoginOrCreateUserInput>;

export const updatePasswordInput = z.object({
  oldPassword: z.string(),
  newPassword: PasswordSchema,
});

export type updatePasswordInput = z.infer<typeof updatePasswordInput>;

export const OtpInput = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
});

export type OtpInput = z.infer<typeof OtpInput>;

export const VerifyTokenInput = z.object({
  email: z.string().email(),
  code: z.string(),
});

export type verifyTokenInput = z.infer<typeof VerifyTokenInput>;
