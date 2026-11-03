import { Category } from "../models/Category";
import type { Request, Response } from 'express';
import { categorySchema } from "../schemas/categorySchema";


export async function getCategories(
  req: Request,
  res: Response
): Promise<void>  {
    try {
        const categories = await Category.find();
    
        res.status(200).json({
          status: 'ok',
          categories,
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    
        res.status(500).json({
          status: 'error',
          message: 'Failed to fetch categories',
        });
    }
}

export async function createCategory(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const validation = categorySchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid category data',
        errors: validation.error.issues,
      });
      return;
    }

    const category = await Category.create(validation.data);

    res.status(201).json({
      status: 'ok',
      category,
    });
  } catch (error) {
    console.error('Error creating category:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to create category',
    });
  }
}