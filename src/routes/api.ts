import { Router } from 'express';
import { addProduct, getProduct, getProducts, updateProductDetails, removeProduct } from '../modules/product/controller/product.controller';
import { health } from '../modules/healthCheck';

const router = Router();

router.get('/health', health);
router.post('/products', addProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.put('/products/:id', updateProductDetails);
router.delete('/products/:id', removeProduct);

export default router;
