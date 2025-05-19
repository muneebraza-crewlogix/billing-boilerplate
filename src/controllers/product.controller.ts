import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { productService, CreateProductDTO } from '@/services/product.service';

export async function createProductHandler(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const dto = req.body as CreateProductDTO;
    const product = await productService.createProduct(dto);
    res.status(StatusCodes.CREATED).json(product);
  } catch (err) {
    next(err);
  }
}

export async function listProductsHandler(
  _req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const products = await productService.listProducts();
    res.status(StatusCodes.OK).json(products);
  } catch (err) {
    next(err);
  }
}