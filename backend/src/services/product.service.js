import { prisma } from "../config/prisma.js";
import { Product } from "../models/Product.js";
import { AppError } from "../utils/AppError.js";

export class ProductService {
  mapProduct(record) {
    return new Product(record).toJSON();
  }

  async listProducts() {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return products.map((product) => this.mapProduct(product));
  }

  async getProductById(productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true
      }
    });

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    return this.mapProduct(product);
  }

  async createProduct(payload) {
    await this.ensureCategoryExists(payload.categoryId);

    const created = await prisma.product.create({
      data: payload,
      include: {
        category: true
      }
    });

    return this.mapProduct(created);
  }

  async updateProduct(productId, payload) {
    await this.getProductById(productId);

    if (payload.categoryId) {
      await this.ensureCategoryExists(payload.categoryId);
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: payload,
      include: {
        category: true
      }
    });

    return this.mapProduct(updated);
  }

  async deleteProduct(productId) {
    await this.getProductById(productId);

    await prisma.product.delete({
      where: { id: productId }
    });
  }

  async ensureCategoryExists(categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      throw new AppError("Category not found.", 404);
    }
  }
}
