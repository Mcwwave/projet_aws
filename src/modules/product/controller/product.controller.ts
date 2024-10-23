import { Request, Response } from 'express';
import { scanProductsFromDatabase } from '../../../helpers/database';
import { s3Client } from '../../../helpers/s3';
import { createProduct, getProductById, getAllProducts, updateProduct, deleteProduct } from '../service/product.service';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
    const searchTerm = req.query.search ? (req.query.search as string) : '';
    const category = req.query.category ? (req.query.category as string) : '';
    const priceSort = req.query.priceSort ? (req.query.priceSort as string) : '';

    const products = await scanProductsFromDatabase();

    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'No products found' });
    }

    let filteredProducts = products.filter((item: any) => {
      const itemName = item.ProductName.toLowerCase() || '';
      const itemCategory = item.Category.toLowerCase() || '';

      const matchesSearch = searchTerm ? itemName.includes(searchTerm.toLowerCase()) : true;
      const matchesCategory = category ? itemCategory === category.toLowerCase() : true;

      return matchesSearch && matchesCategory;
    });

    // Générer des URL signées pour les images stockées dans S3
    filteredProducts = await Promise.all(
      filteredProducts.map(async (item: any) => {
        const imageKey = item.Image;
    
        const command = new GetObjectCommand({
          Bucket: "aws-imt-s3",
          Key: imageKey.split("/").pop(),
        });
    
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
        return { ...item, Image: signedUrl };
      })
    );
    
    if (priceSort === 'ASC') {
      filteredProducts.sort((a: any, b: any) => {
        return parseFloat(a.Price) - parseFloat(b.Price);
      });
    } else if (priceSort === 'DESC') {
      filteredProducts.sort((a: any, b: any) => {
        return parseFloat(b.Price) - parseFloat(a.Price);
      });
    }

    res.status(200).json({searchTerm, category, priceSort, filteredProducts});
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
