import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { productSchema, updateProductSchema } from '../schemas/productSchema';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';

export async function getProducts(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const products = await Product.find();

    res.status(200).json({
      status: 'ok',
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
    });
  }
}

export async function createProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const validation = productSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid product data',
        errors: validation.error.issues,
      });
      return;
    }

    const category = await Category.findById(
      validation.data.categoryId
    );

    if (!category) {
      res.status(400).json({
        status: 'error',
        message: 'Category does not exist',
      });
      return;
    }

    const product = await Product.create(validation.data);

    res.status(201).json({
      status: 'ok',
      product,
    });
  } catch (error) {
    console.error('Error creating product:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to create product',
    });
  }
}

export async function getProductById(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  const id = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
      status: 'error',
      message: "Incorrect ID format",
      });
    return;
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
      status: 'error',
      message: "Product not found",
      });
    return;
    }

    res.status(200).json({
      status: 'ok',
      product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product',
    });
  }
}

export async function updateProduct(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: 'error',
        message: 'Incorrect ID format',
      });
      return;
    }

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
      return;
    }

    const validation = updateProductSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid product data',
        errors: validation.error.issues,
      });
      return;
    }

    if (validation.data.categoryId) {
      const category = await Category.findById(
        validation.data.categoryId
      );

      if (!category) {
        res.status(400).json({
          status: 'error',
          message: 'Category does not exist',
        });
        return;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      validation.data,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'ok',
      product: updatedProduct,
    });

  } catch (error) {
    console.error('Error updating product:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
    });
  }
}