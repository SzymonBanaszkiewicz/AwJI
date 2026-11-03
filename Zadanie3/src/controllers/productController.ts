import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { productSchema } from '../schemas/productSchema';
import type { Request, Response } from 'express';

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

export async function getProductByID(
  eq: Request,
  res: Response
): Promise<void>  {

}

export async function updateProduct(
  eq: Request,
  res: Response
): Promise<void>  {
    
}

export async function deleteProduct(
  eq: Request,
  res: Response
): Promise<void>  {
    
}