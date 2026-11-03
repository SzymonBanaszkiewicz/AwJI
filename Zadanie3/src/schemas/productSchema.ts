import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nazwa produktu jest wymagana'),

  description: z
    .string()
    .trim()
    .min(1, 'Opis produktu jest wymagany'),

  price: z
    .number()
    .positive('Cena musi być większa od zera'),

  weight: z
    .number()
    .positive('Waga musi być większa od zera'),

  categoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Nieprawidłowy identyfikator kategorii'),
});

export const updateProductSchema = productSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided'
  );