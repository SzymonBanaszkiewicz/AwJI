import { Router } from 'express';
import { createProduct, getProductById, getProducts, updateProduct } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.patch('/:id', updateProduct);

export default router;