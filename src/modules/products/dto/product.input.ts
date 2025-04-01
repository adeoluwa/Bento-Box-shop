import { z } from 'zod';

export const CreateProductInput = z.object({
  name: z.string().min(2, 'Product name must be greater than 2'),
  description: z.string().min(4, 'Product description have to be self explainatory'),
  price: z.number(),
  stock: z.number(),
});

export type CreateProductInput = z.infer<typeof CreateProductInput>;

export const UpdateProductInput = z.object({});

export type UpdateProductInput = z.infer<typeof UpdateProductInput>;

export const DeleteProductInput = z.object({});

export type DeleteProductInput = z.infer<typeof DeleteProductInput>;

export const CreateCategoryInput = z.object({
  name: z.string().min(2, 'Category name must be greater than 2'),
});

export type CreateCategoryInput = z.infer<typeof CreateCategoryInput>;

export const UpdateCategoryInput = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
});

export type UpdateCategoryInput = z.infer<typeof UpdateCategoryInput>;
