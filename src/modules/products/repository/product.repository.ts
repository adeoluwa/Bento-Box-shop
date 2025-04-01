import prisma from '../../../core/utils/prisma';
import { Product } from '@prisma/client';

export class ProductRepository {
  async createProduct(
    name: string,
    description: string,
    category: string,
    price: number,
    stock: number,
  ) {
    return await prisma.product.create({
      data: {
        name,
        description,
        price,
        category: {
          connect: { id: category },
        },
        stock,
      },
    });
  }

  async updateProductDetails(
    productId: string,
    price: string,
    stock: number,
    description: string,
  ) {
    return await prisma.product.update({
      where: { id: productId },
      data: {
        price,
        stock,
        description,
      },
    });
  }

  async deleteProduct(productId: string) {
    return await prisma.product.delete({
      where: { id: productId },
    });
  }

  async getProductById(productId: string) {
    return await prisma.product.findUnique({
      where: { id: productId },
    });
  }

  async getProductByCategoryId(categoryId: string) {
    return await prisma.product.findFirstOrThrow({
      where: { category_id: categoryId },
    });
  }

  async listAllProducts(skip: number, take: number) {
    return await prisma.product.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
      },
    });
  }

  async createProductCategory(name: string) {
    return await prisma.category.create({
      data: {
        name,
      },
    });
  }

  async listCategories(skip: number, take: number) {
    return await prisma.category.findMany({
      skip,
      take,
      select: {
        name: true,
        products: true,
      },
    });
  }

  async getCategory(name: string) {
    return await prisma.category.findFirst({
      where: { name },
    });
  }

  async updateCategory(id: string, updatedName: string) {
    return await prisma.category.update({
      where: { id },
      data: { name: updatedName },
    });
  }
}
