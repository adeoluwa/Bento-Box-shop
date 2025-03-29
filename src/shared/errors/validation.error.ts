import { createAppError } from '../../core/error';

export const ValidationError = createAppError('ValidationError', 400);
export const InputFormatError = createAppError('InputFormatError', 422);
