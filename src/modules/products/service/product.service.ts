import { CreateCategoryInput, UpdateCategoryInput } from '../dto/product.input';
import { ProductRepository } from '../repository/product.repository';

export class Productservice {
  constructor(private productRepository: ProductRepository = new ProductRepository()) {}

  async createCategory(data: CreateCategoryInput) {
    const existingCategory = await this.productRepository.getCategory(data.name);

    if (existingCategory) throw new Error('Category already exist');

    const category = await this.productRepository.createProductCategory(data.name);

    return category;
  }

  async updateCategory(data: UpdateCategoryInput) {
    const category = await this.productRepository.getCategory(data.categoryName);

    if (!category) throw new Error('Category does not exist');

    const updatedCategory = await this.productRepository.updateCategory(
      data.categoryId,
      data.categoryName,
    );

    return updatedCategory;
  }
}
