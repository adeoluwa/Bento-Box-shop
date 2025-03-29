import { z } from 'zod';

import { LoginOrCreateUserInput } from './auth.input';

export const Auth = z.object({
  token: z.string().optional(),
  // user: LoginOrCreateUserInput.omit({ password: true }),
  user: z.object({
    email: z.string().email(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  }),
  authType: z.enum(['login', 'register', 'password_reset']),
  requiresVerification: z.boolean().optional(),
});

export type AuthResponse = z.infer<typeof Auth>;

export const OtpRequestResponse = z.object({
  code: z.string(),
});

export type OtpRequestResponse = z.infer<typeof OtpRequestResponse>;
