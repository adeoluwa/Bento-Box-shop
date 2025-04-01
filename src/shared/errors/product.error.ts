import { createAppError } from "../../core/error";

export const ProductNotFoundError = createAppError('ProductNotfoundError', 404);
export const InvalidCategoryError = createAppError('InvalidCategoryError',404);