import { Request, Response } from 'express';
import { scanProductsFromDatabase } from '../../../helpers/database';
import { createProduct, getProductById, getAllProducts, updateProduct, deleteProduct } from '../service/product.service';

export const addProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    await createProduct(product);
    res.status(201).json({ message: 'Product created successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating product', details: error });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product.Item) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product.Item);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product', details: error });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await scanProductsFromDatabase();

    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'No products found' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products', details: error });
  }
};


export const updateProductDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = req.body;
    const updatedProduct = await updateProduct(id, product);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product', details: error });
  }
};

export const removeProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    res.json({ message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product', details: error });
  }
};
