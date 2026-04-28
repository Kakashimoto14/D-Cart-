import { ProductService } from "../services/product.service.js";

const productService = new ProductService();

export const listProducts = async (_req, res) => {
  const products = await productService.listProducts();
  res.status(200).json({ products });
};

export const getProduct = async (req, res) => {
  const product = await productService.getProductById(Number(req.params.id));
  res.status(200).json({ product });
};

export const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({ product });
};

export const updateProduct = async (req, res) => {
  const product = await productService.updateProduct(Number(req.params.id), req.body);
  res.status(200).json({ product });
};

export const deleteProduct = async (req, res) => {
  await productService.deleteProduct(Number(req.params.id));
  res.status(204).send();
};
