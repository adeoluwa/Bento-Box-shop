import { createAppError } from '../../core/error';

export const InvalidCredentialsError = createAppError('InvalidCredentialsError', 401);
export const AuthorizationError = createAppError('AuthorizationError', 403);
export const AuthenticationError = createAppError("AuthenticationError",410)
export const UserNotFoundError = createAppError('UserNotFoundError', 404);
export const InvalidOtpError = createAppError('InvalidOtpError', 400);
export const OtpExpiredError = createAppError('OtpExpiredError', 400);
export const SessionExpiredError = createAppError('SessionExpiredError', 419);
